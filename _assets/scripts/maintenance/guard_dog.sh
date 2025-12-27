#!/usr/bin/env bash

# Configuratie: bestand|max_kb
TARGETS=(
  "jest.config.js|50"
  "babel.config.js|50"
  "tsconfig.json|100"
  "package.json|200"
)

MAX_FAIL=0

echo "🐕 Guard Dog: Checking file sizes..."

for entry in "${TARGETS[@]}"; do
  IFS="|" read -r FILE MAX_KB <<< "$entry"
  
  if [ -f "$FILE" ]; then
    SIZE_BYTES=$(stat -c%s "$FILE")
    SIZE_KB=$((SIZE_BYTES / 1024))
    
    if [ "$SIZE_KB" -gt "$MAX_KB" ]; then
      echo "❌ FAIL: $FILE is te groot ($SIZE_KB KB). Limiet is $MAX_KB KB."
      MAX_FAIL=1
    else
      echo "✅ PASS: $FILE ($SIZE_KB KB)"
    fi
  fi
done

if [ "$MAX_FAIL" -eq 1 ]; then
  echo "🚨 COMMIT AFGEKEURD: Los de bloating op voordat je commit."
  exit 1
fi

exit 0