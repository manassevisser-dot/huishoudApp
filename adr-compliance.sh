#!/usr/bin/env bash
# adr-compliance.sh

echo "🔍 Controleren ADR compliance..."

# ADR-01: Single Source of Truth
if [ $(grep -r "dispatch.*FIELD_CHANGED" src/ --include="*.ts" --include="*.tsx" | wc -l) -ne 1 ]; then
  echo "❌ FAIL: Meerdere mutatie-paden gevonden"
  exit 1
fi

# ADR-14: Pure functions
if grep -n "console\.\|Math\.random\|Date\." src/app/context/formReducer.ts; then
  echo "❌ FAIL: Reducer is niet puur"
  exit 1
fi

# ADR-08: Één mutatie-punt
if [ $(grep -r "new FormStateOrchestrator" src/app/context/FormContext.tsx | wc -l) -ne 1 ]; then
  echo "❌ FAIL: Meerdere orchestrator instanties"
  exit 1
fi

echo "✅ ADR compliance OK"