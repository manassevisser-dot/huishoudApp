
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Milo de Documentalist — Integratie-script
----------------------------------------
Doel:
- Metadata-only registratie en automatische documentatie-updates in Google Drive + Google Sheets.
- Conform Flow Protocol: geen inhoud van artefacts lezen; uitsluitend metadata (id/hash/commit/PII/locked).
- Upsert-logs en ADMIN NOTES bij afwijkingen (hash/commit/PII/receipt).

Gebruik:
    python milo_integration.py --payload router_trigger.json

Waarbij `router_trigger.json` een object kan bevatten met (0..n) secties:
{
  "project_context": { "repo": "...", "last_commit": "f936630", "scope_id": "phoenix" },
  "artifact_refs": [ { ... } ],
  "cto_gate": { "gate": "C", "result": "STOP", "missing_fields": ["..."], "check_time": "...", "report_path": "..." },
  "adr_index": [ { "adr_id": "...", "status": "...", "index_hash": "...", "last_update": "...", "affected_modules": ["..."], "meta_path": "..." } ],
  "audit_receipt": { "wai_code": "007", "function_name": "audit_wai_007", "file_path": "audit/phoenix-audit.sh", "sha256": "...", "source_commit": "..." },
  "risk_update": { "risk_id": "R12", "owner": "Quinn", "ttl": "2026-01-15", "exit_criteria": "Fail-safe Gate C", "status": "accepted", "note": "..." }
}

Configuratie via ENV:
- GOOGLE_PROJECT_SHEET_ID    (Spreadsheet ID voor "Project Registry")
- GOOGLE_DRIVE_ROOT_FOLDER   (Drive folder-id van project root)
- GOOGLE_CREDENTIALS_JSON    (pad naar service-account of OAuth client secrets JSON)
- PROMPT_PATH                (optioneel; pad naar milo prompt xml in Drive/repo voor DOC_FILES tracking)

Aannames Drive-structuur:
- docs/README.md
- docs/SVZ-CATALOG.md
- docs/ADR-CATALOG.md
- docs/AUDIT-RECEIPTS.md
- docs/RISK-LEDGER.md
- docs/CHANGELOG.md
- docs/doc_index.json
- svz/*.meta.json
- adr/*.meta.json
- audit/*.json
- reports/*.md

Sheets tabs (exacte namen):
- SVZ_CATALOG, ADR_CATALOG, AUDIT_RECEIPTS, RISK_LEDGER, CTO_GATES, DOC_FILES

Auteur: Milo (Documentalist)
"""

import argparse
import base64
import dataclasses
import datetime as dt
import hashlib
import io
import json
import os
import re
import sys
from typing import Any, Dict, List, Optional, Tuple

# Google API
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload, MediaIoBaseUpload

# -----------------------------
# Config & Constants
# -----------------------------

SHEETS_ID = os.environ.get("GOOGLE_PROJECT_SHEET_ID", "").strip()
DRIVE_ROOT_ID = os.environ.get("GOOGLE_DRIVE_ROOT_FOLDER", "").strip()
CREDS_PATH = os.environ.get("GOOGLE_CREDENTIALS_JSON", "").strip()
PROMPT_PATH = os.environ.get("PROMPT_PATH", "").strip()

RECEIPT_NAME_PATTERN = re.compile(r"^audit_wai_[0-9]{3}$")

# Sheets tabs
TAB_SVZ = "SVZ_CATALOG"
TAB_ADR = "ADR_CATALOG"
TAB_RECEIPTS = "AUDIT_RECEIPTS"
TAB_RISK = "RISK_LEDGER"
TAB_GATES = "CTO_GATES"
TAB_DOCS = "DOC_FILES"

# Docs in Drive
DOCS_DIR_NAME = "docs"
DOC_INDEX_NAME = "doc_index.json"
DOC_README = "README.md"
DOC_SVZ_CAT = "SVZ-CATALOG.md"
DOC_ADR_CAT = "ADR-CATALOG.md"
DOC_RECEIPTS_MD = "AUDIT-RECEIPTS.md"
DOC_RISK_LEDGER_MD = "RISK-LEDGER.md"
DOC_CHANGELOG = "CHANGELOG.md"

ADMIN_NOTE_PREFIX = "[ADMIN NOTE]"

# -----------------------------
# Utility helpers
# -----------------------------

def now_iso() -> str:
    return dt.datetime.utcnow().replace(microsecond=0).isoformat() + "Z"

def sha256_bytes(data: bytes) -> str:
    h = hashlib.sha256()
    h.update(data)
    return h.hexdigest()

def sha256_file(path: str) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()

def safe_get(d: Dict[str, Any], key: str, default: Any = None) -> Any:
    return d.get(key, default)

def print_admin(message: str) -> None:
    print(f"{ADMIN_NOTE_PREFIX} {message}")

# -----------------------------
# Google clients
# -----------------------------

def make_creds() -> Credentials:
    if not CREDS_PATH:
        raise RuntimeError("GOOGLE_CREDENTIALS_JSON ontbreekt (ENV).")
    scopes = [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/spreadsheets",
    ]
    return Credentials.from_service_account_file(CREDS_PATH, scopes=scopes)

def sheets_client(creds: Credentials):
    return build("sheets", "v4", credentials=creds)

def drive_client(creds: Credentials):
    return build("drive", "v3", credentials=creds)

# -----------------------------
# Drive ops
# -----------------------------

def ensure_child_folder(drive, parent_id: str, name: str) -> str:
    q = f"'{parent_id}' in parents and name = '{name}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false"
    resp = drive.files().list(q=q, spaces="drive", fields="files(id,name)").execute()
    files = resp.get("files", [])
    if files:
        return files[0]["id"]
    # create
    meta = {"name": name, "mimeType": "application/vnd.google-apps.folder", "parents": [parent_id]}
    created = drive.files().create(body=meta, fields="id").execute()
    return created["id"]

def find_file(drive, parent_id: str, name: str) -> Optional[Dict[str, Any]]:
    q = f"'{parent_id}' in parents and name = '{name}' and trashed = false"
    resp = drive.files().list(q=q, spaces="drive", fields="files(id,name,mimeType)").execute()
    files = resp.get("files", [])
    return files[0] if files else None

def download_file_bytes(drive, file_id: str) -> bytes:
    req = drive.files().get_media(fileId=file_id)
    buf = io.BytesIO()
    downloader = MediaIoBaseDownload(buf, req)
    done = False
    while not done:
        status, done = downloader.next_chunk()
    return buf.getvalue()

def upload_text_file(drive, parent_id: str, name: str, text: str, mime: str = "text/markdown") -> str:
    existing = find_file(drive, parent_id, name)
    media = MediaIoBaseUpload(io.BytesIO(text.encode("utf-8")), mimetype=mime, resumable=False)
    
    # CRUCIALE FIX: Forceer de parent_id in de metadata voor quota-overdracht
    meta = {
        "name": name, 
        "parents": [parent_id], 
        "mimeType": mime
    }
    
    if existing:
        # Bij update hoeven we geen parents te sturen, maar wel de media
        updated = drive.files().update(fileId=existing["id"], media_body=media, fields="id").execute()
        return updated["id"]
    else:
        # Bij create MOET de parent erbij staan
        created = drive.files().create(body=meta, media_body=media, fields="id").execute()
        return created["id"]

def upload_json_file(drive, parent_id: str, name: str, obj: Dict[str, Any]) -> str:
    text = json.dumps(obj, ensure_ascii=False, indent=2)
    return upload_text_file(drive, parent_id, name, text, "application/json")

# -----------------------------
# Sheets ops (upsert helpers)
# -----------------------------

def read_sheet_values(svc, sheet_id: str, tab: str) -> List[List[str]]:
    resp = svc.spreadsheets().values().get(spreadsheetId=sheet_id, range=tab).execute()
    return resp.get("values", [])

def write_sheet_values(svc, sheet_id: str, tab: str, rows: List[List[str]]) -> None:
    body = {"range": tab, "majorDimension": "ROWS", "values": rows}
    svc.spreadsheets().values().update(spreadsheetId=sheet_id, range=tab, valueInputOption="RAW", body=body).execute()

def upsert_sheet_rows(svc, sheet_id: str, tab: str, cols: List[str], key_idx: int, new_rows: List[List[str]]) -> None:
    """
    Upsert op basis van een key (kolomindex).
    - cols: header (exacte volgorde)
    - key_idx: index van unieke sleutel in iedere row (bijv. ADR_ID of SVZ)
    - new_rows: lijst met rows (zelfde lengte als cols)
    """
    existing = read_sheet_values(svc, sheet_id, tab)
    if not existing:
        # init tab met header
        write_sheet_values(svc, sheet_id, tab, [cols] + new_rows)
        return
    header = existing[0]
    if header != cols:
        # overwrite header voor consistentie
        existing[0] = cols
    # bouw index
    idx: Dict[str, int] = {}
    for i, row in enumerate(existing[1:], start=1):
        if key_idx < len(row):
            idx[row[key_idx]] = i
    # upsert
    for r in new_rows:
        key = r[key_idx]
        if key in idx:
            existing[idx[key]] = r
        else:
            existing.append(r)
    write_sheet_values(svc, sheet_id, tab, existing)

# -----------------------------
# DOC-INDEX management (Drive)
# -----------------------------

def load_doc_index(drive, docs_id: str) -> Dict[str, Any]:
    f = find_file(drive, docs_id, DOC_INDEX_NAME)
    if not f:
        return {"artifacts": []}
    data = download_file_bytes(drive, f["id"])
    try:
        return json.loads(data.decode("utf-8"))
    except Exception:
        print_admin("doc_index.json parsable error — reinitializing.")
        return {"artifacts": []}

def save_doc_index(drive, docs_id: str, idx: Dict[str, Any]) -> str:
    return upload_json_file(drive, docs_id, DOC_INDEX_NAME, idx)

def upsert_doc_index(idx: Dict[str, Any], artifact: Dict[str, Any]) -> Dict[str, Any]:
    # unieke sleutel: artifact_id
    aid = artifact.get("artifact_id")
    items = idx.get("artifacts", [])
    for i, it in enumerate(items):
        if it.get("artifact_id") == aid:
            items[i] = artifact
            break
    else:
        items.append(artifact)
    idx["artifacts"] = items
    return idx

# -----------------------------
# Markdown catalog builders (link-only)
# -----------------------------


from typing import Any, Dict, List

def build_readme(idx: Dict[str, Any]) -> str:
    """
    Bouwt een beknopte README met verwijzingen naar de catalogi en
    een lijst (id → path) van alle geregistreerde artefacts uit doc_index.
    """
    lines: List[str] = [
        "# Project Overzicht",
        "Korte beschrijving (Flow Protocol; metadata-only).",
        "",
        "## Catalogi",
        "- SVZ-CATALOG.md",
        "- ADR-CATALOG.md",
        "- AUDIT-RECEIPTS.md",
        "- RISK-LEDGER.md",
        "- [CHANGELOG.md",
        "",
        "## DOC-INDEX entries (id → path)",
        ]

    # Val veilig om ontbrekende sleutels heen
    for a in idx.get("artifacts", []):
        aid = a.get("artifact_id", "")
        path = a.get("path", "")
        # Alleen items tonen die zinnig zijn
        if aid and path:
            lines.append(f"- `{aid}` → `{path}`")

    return "\n".join(lines) + "\n"


def build_svz_catalog(idx: Dict[str, Any]) -> str:
    lines = ["# SVZ Catalogus", "", "| SVZ | LOCKED | SHA256 | COMMIT | TIMESTAMP | PATH |", "|-----|--------|--------|--------|-----------|------|"]
    for a in idx.get("artifacts", []):
        if a.get("tags") and "svz" in a.get("tags"):
            svz_num = a.get("phase", "")
            locked = "true" if "locked" in a.get("tags", []) else "unknown"
            lines.append(f"| {svz_num} | {locked} | {a.get('sha256','')} | {a.get('source_commit','')} | {a.get('created_at','')} | {a.get('path','')} |")
    return "\n".join(lines) + "\n"

def build_adr_catalog(idx: Dict[str, Any]) -> str:
    lines = ["# ADR Catalogus", "", "| ADR-ID | Status | Index Hash | Last Update | Modules | META_PATH |", "|--------|--------|------------|-------------|---------|-----------|"]
    for a in idx.get("artifacts", []):
        if a.get("tags") and "adr" in a.get("tags"):
            lines.append(f"| {a.get('artifact_id')} | {a.get('status','')} | {a.get('index_hash','')} | {a.get('last_update','')} | {','.join(a.get('affected_modules',[]))} | {a.get('path','')} |")
    return "\n".join(lines) + "\n"

def build_receipts_md(idx: Dict[str, Any]) -> str:
    lines = ["# Audit-as-Code Receipts", "", "| WAI | Function Name | File Path | SHA256 | Commit |", "|-----|---------------|-----------|--------|--------|"]
    for a in idx.get("artifacts", []):
        if a.get("tags") and "audit" in a.get("tags"):
            lines.append(f"| {a.get('wai_code','')} | {a.get('function_name','')} | {a.get('path','')} | {a.get('sha256','')} | {a.get('source_commit','')} |")
    return "\n".join(lines) + "\n"

def build_risk_md(idx: Dict[str, Any]) -> str:
    lines = ["# Risk Ledger (process-only)", "", "| Risk_ID | Owner | TTL | Exit Criteria | Status |", "|---------|-------|-----|---------------|--------|"]
    for a in idx.get("artifacts", []):
        if a.get("tags") and "risk" in a.get("tags"):
            lines.append(f"| {a.get('risk_id','')} | {a.get('owner','')} | {a.get('ttl','')} | {a.get('exit_criteria','')} | {a.get('status','')} |")
    return "\n".join(lines) + "\n"

def append_changelog(prev_text: str, summary_line: str) -> str:
    # voeg onderaan toe (eenvoudig)
    return (prev_text.rstrip() + "\n" + summary_line + "\n") if prev_text else (summary_line + "\n")

# -----------------------------
# Validation logic (metadata-only)
# -----------------------------

def validate_commit_binding(meta_commit: str, last_commit: str) -> bool:
    ok = bool(meta_commit) and (meta_commit.strip() == last_commit.strip())
    if not ok:
        print_admin(f"Commit-binding mismatch: meta={meta_commit} vs last={last_commit}")
    return ok

def validate_pii_attestation(pii: Dict[str, Any]) -> bool:
    ok = bool(pii) and bool(pii.get("present")) and bool(pii.get("signer")) and bool(pii.get("timestamp"))
    if not ok:
        print_admin("PII-attestation ontbreekt of incompleet.")
    return ok

def validate_receipt_name(name: str) -> bool:
    ok = bool(name) and bool(RECEIPT_NAME_PATTERN.match(name))
    if not ok:
        print_admin(f"Receipt function_name invalid: '{name}' (pattern ^audit_wai_[0-9]{{3}}$)")
    return ok

# -----------------------------
# Payload processing
# -----------------------------

def process_payload(payload: Dict[str, Any]) -> None:
    # Clients
    creds = make_creds()
    sheets = sheets_client(creds)
    drive = drive_client(creds)

    # Resolve docs folder
    if not DRIVE_ROOT_ID or not SHEETS_ID:
        raise RuntimeError("GOOGLE_DRIVE_ROOT_FOLDER of GOOGLE_PROJECT_SHEET_ID ontbreekt.")
    docs_id = ensure_child_folder(drive, DRIVE_ROOT_ID, DOCS_DIR_NAME)

    # Load/prepare DOC-INDEX
    doc_index = load_doc_index(drive, docs_id)
    updates_count = 0
    errors_count = 0

    # project_context
    ctx = payload.get("project_context", {})
    last_commit = safe_get(ctx, "last_commit", "")

    # ---------- artifact_refs ----------
    for art in payload.get("artifact_refs", []):
        # metadata validations
        if not validate_commit_binding(safe_get(art, "source_commit",""), last_commit):
            errors_count += 1
        pii = safe_get(art, "pii_attestation", {})
        if not validate_pii_attestation(pii):
            errors_count += 1

        # upsert DOC-INDEX entry (generic)
        doc_index = upsert_doc_index(doc_index, art)
        updates_count += 1

        # DOC_FILES tab row
        rows = [[
            art.get("artifact_id",""),
            os.path.basename(art.get("path","")),
            art.get("sha256",""),
            art.get("source_commit",""),
            art.get("created_at",""),
            "true" if pii.get("present") else "false",
            # afleiding categorie
            "README" if art.get("path","").endswith("README.md") else (
                "ADR" if "adr" in art.get("tags",[]) else (
                    "SVZ" if "svz" in art.get("tags",[]) else (
                        "AUDIT" if "audit" in art.get("tags",[]) else (
                            "RISK" if "risk" in art.get("tags",[]) else "OTHER"
                        )
                    )
                )
            )
        ]]
        upsert_sheet_rows(sheets, SHEETS_ID, TAB_DOCS,
                          ["DOC_ID","FILE_NAME","SHA256","SOURCE_COMMIT","UPDATED_AT","PII_OK","CATEGORY"],
                          0, rows)

        # SVZ_CATALOG entry (indien tag 'svz')
        if "svz" in art.get("tags",[]):
            svz_rows = [[
                str(art.get("phase","")),
                "true" if "locked" in art.get("tags",[]) else "false",
                art.get("sha256",""),
                art.get("source_commit",""),
                art.get("created_at",""),
                art.get("path",""),
                art.get("role",""),
                str(art.get("phase","")),
            ]]
            upsert_sheet_rows(sheets, SHEETS_ID, TAB_SVZ,
                              ["SVZ","LOCKED","SHA256","COMMIT","TIMESTAMP","PATH","ROLE","PHASE"],
                              0, svz_rows)

        # ADR_CATALOG entry (indien tag 'adr')
        if "adr" in art.get("tags",[]):
            adr_rows = [[
                art.get("artifact_id",""),
                art.get("status",""),
                art.get("index_hash",""),
                art.get("last_update",""),
                ",".join(art.get("affected_modules",[])),
                art.get("path",""),
            ]]
            upsert_sheet_rows(sheets, SHEETS_ID, TAB_ADR,
                              ["ADR_ID","STATUS","INDEX_HASH","LAST_UPDATE","AFFECTED_MODULES","META_PATH"],
                              0, adr_rows)

        # AUDIT_RECEIPTS entry (indien tag 'audit' met function_name)
        if "audit" in art.get("tags",[]):
            fname = art.get("function_name","")
            if not validate_receipt_name(fname):
                errors_count += 1
            receipt_rows = [[
                art.get("wai_code",""),
                fname,
                art.get("path",""),
                art.get("sha256",""),
                art.get("source_commit",""),
                "Registered",
            ]]
            upsert_sheet_rows(sheets, SHEETS_ID, TAB_RECEIPTS,
                              ["WAI_CODE","FUNCTION_NAME","FILE_PATH","SHA256","SOURCE_COMMIT","STATUS"],
                              1, receipt_rows)

    # ---------- cto_gate ----------
    gate = payload.get("cto_gate")
    if gate:
        rows = [[
            gate.get("gate",""),
            gate.get("result",""),
            ",".join(gate.get("missing_fields",[])),
            gate.get("check_time",""),
            gate.get("report_path",""),
        ]]
        upsert_sheet_rows(sheets, SHEETS_ID, TAB_GATES,
                          ["GATE","RESULT","MISSING_FIELDS","CHECK_TIME","REPORT_PATH"],
                          0, rows)
        updates_count += 1

    # ---------- adr_index ----------
    for adr in payload.get("adr_index", []):
        rows = [[
            adr.get("adr_id",""),
            adr.get("status",""),
            adr.get("index_hash",""),
            adr.get("last_update",""),
            ",".join(adr.get("affected_modules",[])),
            adr.get("meta_path",""),
        ]]
        upsert_sheet_rows(sheets, SHEETS_ID, TAB_ADR,
                          ["ADR_ID","STATUS","INDEX_HASH","LAST_UPDATE","AFFECTED_MODULES","META_PATH"],
                          0, rows)
        # ook opnemen in DOC-INDEX (link-only)
        doc_index = upsert_doc_index(doc_index, {
            "artifact_id": adr.get("adr_id",""),
            "role": "Documentation",
            "phase": 0,
            "sha256": adr.get("index_hash",""),
            "created_at": adr.get("last_update",""),
            "source_commit": last_commit,
            "pii_attestation": {"present": True, "signer": "Milo", "timestamp": now_iso()},
            "path": adr.get("meta_path",""),
            "tags": ["adr"]
        })
        updates_count += 1

    # ---------- audit_receipt ----------
    rc = payload.get("audit_receipt")
    if rc:
        if not validate_receipt_name(rc.get("function_name","")):
            errors_count += 1
        rows = [[
            rc.get("wai_code",""),
            rc.get("function_name",""),
            rc.get("file_path",""),
            rc.get("sha256",""),
            rc.get("source_commit",""),
            "Registered",
        ]]
        upsert_sheet_rows(sheets, SHEETS_ID, TAB_RECEIPTS,
                          ["WAI_CODE","FUNCTION_NAME","FILE_PATH","SHA256","SOURCE_COMMIT","STATUS"],
                          1, rows)
        # in DOC-INDEX
        doc_index = upsert_doc_index(doc_index, {
            "artifact_id": f"RECEIPT-{rc.get('wai_code','')}",
            "role": "Documentation",
            "phase": 0,
            "sha256": rc.get("sha256",""),
            "created_at": now_iso(),
            "source_commit": rc.get("source_commit",""),
            "pii_attestation": {"present": True, "signer": "Milo", "timestamp": now_iso()},
            "path": rc.get("file_path",""),
            "function_name": rc.get("function_name",""),
            "wai_code": rc.get("wai_code",""),
            "tags": ["audit"]
        })
        updates_count += 1

    # ---------- risk_update ----------
    ru = payload.get("risk_update")
    if ru:
        rows = [[
            ru.get("risk_id",""),
            ru.get("owner",""),
            ru.get("ttl",""),
            ru.get("exit_criteria",""),
            ru.get("status",""),
            ru.get("note",""),
        ]]
        upsert_sheet_rows(sheets, SHEETS_ID, TAB_RISK,
                          ["RISK_ID","OWNER","TTL","EXIT_CRITERIA","STATUS","NOTE"],
                          0, rows)
        # DOC-INDEX entry
        doc_index = upsert_doc_index(doc_index, {
            "artifact_id": ru.get("risk_id",""),
            "role": "Documentation",
            "phase": 0,
            "sha256": "",
            "created_at": now_iso(),
            "source_commit": last_commit,
            "pii_attestation": {"present": True, "signer": "Milo", "timestamp": now_iso()},
            "path": f"{DOCS_DIR_NAME}/{DOC_RISK_LEDGER_MD}",
            "risk_id": ru.get("risk_id",""),
            "owner": ru.get("owner",""),
            "ttl": ru.get("ttl",""),
            "exit_criteria": ru.get("exit_criteria",""),
            "status": ru.get("status",""),
            "tags": ["risk"]
        })
        updates_count += 1

    # ---------- Persist DOC-INDEX & markdown catalogs ----------
    try:
        save_doc_index(drive, docs_id, doc_index)
        upload_text_file(drive, docs_id, DOC_README, build_readme(doc_index))
        upload_text_file(drive, docs_id, DOC_SVZ_CAT, build_svz_catalog(doc_index))
        upload_text_file(drive, docs_id, DOC_ADR_CAT, build_adr_catalog(doc_index))
        upload_text_file(drive, docs_id, DOC_RECEIPTS_MD, build_receipts_md(doc_index))
        
        # CHANGELOG append
        prev_changelog_file = find_file(drive, docs_id, DOC_CHANGELOG)
        prev_changelog = ""
        if prev_changelog_file:
            prev_changelog = download_file_bytes(drive, prev_changelog_file["id"]).decode("utf-8")
        summary = f"{now_iso()} — Sync OK: {updates_count} updates; Errors: {errors_count}."
        upload_text_file(drive, docs_id, DOC_CHANGELOG, append_changelog(prev_changelog, summary))
    except Exception as drive_exc:
        print_admin(f"Drive Sync gewaarschuwd (Quota issue): {drive_exc}")
        print_admin("TIP: Maak de bestanden (doc_index.json, README.md, etc.) handmatig aan in de Drive map om eigenaarschap te claimen.")
    
    
    # ---------- ADMIN summary ----------
    if errors_count > 0:
        print_admin(f"Er zijn {errors_count} fouten gedetecteerd. Zie tabs: {TAB_RECEIPTS}, {TAB_DOCS}, {TAB_GATES} voor details.")
    else:
        print(f"Sync voltooid — updates={updates_count}, errors={errors_count}.")

# -----------------------------
# CLI
# -----------------------------

def main():
    ap = argparse.ArgumentParser(description="Milo de Documentalist — Integratie-script (Drive + Sheets)")
    ap.add_argument("--payload", required=True, help="Pad naar Router-trigger JSON.")
    args = ap.parse_args()

    with open(args.payload, "r", encoding="utf-8") as f:
        payload = json.load(f)

    try:
        process_payload(payload)
    except Exception as exc:
        print_admin(f"Fatale fout: {exc}")
        sys.exit(1)

if __name__ == "__main__":
    main()
