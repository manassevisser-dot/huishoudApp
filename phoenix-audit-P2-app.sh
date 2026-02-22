#!/bin/bash
# phoenix-audit-P2-app.sh
# Gate R – App Integration Audit (P2)
# Author: Ava | Locked: 2026-01-28

set -e

echo "🔍 [P2-APP] Ava Audit Script – Gate R"

# 1. Directe domain-validation imports in UI?
if grep -r "from '@domain/validation" src/ui/ src/app/ --include="*.tsx" --include="*.ts" > /dev/null; then
  echo "❌ FAIL: Direct domain/validation import in UI layer (violates ADR-01)"
  exit 1
fi

# 2. WizardController gebruikt valueProvider?
if ! grep -q "props.valueProvider.validateValue" src/ui/screens/Wizard/WizardController.tsx; then
  echo "⚠️ WARNING: WizardController may bypass valueProvider"
  # Not blocking in P2 per constraints, but logged
fi

echo "✅ [P2-APP] INTEGRATION CONSTRAINTS SATISFIED"
exit 0