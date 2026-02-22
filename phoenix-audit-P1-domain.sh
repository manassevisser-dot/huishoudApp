#!/bin/bash
# phoenix-audit-P1-domain.sh
# Gate R – Domain Layer Audit (P1)
# Author: Ava | Locked: 2026-01-28

set -e

echo "🔍 [P1-DOMAIN] Ava Audit Script – Gate R"

# 1. Zod detectie in domain (EXCLUDE TESTS)
if grep -r "from 'zod'" src/domain/ --include="*.ts" --exclude="*.test.ts" > /dev/null 2>&1; then
  echo "❌ FAIL: Zod detected in domain layer (violates constraint)"
  exit 1
fi

# 2. UI/Adapter import detectie (EXCLUDE TESTS)
if grep -r "@ui/\|@adapters/" src/domain/ --include="*.ts" --exclude="*.test.ts" > /dev/null 2>&1; then
  echo "❌ FAIL: UI/Adapter import detected in domain"
  exit 1
fi

# 3. Test suite P1 (FIXED: testPathPatterns plural)
echo "🧪 Running domain validation tests..."
npm run test -- --testPathPatterns="src/domain/validation/.*\.test\.ts" || { echo "❌ FAIL: domain/validation tests failed"; exit 1; }
npm run test -- --testPathPatterns="src/domain/rules/FieldPathResolver.*\.test\.ts" || { echo "❌ FAIL: FieldPathResolver tests failed"; exit 1; }
npm run test -- --testPathPatterns="src/domain/rules/visibilityRules.*\.test\.ts" || { echo "❌ FAIL: visibilityRules tests failed"; exit 1; }

# 4. Public API surface check
if ! grep -q "export function validateField(" src/domain/validation/fieldValidator.ts; then
  echo "❌ FAIL: validateField not exported"
  exit 1
fi
if ! grep -q "export function validateDobNL(" src/domain/validation/fieldValidator.ts; then
  echo "❌ FAIL: validateDobNL not exported"
  exit 1
fi
if ! grep -q "export function canGoNext(" src/domain/validation/stepValidator.ts; then
  echo "❌ FAIL: canGoNext not exported"
  exit 1
fi

# 5. Consistency FPR V2
if ! npm run test -- --testNamePattern="CONSISTENCY_FPR_V2"; then
  echo "❌ FAIL: CONSISTENCY_FPR_V2 not green"
  exit 1
fi

echo "✅ [P1-DOMAIN] ALL CHECKS PASSED"
exit 0