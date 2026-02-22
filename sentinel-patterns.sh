#!/usr/bin/env bash
# sentinel-patterns-v3.sh

echo "🔍 Controleren op v3 Architectuur patronen..."

# 1. Orchestrator: Moet dispatch aanroepen met de gevalideerde data
if ! perl -0777 -ne 'exit 0 if /this\.dispatch\(\{\s+type:\s*'\''FIELD_CHANGED'\'',\s+fieldId,\s+value:\s*validation\.data,?\s+\}\);/s; exit 1' src/app/orchestrators/FormStateOrchestrator.ts; then
  echo "❌ FAIL: Orchestrator dispatcht niet de juiste gevalideerde data"
  exit 1
fi

# 2. Reducer: Moet de 'geboorte-logica' (push bij idx === -1) bevatten
if ! perl -0777 -ne 'exit 0 if /if\s*\(idx\s*===\s*-1\)\s*\{\s*(\/\/.*?\n\s+)?return\s*\[\.\.\.items,\s*\{\s*fieldId:\s*targetId,\s*amount\s*\}\];/s; exit 1' src/app/context/formReducer.ts; then
  echo "❌ FAIL: Reducer mist 'geboorte-logica' voor nieuwe items (setup-flow)"
  exit 1
fi

# 3. FormContext: Moet de Orchestrator instantiëren met de LIVE closure
if ! grep -q "new FormStateOrchestrator(() => state, dispatch)" src/app/context/FormContext.tsx; then
  echo "❌ FAIL: FormContext gebruikt geen live closure (() => state) voor de Orchestrator"
  exit 1
fi

# 4. FormContext: Moet de Orchestrator stabiel houden via useMemo
if ! grep -q "useMemo(() => new FormStateOrchestrator" src/app/context/FormContext.tsx; then
  echo "❌ FAIL: Orchestrator wordt niet stabiel gehouden met useMemo"
  exit 1
fi

# 5. Reducer: Moet immutable updates doen voor household data (Zod compatibel)
if ! grep -q "return { ...state, data: { ...state.data, household:" src/app/context/formReducer.ts; then
  echo "❌ FAIL: Reducer update household data niet op de juiste immutable manier"
  exit 1
fi

echo "✅ Alle v3 Architectuur patronen OK!"