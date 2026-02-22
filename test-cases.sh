#!/usr/bin/env bash
# test-cases.sh

echo "🔍 Uitvoeren functionele tests..."

# Test 1: Finance item update via UI flow
npx jest --testNamePattern="finance item update propagates through full chain" src/app/orchestrators/__tests__/FormStateOrchestrator.integration.test.ts

# Test 2: Setup field update via UI flow  
npx jest --testNamePattern="setup field update uses dispatch pattern" src/app/orchestrators/__tests__/FormStateOrchestrator.integration.test.ts

# Test 3: Reducer is pure (geen side effects)
npx jest src/app/context/__tests__/formReducer.purity.test.ts

# Test 4: Geen directe state mutatie in orchestrator
npx jest --testNamePattern="orchestrator does not mutate state directly" src/app/orchestrators/__tests__/FormStateOrchestrator.mutation.test.ts

# Test 5: FormContext heeft één orchestrator instantie
npx jest --testNamePattern="FormContext creates single orchestrator instance" src/app/context/__tests__/FormContext.lifecycle.test.ts

if [ $? -eq 0 ]; then
  echo "✅ Alle test cases slagen"
else
  echo "❌ FAIL: Functionele tests falen"
  exit 1
fi