#!/bin/bash
# phoenix-audit-P3-ui.sh
# Gate R – Full UI Decoupling Audit (P3 Target)
# Author: Ava | Locked: 2026-01-28

set -e

echo "🔍 [P3-UI] Ava Audit Script – Full Decoupling Target"

# 1. Zero domain imports in UI
if grep -r "from '@domain/" src/ui/ --include="*.tsx" --include="*.ts" > /dev/null; then
  echo "❌ FAIL: Domain import detected in UI – P3 decoupling incomplete"
  exit 1
fi

# 2. All validation via provider
if grep -r "\.validateField\|\.validateDobNL\|\.canGoNext" src/ui/ --include="*.tsx" > /dev/null; then
  echo "❌ FAIL: Direct validator call in UI – must use valueProvider"
  exit 1
fi

echo "✅ [P3-UI] FULL DECOUPLING ACHIEVED"
exit 0