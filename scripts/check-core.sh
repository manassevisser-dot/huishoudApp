#!/bin/bash
# check-core.sh – TypeScript-only validation van de kernarchitectuur
# Gebruik: ./scripts/check-core.sh

set -euo pipefail

echo "🔍 Scanning core architecture (excluding UI, tests, backup)..."

# Vind alle relevante TypeScript-bestanden
SOURCES=$(
  find src \
    -name "*.ts" \
    -not -path "*/__tests__/*" \
    -not -path "*/ui/*" \
    -not -path "*/src_STABLE_BACKUP/*" \
    -not -name "*.tsx"
)

# Compileer met tsc --noEmit en filter ruis
npx tsc --noEmit \
  --skipLibCheck \
  --esModuleInterop \
  $SOURCES \
  2>&1 \
  | grep -v "node_modules" \
  | grep -v "JSX.*flag" \
  | grep -v "esModuleInterop.*default-imported" \
  | grep -v "lib.dom.d.ts" \
  | grep -v "react-native" \
  | grep -v "Cannot redeclare block-scoped variable" \
  > core-errors.txt

ERROR_COUNT=$(grep -c "error TS" core-errors.txt || true)

echo "✅ Done. Found $ERROR_COUNT relevant errors."
echo "📄 Output written to: core-errors.txt"