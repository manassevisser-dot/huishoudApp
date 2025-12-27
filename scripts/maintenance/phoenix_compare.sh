#!/usr/bin/env bash
set -euo pipefail

# phoenix_compare.sh — Geoptimaliseerd voor Cloud Shell / Containers
# - Geen sudo nodig
# - Negeert node_modules/.git voor snelheid
# - Gebruikt grep voor binary detectie (geen 'file' command nodig)

usage() {
  cat <<'USAGE'
Gebruik: ./phoenix_compare.sh <DIR_A> <DIR_B> [--out OUTDIR] [--keywords "kw1,kw2"]

Opties:
  --out OUTDIR       Map voor rapporten (default: ./compare_out)
  --keywords LIST    Komma-gescheiden lijst (default: "phoenix")
  --all              Negeer 'node_modules' en '.git' NIET (standaard wel)

USAGE
}

# ---- Configuratie ----
OUTDIR="./compare_out"
KEYWORDS="phoenix"
IGNORE_SYSTEM_DIRS=true

# ---- Args parsing ----
if [[ $# -lt 2 ]]; then usage; exit 2; fi
DIR_A="$1"; shift
DIR_B="$1"; shift

while [[ $# -gt 0 ]]; do
  case "$1" in
    --out)      OUTDIR="$2"; shift 2;;
    --keywords) KEYWORDS="$2"; shift 2;;
    --all)      IGNORE_SYSTEM_DIRS=false; shift;;
    -h|--help)  usage; exit 0;;
    *)          echo "Onbekende optie: $1" >&2; usage; exit 2;;
  esac
done

# ---- Dependency Check (No Sudo fix) ----
require_cmd() {
  if ! command -v "$1" &> /dev/null; then
    echo "❌ Fout: Commando '$1' niet gevonden. Dit script vereist coreutils." >&2
    exit 1
  fi
}

require_cmd "stat"
require_cmd "grep"
require_cmd "awk"
require_cmd "diff"

# Check hashing tool (sha256sum of shasum)
if command -v sha256sum &> /dev/null; then
  HASHER="sha256sum"
elif command -v shasum &> /dev/null; then
  HASHER="shasum -a 256"
else
  echo "⚠️ Geen sha256sum gevonden, vallend terug op md5sum..."
  require_cmd "md5sum"
  HASHER="md5sum"
fi

# ---- Validatie ----
for d in "$DIR_A" "$DIR_B"; do
  if [[ ! -d "$d" ]]; then echo "❌ Fout: map bestaat niet: $d" >&2; exit 1; fi
done
mkdir -p "$OUTDIR"

INDEX_A="$OUTDIR/index_A.tsv"
INDEX_B="$OUTDIR/index_B.tsv"
CSV="$OUTDIR/compare_report.csv"
MD="$OUTDIR/compare_report.md"

# ---- Helpers ----

# Veilig tekst detecteren zonder 'file' commando
is_text_file() {
  # grep -I behandelt binaire bestanden als non-match en crasht niet
  if grep -qI "." "$1" 2>/dev/null || [[ ! -s "$1" ]]; then
    return 0 # Tekst (of leeg)
  else
    return 1 # Binair
  fi
}

has_keyword() {
  # $1=file path, $2=keywords
  local f="$1"; local kws="$2"
  # Alleen zoeken in tekstbestanden
  if is_text_file "$f"; then
    local pattern
    # Zet komma's om naar pipes voor grep -E (kw1|kw2)
    pattern=$(echo "$kws" | sed 's/,/|/g')
    if grep -I -i -E -q "$pattern" "$f"; then
      echo "yes"; return 0
    fi
  fi
  echo "no"; return 1
}

index_dir() {
  local root="$1"; local out="$2"
  echo -e "dir\trelpath\tbasename\tsize\tmtime_epoch\tmtime_iso\tis_text\thash\tphx" > "$out"
  
  # Bouw find commando op
  local find_cmd=(find "$root" -type f)
  
  if [[ "$IGNORE_SYSTEM_DIRS" == "true" ]]; then
    # Prune node_modules en .git voor performance
    find_cmd=(find "$root" -type d \( -name "node_modules" -o -name ".git" -o -name ".firebase" \) -prune -o -type f -print)
  fi

  "${find_cmd[@]}" | while IFS= read -r f; do
    local rel=${f#"$root/"}
    local base=$(basename "$f")
    
    # Stat (Linux/GNU syntax, standaard in Firebase/Cloud Shell)
    local size epoch iso
    size=$(stat -c "%s" "$f")
    epoch=$(stat -c "%Y" "$f")
    iso=$(date -u -d "@$epoch" +"%Y-%m-%dT%H:%M:%SZ" 2>/dev/null || echo "Unknown")

    # Hash & Type
    local hash=$($HASHER "$f" | awk '{print $1}')
    local is_txt="binary"
    if is_text_file "$f"; then is_txt="text"; fi
    
    local phx=$(has_keyword "$f" "$KEYWORDS")
    
    printf "%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n" \
      "$root" "$rel" "$base" "$size" "$epoch" "$iso" "$is_txt" "$hash" "$phx" >> "$out"
  done
}

# ---- Uitvoering ----
echo "🔍 Indexeren van $DIR_A..."
index_dir "$DIR_A" "$INDEX_A"
echo "🔍 Indexeren van $DIR_B..."
index_dir "$DIR_B" "$INDEX_B"

echo "📊 Vergelijken en rapport genereren..."

# CSV Header
echo "kind,a_relpath,b_relpath,a_basename,b_basename,status,newest,a_mtime,b_mtime,a_type,b_type,a_phx,b_phx" > "$CSV"

# 1. Name Match Logic (Basename based)
awk -F"\t" 'NR==1{next} FNR==NR{ a[$3] = $0; next }
{ if ($3 in a) { print a[$3] "\t" $0 } }' "$INDEX_A" "$INDEX_B" | \
while IFS=$'\t' read -r a_dir a_rel a_base a_size a_epoch a_iso a_txt a_hash a_phx \
                      b_dir b_rel b_base b_size b_epoch b_iso b_txt b_hash b_phx; do
  
  status="different"
  if [[ "$a_hash" == "$b_hash" ]]; then
    status="identical"
  elif [[ "$a_txt" == "text" && "$b_txt" == "text" ]]; then
     # Quick diff check (exit code 0 = same, 1 = diff)
     if diff -q "$a_dir/$a_rel" "$b_dir/$b_rel" >/dev/null 2>&1; then
        status="identical" # Zou al door hash gedekt moeten zijn, maar voor de zekerheid
     else
        status="different"
     fi
  else
     status="binary_diff"
  fi

  newest="equal"
  if (( a_epoch > b_epoch )); then newest="A"; elif (( b_epoch > a_epoch )); then newest="B"; fi

  echo "name_match,$a_rel,$b_rel,$a_base,$b_base,$status,$newest,$a_iso,$b_iso,$a_txt,$b_txt,$a_phx,$b_phx" >> "$CSV"
done

# 2. Content Match Logic (Hash based, different name)
awk -F"\t" 'NR==1{next} FNR==NR{ a[$8] = a[$8] "\n" $0; next }
{ if ($8 in a) { 
    split(a[$8], lines, "\n")
    for (i in lines) { if (length(lines[i])>0) print lines[i] "\t" $0 }
  }
}' "$INDEX_A" "$INDEX_B" | \
while IFS=$'\t' read -r a_dir a_rel a_base a_size a_epoch a_iso a_txt a_hash a_phx \
                      b_dir b_rel b_base b_size b_epoch b_iso b_txt b_hash b_phx; do
  
  # Skip als het ook een naam-match is (die hebben we al gehad)
  if [[ "$a_base" == "$b_base" ]]; then continue; fi

  newest="equal"
  if (( a_epoch > b_epoch )); then newest="A"; elif (( b_epoch > a_epoch )); then newest="B"; fi

  echo "content_match,$a_rel,$b_rel,$a_base,$b_base,identical,$newest,$a_iso,$b_iso,$a_txt,$b_txt,$a_phx,$b_phx" >> "$CSV"
done

# ---- Markdown Rapport ----
T_A=$(awk 'NR>1{c++}END{print c+0}' "$INDEX_A")
T_B=$(awk 'NR>1{c++}END{print c+0}' "$INDEX_B")
N_MATCH=$(grep -c "^name_match" "$CSV" || true)
C_MATCH=$(grep -c "^content_match" "$CSV" || true)
DIFFS=$(grep -c ",different" "$CSV" || true)
PHX_A=$(awk -F, '$12=="yes"{c++}END{print c+0}' "$CSV")
PHX_B=$(awk -F, '$13=="yes"{c++}END{print c+0}' "$CSV")

cat > "$MD" <<EOF
# 🦅 Phoenix Vergelijkingsrapport

| Bron | Pad | Bestanden | Phoenix Keywords |
|------|-----|-----------|------------------|
| **A** | \`$DIR_A\` | $T_A | $PHX_A |
| **B** | \`$DIR_B\` | $T_B | $PHX_B |

**Gegenereerd:** $(date -u +"%Y-%m-%d %H:%M UTC")

## 📊 Resultaten
- **Naam Matches:** $N_MATCH (Bestanden met dezelfde naam in beide mappen)
- **Inhoud Matches:** $C_MATCH (Verplaatst/Hernoemd maar zelfde inhoud)
- **Verschillen:** $DIFFS (Bestanden met dezelfde naam maar andere inhoud)

## 📂 Details
Zie \`compare_report.csv\` voor de ruwe data.

### Top 10 Recente Verschillen (Nieuwste eerst)
| Bestand (A) | Status | Nieuwste |
|-------------|--------|----------|
$(grep ",different" "$CSV" | head -10 | awk -F, '{printf "| %s | %s | %s |\n", $2, $6, $7}')

EOF

echo "✅ Klaar! Rapporten opgeslagen in: $OUTDIR"
ls -l "$OUTDIR"