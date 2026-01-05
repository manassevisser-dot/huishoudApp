#!/usr/bin/env bash
set -euo pipefail

# phoenix_compare.sh — Vergelijk twee mappen, rapporteer verschillen, timestamps en Phoenix-keys
# Gebruik:
#   ./phoenix_compare.sh <DIR_A> <DIR_B> [--out OUTDIR] [--keywords "phoenix,other"]
# Voorbeeld:
#   ./phoenix_compare.sh src/components src/ui/components --out .phoenix/reports
#
# Output:
#   - OUTDIR/compare_report.csv
#   - OUTDIR/compare_report.md
#   - OUTDIR/index_A.tsv, OUTDIR/index_B.tsv (diagnostiek)

usage() {
  cat <<'USAGE'
Gebruik: phoenix_compare.sh <DIR_A> <DIR_B> [--out OUTDIR] [--keywords "kw1,kw2"]

Vergelijkt recursief:
  • Bestanden met dezelfde bestandsnaam (basename) in beide mappen
  • Bestanden met identieke inhoud (SHA-256), ook als de namen verschillen
Rapporteert per paar:
  • Status: identical / different (text diff) / binary (skipped)
  • Nieuwste timestamp (A/B)
  • Phoenix keywords gevonden (ja/nee) per kant

Opties:
  --out OUTDIR       Map voor rapporten (default: ./compare_out)
  --keywords LIST    Komma-gescheiden lijst (default: "phoenix")

USAGE
}

# ---- Args parsing ----
OUTDIR="./compare_out"
KEYWORDS="phoenix"
if [[ $# -lt 2 ]]; then
  usage; exit 2
fi
DIR_A="$1"; shift
DIR_B="$1"; shift || true

while [[ $# -gt 0 ]]; do
  case "$1" in
    --out)
      OUTDIR="$2"; shift 2;;
    --keywords)
      KEYWORDS="$2"; shift 2;;
    -h|--help)
      usage; exit 0;;
    *)
      echo "Onbekende optie: $1" >&2; usage; exit 2;;
  esac
done

# ---- Validatie ----
for d in "$DIR_A" "$DIR_B"; do
  if [[ ! -d "$d" ]]; then
    echo "Fout: map bestaat niet: $d" >&2
    exit 1
  fi
done
mkdir -p "$OUTDIR"

INDEX_A="$OUTDIR/index_A.tsv"
INDEX_B="$OUTDIR/index_B.tsv"
CSV="$OUTDIR/compare_report.csv"
MD="$OUTDIR/compare_report.md"

# ---- Helpers ----
iso_ts() {
  # Epoch -> ISO8601
  date -u -d "@$1" +"%Y-%m-%dT%H:%M:%SZ"
}

is_text_mime() {
  local mime="$1"
  if [[ "$mime" == text/* ]]; then return 0; fi
  # Treat common code types as text
  case "$mime" in
    application/json|application/javascript|application/xml|application/x-sh|application/x-yaml)
      return 0;;
  esac
  return 1
}

has_keyword() {
  # $1=file path, $2=mime, $3=comma-separated keywords
  local f="$1"; local mime="$2"; local kws="$3"
  if is_text_mime "$mime"; then
    # Build grep -E pattern from comma list
    local pattern
    pattern=$(echo "$kws" | awk -F, '{for(i=1;i<=NF;i++){gsub(/^[ ]+|[ ]+$/,"",$i); if(i==1)printf"%s",$i; else printf"|%s",$i}}')
    if grep -I -i -E -q "$pattern" "$f"; then
      echo "yes"; return 0
    fi
  fi
  echo "no"; return 1
}

index_dir() {
  # $1=DIR, $2=OUTPUT_TSV
  local root="$1"; local out="$2"
  echo -e "dir\trelpath\tbasename\tsize\tmtime_epoch\tmtime_iso\tmime\tsha256\tphx" > "$out"
  # find files; robust with null separator
  while IFS= read -r -d '' f; do
    # relpath (strip root prefix)
    local rel
    rel=${f#"$root/"}
    local base
    base=$(basename "$f")
    # stat
    local size epoch mime hash iso phx
    size=$(stat -c "%s" "$f")
    epoch=$(stat -c "%Y" "$f")
    iso=$(iso_ts "$epoch")
    mime=$(file -b --mime-type "$f")
    # hash
    hash=$(sha256sum "$f" | awk '{print $1}')
    phx=$(has_keyword "$f" "$mime" "$KEYWORDS")
    # output
    printf "%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\t%s\n" \
      "$root" "$rel" "$base" "$size" "$epoch" "$iso" "$mime" "$hash" "$phx" >> "$out"
  done < <(find "$root" -type f -print0)
}

# ---- Index beide mappen ----
echo "Indexeren van $DIR_A en $DIR_B..."
index_dir "$DIR_A" "$INDEX_A"
index_dir "$DIR_B" "$INDEX_B"

echo "Schrijf rapporten naar $OUTDIR..."

# ---- CSV header ----
cat > "$CSV" <<'CSVH'
kind,a_relpath,b_relpath,a_basename,b_basename,status,newest,a_mtime_iso,b_mtime_iso,a_size,b_size,a_mime,b_mime,a_phx,b_phx
CSVH

# ---- Vergelijking: naam-match (basename in beide) ----
awk -F"\t" 'NR==1{next} FNR==NR{ # eerste bestand (A)
  a[$3] = $0; next
}
{ # tweede bestand (B)
  if ($3 in a) {
    print a[$3] "\t" $0
  }
}' "$INDEX_A" "$INDEX_B" | while IFS=$'\t' read -r a_dir a_rel a_base a_size a_epoch a_iso a_mime a_hash a_phx \
                                            b_dir b_rel b_base b_size b_epoch b_iso b_mime b_hash b_phx; do
  status=""
  newest="equal"
  if [[ "$a_hash" == "$b_hash" ]]; then
    status="identical"
  else
    if is_text_mime "$a_mime" && is_text_mime "$b_mime"; then
      if diff -u "$a_dir/$a_rel" "$b_dir/$b_rel" > /dev/null; then
        status="identical"
      else
        status="different"
      fi
    else
      status="binary"
    fi
  fi
  if (( a_epoch > b_epoch )); then newest="A"; elif (( b_epoch > a_epoch )); then newest="B"; fi
  printf "name_match,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s\n" \
    "$a_rel" "$b_rel" "$a_base" "$b_base" "$status" "$newest" \
    "$a_iso" "$b_iso" "$a_size" "$b_size" "$a_mime" "$b_mime" "$a_phx" "$b_phx" >> "$CSV"
done

# ---- Vergelijking: content-match (hash in beide, maar basename verschilt) ----
awk -F"\t" 'NR==1{next} FNR==NR{ # Index A op hash
  a[$8] = a[$8] "\n" $0; next
}
{ # Voor elk B-record, als hash in A, join alle A-records voor die hash
  if ($8 in a) {
    split(a[$8], lines, "\n")
    for (i in lines) {
      if (length(lines[i])>0) print lines[i] "\t" $0
    }
  }
}' "$INDEX_A" "$INDEX_B" | while IFS=$'\t' read -r a_dir a_rel a_base a_size a_epoch a_iso a_mime a_hash a_phx \
                                            b_dir b_rel b_base b_size b_epoch b_iso b_mime b_hash b_phx; do
  if [[ "$a_base" == "$b_base" ]]; then continue; fi
  newest="equal"
  if (( a_epoch > b_epoch )); then newest="A"; elif (( b_epoch > a_epoch )); then newest="B"; fi
  printf "content_match,%s,%s,%s,%s,identical,%s,%s,%s,%s,%s,%s,%s,%s\n" \
    "$a_rel" "$b_rel" "$a_base" "$b_base" "$newest" \
    "$a_iso" "$b_iso" "$a_size" "$b_size" "$a_mime" "$b_mime" "$a_phx" "$b_phx" >> "$CSV"
done

# ---- Genereer Markdown rapport ----
TOTAL_A=$(awk 'NR>1{c++}END{print c+0}' "$INDEX_A")
TOTAL_B=$(awk 'NR>1{c++}END{print c+0}' "$INDEX_B")
NAME_MATCHES=$(awk -F, 'NR>1 && $1=="name_match"{c++}END{print c+0}' "$CSV")
CONTENT_MATCHES=$(awk -F, 'NR>1 && $1=="content_match"{c++}END{print c+0}' "$CSV")
DIFFS=$(awk -F, 'NR>1 && $6=="different"{c++}END{print c+0}' "$CSV")
IDENTICALS=$(awk -F, 'NR>1 && $6=="identical"{c++}END{print c+0}' "$CSV")
PHX_A=$(awk -F, 'NR>1 && $14=="yes"{c++}END{print c+0}' "$CSV")
PHX_B=$(awk -F, 'NR>1 && $15=="yes"{c++}END{print c+0}' "$CSV")

cat > "$MD" <<MD
# Vergelijkingsrapport

**Bron A:** $DIR_A  
**Bron B:** $DIR_B  
**Gegenereerd:** $(date -u +"%Y-%m-%dT%H:%M:%SZ")

## Samenvatting
- Bestanden in A: **$TOTAL_A**
- Bestanden in B: **$TOTAL_B**
- Naam-matches: **$NAME_MATCHES**
- Content-matches (verschillende naam, zelfde inhoud): **$CONTENT_MATCHES**
- Identiek: **$IDENTICALS**
- Verschillen (tekst): **$DIFFS**
- Phoenix keyword in A: **$PHX_A** files  
- Phoenix keyword in B: **$PHX_B** files

## CSV
Rapport: 

	$CSV

## Notities
- *name_match*: bestanden met dezelfde **basename** in beide mappen; status op basis van hash/diff.
- *content_match*: bestanden met identieke **SHA-256** inhoud maar verschillende naam.
- Binary bestanden worden niet gedifft, alleen als *binary* aangemerkt.
MD

echo "Klaar. Zie: $CSV en $MD"
