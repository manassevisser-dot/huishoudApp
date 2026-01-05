
#!/usr/bin/env bash
set -euo pipefail

# === Paden ===
SRC_DIR="/home/user/pre7/chat_files"
DST_DIR="/home/user/pre7/SAMENVATTING"

timestamp="$(date +"%Y%m%d_%H%M%S")"
mdDst="$DST_DIR/app_journey_$timestamp.md"
jsonlDst="$DST_DIR/app_journey_$timestamp.jsonl"

mkdir -p "$DST_DIR"

echo "🚀 Start combineren van Markdown-bestanden uit: $SRC_DIR"

# === Vind alle .md-bestanden chronologisch (oudste eerst), TAB-gescheiden en NUL-beëindigd ===
#   - %T@ : epoch timestamp met fractie
#   - \t  : onderscheid tussen kolommen (timestamp en pad)
#   - \0  : veilig bestandseinde (bestandsnamen met spaties/haakjes)
#   - sort -z -n -t $'\t' -k1,1 : numeriek sorteren op 1e kolom (timestamp)
tmp_list="$(mktemp)"
trap 'rm -f "$tmp_list"' EXIT

find "$SRC_DIR" -type f -name '*.md' -printf '%T@\t%p\0' \
| sort -z -n -t $'\t' -k1,1 \
| cat > "$tmp_list"

totalFiles=0
: > "$jsonlDst"

# === JSONL bouwen ===
# We lezen per record twee velden: ts<TAB>path\0
while IFS=$'\t' read -r -d '' ts path; do
  totalFiles=$(( totalFiles + 1 ))
  echo "Processing: $path"

  content="$(cat "$path")"
  # Datum tonen in leesbaar formaat (uit stat), met Linux/macOS fallback
  if dateStr="$(stat -c %y "$path" 2>/dev/null)"; then
    date="${dateStr%%.*}"
  else
    date="$(stat -f "%Sm" "$path")"
  fi

  jq -n \
    --arg fn "$path" \
    --arg dt "$date" \
    --arg ct "$content" \
    '{filename: $fn, date: $dt, content: $ct}' >> "$jsonlDst"
done < "$tmp_list"

echo "📝 JSONL gereed. Nu Markdown samenvatting maken..."

# === Markdown genereren ===
cat > "$mdDst" <<EOF
# 🚀 App Journey Overzicht
Gegenereerd op: $(date)
Aantal bestanden: $totalFiles

---
EOF

# Zelfde loop nog eens voor MD-output (zodat we tmp_list hergebruiken)
while IFS=$'\t' read -r -d '' ts path; do
  # Datum opnieuw
  if dateStr="$(stat -c %y "$path" 2>/dev/null)"; then
    date="${dateStr%%.*}"
  else
    date="$(stat -f "%Sm" "$path")"
  fi

  echo "Adding to Markdown: $path"
  {
    printf '## %s (%s)\n\n' "$path" "$date"
    cat "$path"
    printf '\n\n---\n'
  } >> "$mdDst"
done < "$tmp_list"

echo "✅ KLAAR!"
echo "Resultaat in map:"
echo "1. JSONL: $jsonlDst (voor AI training/database)"
echo "2. Markdown: $mdDst (om te lezen)"
