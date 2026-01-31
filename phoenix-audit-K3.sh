#!/usr/bin/env bash
# phoenix-audit-K3.sh
# Validates K3 addendum: SSOT initialFormState implementation
# Dev GEN4.0.0 - K-Phase Audit

set -euo pipefail

echo "🔍 Phoenix Audit K3: SSOT initialFormState"
echo "=========================================="
echo ""

FAILED=0

# 1) SSOT init gebruikt LANDING
echo "1️⃣ Checking LANDING start..."
if grep -q "activeStep: 'LANDING'" src/app/context/FormContext.tsx >/dev/null 2>&1; then
  echo "✅ PASS: activeStep is LANDING"
else
  echo "❌ FAIL: activeStep niet LANDING"
  FAILED=1
fi

if grep -q "currentPageId: 'landing'" src/app/context/FormContext.tsx >/dev/null 2>&1; then
  echo "✅ PASS: currentPageId is landing"
else
  echo "❌ FAIL: currentPageId niet landing"
  FAILED=1
fi

# 2) initialFormState exported
echo ""
echo "2️⃣ Checking initialFormState export..."
if grep -q "export const initialFormState" src/app/context/FormContext.tsx >/dev/null 2>&1; then
  echo "✅ PASS: initialFormState exported"
else
  echo "❌ FAIL: initialFormState niet geëxporteerd"
  FAILED=1
fi

# 3) FormState type exported
echo ""
echo "3️⃣ Checking FormState type export..."
if grep -q "export type { FormState }" src/app/context/FormContext.tsx >/dev/null 2>&1; then
  echo "✅ PASS: FormState type exported"
else
  echo "❌ FAIL: FormState type niet geëxporteerd"
  FAILED=1
fi

# 4) App gebruikt SSOT-init
echo ""
echo "4️⃣ Checking App.tsx imports from FormContext..."
if grep -q "from '@app/context/FormContext'" src/App.tsx >/dev/null 2>&1; then
  echo "✅ PASS: App.tsx importeert FormContext"
else
  echo "❌ FAIL: App.tsx importeert FormContext niet"
  FAILED=1
fi

# 5) Geen lokale init in App.tsx
echo ""
echo "5️⃣ Checking no local initialFormState in App.tsx..."
if ! grep -q "const initialFormState" src/App.tsx >/dev/null 2>&1; then
  echo "✅ PASS: Geen lokale init in App.tsx"
else
  echo "❌ FAIL: Lokale init gevonden in App.tsx"
  FAILED=1
fi

# 6) Geen EXPORTED duplicaten
echo ""
echo "6️⃣ Checking no exported initialFormState duplicates..."
EXPORTED_DUPLICATES=$(grep -Rn "export const initialFormState" src/ 2>/dev/null | grep -v "FormContext.tsx" | grep -v ".bak" || true)
if [ -z "$EXPORTED_DUPLICATES" ]; then
  echo "✅ PASS: Geen exported duplicaten (FormContext is SSOT)"
else
  echo "❌ FAIL: Exported duplicaten gevonden:"
  echo "$EXPORTED_DUPLICATES"
  FAILED=1
fi

echo ""
echo "=========================================="
if [ $FAILED -eq 0 ]; then
  echo "✅ AUDIT K3 PASS"
  exit 0
else
  echo "❌ AUDIT K3 FAILED"
  exit 1
fi
