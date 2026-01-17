#!/bin/bash

# generate-svz0.sh v2.1
# Usage: ./generate-svz0.sh <input_file> [artifact_suffix]

set -e

INPUT_FILE="$1"
ARTIFACT_SUFFIX="${2:-MANUAL}"

# --- 1. Input Validatie ---
if [ -z "$INPUT_FILE" ] || [ ! -f "$INPUT_FILE" ]; then
  echo "❌ FOUT: Input bestand ontbreekt."
  echo "   Gebruik: $0 <input_bestand> [artifact_suffix]"
  exit 1
fi

# --- 2. Context Bepaling (Shift Left) ---
echo "=============================================="
echo "🏗️  PROJECT CONTEXT CONFIGURATIE (Gate 0)"
echo "=============================================="

# Keuze Runtime (Cruciaal voor Nova)
echo "🌐 Selecteer Target Runtime:"
echo "   1) BROWSER_TAMPERMONKEY (User Scripts, F12 Console)"
echo "   2) NODE_TERMINAL (CLI, Server, Backend)"
echo "   3) REACT_NATIVE (Mobile App)"
read -p "👉 Keuze [1-3]: " RUNTIME_OPT

case $RUNTIME_OPT in
  1) RUNTIME="BROWSER_TAMPERMONKEY";;
  2) RUNTIME="NODE_TERMINAL";;
  3) RUNTIME="REACT_NATIVE";;
  *) echo "❌ Ongeldige keuze. Aborting."; exit 1;;
esac

# Keuze Type (Handig voor Max/Strategy)
echo ""
echo "📂 Selecteer Project Type:"
echo "   1) MIGRATION (Refactor existing logic)"
echo "   2) NEW_FEATURE (Greenfield)"
echo "   3) BUGFIX (Forensic Repair)"
read -p "👉 Keuze [1-3]: " TYPE_OPT

case $TYPE_OPT in
  1) PROJ_TYPE="MIGRATION";;
  2) PROJ_TYPE="NEW_FEATURE";;
  3) PROJ_TYPE="BUGFIX";;
  *) echo "❌ Ongeldige keuze. Aborting."; exit 1;;
esac

# PII Check
echo ""
echo "🔍 PII Check:"
read -p "👉 Bevat dit bestand gevoelige persoonsgegevens? (j/N): " PII_RESPONSE
if [[ "${PII_RESPONSE,,}" == "j" || "${PII_RESPONSE,,}" == "y" ]]; then
  PII="JA"
  echo "⚠️  LET OP: Quinn zal Gate 0 waarschijnlijk blokkeren op PII."
else
  PII="NEE"
fi

# --- 3. Artefact Generatie ---

# Lees inhoud en bereken Hash
CONTENT="$(cat "$INPUT_FILE")"
HASH=$(echo -n "$CONTENT" | shasum -a 256 | cut -d' ' -f1)

# ID en Filename
ARTIFACT_ID="SVZ-0-${ARTIFACT_SUFFIX}"
OUTPUT_FILE="${ARTIFACT_ID}.md"

# Schrijf Markdown met Metadata
# CORRECTIE: Status is PENDING. Quinn moet dit valideren.
cat > "$OUTPUT_FILE" <<EOF
## 📦 Metadata (Verplicht voor Gate 0)
- **Artifact_ID:** $ARTIFACT_ID
- **Role:** CEO MANASSE
- **Timestamp:** $(date -u +"%Y-%m-%dT%H:%M:%SZ")
<context_definition>
  Runtime_Environment: $RUNTIME
  Project_Type: $PROJ_TYPE
</context_definition>
<baseline_integrity>
  SHA256_Hash: $HASH
</baseline_integrity>
- **Source_Commit:** MANUAL_INPUT
- **PII_Attestation:** $PII
- **Status:** PENDING

---

## 📄 Originele Input (SVZ-0)

\`\`\`javascript
$CONTENT
\`\`\`
EOF

echo ""
echo "✅ SVZ-0 Gegenereerd: $OUTPUT_FILE"
echo "ℹ️  Status is PENDING. Bied dit aan bij Quinn (Gate 0) voor validatie."