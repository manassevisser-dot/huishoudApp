#!/usr/bin/env bash
set -euo pipefail

# phoenix_dedup_v2.sh (Fixed Syntax)
DIR="${1:-src}"
OUTDIR="./dedup_reports"
mkdir -p "$OUTDIR"
INDEX="$OUTDIR/full_index.tsv"
REPORT="$OUTDIR/deduplication_report.md"

if ! command -v sha256sum &>/dev/null; then
  if command -v shasum &>/dev/null; then HASHER="shasum -a 256"; else echo "❌ Geen sha256sum gevonden."; exit 1; fi
else HASHER="sha256sum"; fi

echo "🔍 Indexeren van '$DIR'..."
echo -e "path\tbasename\traw_hash\tnorm_hash\tsize" > "$INDEX"

# Indexeren (negeer node_modules, .git, Tempwizard)
find "$DIR" -type d \( -name "node_modules" -o -name ".git" -o -name "Tempwizard" \) -prune -o -type f -print | while read -r f; do
    base=$(basename "$f")
    raw=$($HASHER "$f" | awk '{print $1}')
    norm=$(tr -d '[:space:]' < "$f" | $HASHER | awk '{print $1}')
    size=$(stat -c "%s" "$f" 2>/dev/null || stat -f "%z" "$f")
    echo -e "$f\t$base\t$raw\t$norm\t$size" >> "$INDEX"
done

echo "📊 Rapport genereren..."

# Analyse logica
awk -F"\t" 'NR>1 {count[$3]++} END {for (h in count) if (count[h]>1) print h}' "$INDEX" > "$OUTDIR/dup_hashes.txt"
awk -F"\t" 'NR>1 {norm_counts[$4]++; raw_variants[$4, $3] = 1} END {for (n in norm_counts) {if (norm_counts[n] > 1) {raw_count = 0; for (combined in raw_variants) {split(combined, parts, SUBSEP); if (parts[1] == n) raw_count++}; if (raw_count > 1) print n}}}' "$INDEX" > "$OUTDIR/near_dup_hashes.txt"
awk -F"\t" 'NR>1 {files[$2]++; norms[$2, $4] = 1} END {for (base in files) {if (files[base] > 1) {norm_count = 0; for (combined in norms) {split(combined, parts, SUBSEP); if (parts[1] == base) norm_count++}; if (norm_count > 1) print base}}}' "$INDEX" > "$OUTDIR/name_collisions.txt"

# Rapport schrijven
cat > "$REPORT" <<EOF
# 🦅 Phoenix Deduplicatie Rapport
**Bronmap:** \`$DIR\`
**Gegenereerd:** $(date)

## 🔴 1. Exacte Duplicaten
| Hash (Start) | Bestanden |
|--------------|-----------|
EOF

if [[ ! -s "$OUTDIR/dup_hashes.txt" ]]; then echo "*(Geen)*" >> "$REPORT"; else
    while read -r h; do
        echo "| \`${h:0:8}...\` | <ul>" >> "$REPORT"
        grep "$h" "$INDEX" | cut -f1 | sed 's/^/<li>`/' | sed 's/$/`<\/li>/' >> "$REPORT"
        echo "</ul> |" >> "$REPORT"
    done < "$OUTDIR/dup_hashes.txt"
fi

cat >> "$REPORT" <<EOF

## 🟡 2. "Bijna" Identiek
| Hash (Norm) | Bestanden |
|-------------|-----------|
EOF

if [[ ! -s "$OUTDIR/near_dup_hashes.txt" ]]; then echo "*(Geen)*" >> "$REPORT"; else
    while read -r h; do
        echo "| \`${h:0:8}...\` | <ul>" >> "$REPORT"
        awk -F"\t" -v target="$h" '$4==target {print "<li>`" $1 "`</li>"}' "$INDEX" >> "$REPORT"
        echo "</ul> |" >> "$REPORT"
    done < "$OUTDIR/near_dup_hashes.txt"
fi

cat >> "$REPORT" <<EOF

## 🟠 3. Naamconflicten
Bestanden met dezelfde naam (\`Button.tsx\`) maar verschillende inhoud.

| Bestandsnaam | Locaties |
|--------------|----------|
EOF

if [[ ! -s "$OUTDIR/name_collisions.txt" ]]; then echo "*(Geen)*" >> "$REPORT"; else
    while read -r base; do
        echo "| **$base** | <ul>" >> "$REPORT"
        awk -F"\t" -v target="$base" '$2==target {print "<li>`" $1 "`</li>"}' "$INDEX" >> "$REPORT"
        echo "</ul> |" >> "$REPORT"
    done < "$OUTDIR/name_collisions.txt"
fi

echo "✅ Klaar! Zie $REPORT"