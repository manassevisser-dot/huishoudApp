#!/usr/bin/env bash
# formcontext-checklist.sh

echo "🔍 Valideren FormContext gedrag..."

# Moet useRef gebruiken voor orchestrator
if ! grep -q "useRef<FormStateOrchestrator>" src/app/context/FormContext.tsx; then
  echo "❌ FAIL: FormContext gebruikt geen useRef voor orchestrator"
  exit 1
fi

# Moet dispatch koppelen via setDispatch
if ! grep -q "\.setDispatch(dispatch)" src/app/context/FormContext.tsx; then
  echo "❌ FAIL: FormContext koppelt dispatch niet aan orchestrator"
  exit 1
fi

# Moet valueProvider en stateWriter uit orchestrator halen
if ! grep -q "const valueProvider = orchestratorRef\.current" src/app/context/FormContext.tsx; then
  echo "❌ FAIL: FormContext exposeert geen façades"
  exit 1
fi

# Mag geen state mutaties doen
if grep -n "dispatch.*SET_PAGE_DATA\|UPDATE_FIELD" src/app/context/FormContext.tsx; then
  echo "❌ FAIL: FormContext doet zelf state mutaties"
  exit 1
fi

echo "✅ FormContext gedrag conformeert aan ideale situatie"