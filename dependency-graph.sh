#!/usr/bin/env bash
# dependency-graph.sh

echo "🔍 Analyseren dependencies..."

# Orchestrator mag alleen dispatch importeren, niet reducer
if grep -n "import.*formReducer" src/app/orchestrators/FormStateOrchestrator.ts; then
  echo "❌ FAIL: Orchestrator importeert reducer"
  exit 1
fi

# Reducer mag geen orchestrator of domein importeren
if grep -n "import.*Orchestrator\|@domain" src/app/context/formReducer.ts; then
  echo "❌ FAIL: Reducer importeert orchestrator of domein"
  exit 1
fi

# UI mag alleen façades gebruiken
if grep -r "import.*FormStateOrchestrator\|formReducer" src/ui/ --include="*.tsx"; then
  echo "❌ FAIL: UI importeert orchestrator/reducer direct"
  exit 1
fi

# FormContext mag alleen reducer en orchestrator gebruiken
if grep -n "import.*@domain\|@adapters" src/app/context/FormContext.tsx; then
  echo "❌ FAIL: FormContext importeert buiten app-laag"
  exit 1
fi

echo "✅ Dependency graph OK"