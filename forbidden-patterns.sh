#!/usr/bin/env bash
# forbidden-patterns.sh

echo "🔍 Controleren op verboden patronen..."

# Orchestrator mag geen directe state mutatie doen
if grep -n "this\.state = " src/app/orchestrators/FormStateOrchestrator.ts; then
  echo "❌ FAIL: Orchestrator muteert state direct"
  exit 1
fi

# Reducer mag GEEN validatie bevatten (business logica)
if grep -n "validateAtBoundary" src/app/context/formReducer.ts; then
  echo "❌ FAIL: Reducer bevat validatie (business logica)"
  exit 1
fi

# UI mag geen directe dispatch calls doen
if grep -r "dispatch.*FIELD_CHANGED" src/ui/ --include="*.tsx"; then
  echo "❌ FAIL: UI roept dispatch direct aan"
  exit 1
fi

# Orchestrator mag geen interne reducer functie hebben
if grep -n "function formReducer.*FormState" src/app/orchestrators/FormStateOrchestrator.ts; then
  echo "❌ FAIL: Orchestrator bevat dode reducer code"
  exit 1
fi

# FormContext mag geen dubbele state instanties maken
if grep -n "new FormStateOrchestrator.*initialState" src/app/context/FormContext.tsx | grep -v "useRef" | grep -v "current"; then
  echo "❌ FAIL: FormContext maakt meerdere orchestrator instanties"
  exit 1
fi

echo "✅ Alle forbidden patterns OK"