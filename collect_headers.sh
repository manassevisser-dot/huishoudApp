#!/usr/bin/env bash
# collect_headers.sh — Verzamelt comment headers uit alle src/ bestanden

OUTFILE="comments.txt"

> "$OUTFILE"

find src -type f \( -name "*.ts" -o -name "*.tsx" \) ! -name "*.test.*" ! -name "*.snap" | sort | while read -r file; do
  # Check of /* voorkomt in de eerste 5 regels
  start=$(head -5 "$file" | grep -n '/\*' | head -1 | cut -d: -f1)
  [ -z "$start" ] && continue

  # Pak alles van start tot en met */
  header=$(sed -n "${start},/\*\//p" "$file")

  if [ -n "$header" ]; then
    printf "━━ %s\n%s\n\n" "$file" "$header" >> "$OUTFILE"
  fi
done

echo "📄 $(grep -c '━━' "$OUTFILE") headers gevonden → $OUTFILE"
