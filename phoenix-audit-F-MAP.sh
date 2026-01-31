#!/usr/bin/env bash
# phoenix-audit-F-MAP.sh
# Validates F-fase implementation: strict domain + generieke items lookup
# Nova GEN4 - F-fase Audit

set -euo pipefail

echo "🔍 Phoenix Audit F-MAP: Strict Domain + Items Lookup"
echo "====================================================="
echo ""

FAILED=0

# 1) Household direct support in orchestrator
echo "1️⃣ Checking household direct fields..."
if grep -q "huurtoeslag" src/app/orchestrators/FormStateOrchestrator.ts 2>/dev/null; then
  echo "✅ PASS: household.huurtoeslag support found"
else
  echo "❌ FAIL: Missing household.huurtoeslag direct read"
  FAILED=1
fi

if grep -q "zorgtoeslag" src/app/orchestrators/FormStateOrchestrator.ts 2>/dev/null; then
  echo "✅ PASS: household.zorgtoeslag support found"
else
  echo "❌ FAIL: Missing household.zorgtoeslag direct read"
  FAILED=1
fi

# 2) Finance items lookup present
echo ""
echo "2️⃣ Checking finance items lookup..."
if grep -E "finance[\?\.].*income[\?\.].*items" src/app/orchestrators/FormStateOrchestrator.ts 2>/dev/null >/dev/null; then
  echo "✅ PASS: Income items lookup implemented"
else
  echo "❌ FAIL: Income items lookup missing"
  FAILED=1
fi

if grep -E "finance[\?\.].*expenses[\?\.].*items" src/app/orchestrators/FormStateOrchestrator.ts 2>/dev/null >/dev/null; then
  echo "✅ PASS: Expenses items lookup implemented"
else
  echo "❌ FAIL: Expenses items lookup missing"
  FAILED=1
fi

# 3) Domain FieldId must remain MINIMAL
echo ""
echo "3️⃣ Checking domain FieldId pollution..."
POLLUTION=$(grep -E "streaming_|energieGas|ozb|premie|nettoSalaris|wegenbelasting|lease|afschrijving" src/domain/core.ts 2>/dev/null || true)

if [ -z "$POLLUTION" ]; then
  echo "✅ PASS: Domain FieldId blijft minimal (geen finance keys)"
else
  echo "❌ FAIL: Domain polluted with finance FieldIds:"
  echo "$POLLUTION"
  FAILED=1
fi

# 4) Check FieldId count (should be ~11, not 50+)
echo ""
echo "4️⃣ Checking FieldId size..."
FIELDID_COUNT=$(grep -oP "^\s*\|" src/domain/core.ts | wc -l || echo "0")

if [ "$FIELDID_COUNT" -lt 20 ]; then
  echo "✅ PASS: FieldId count is $FIELDID_COUNT (minimal)"
else
  echo "⚠️  WARNING: FieldId count is $FIELDID_COUNT (should be ~11)"
  # Don't fail, but warn
fi

# 5) Adapter has finance key detection
echo ""
echo "5️⃣ Checking adapter finance key detection..."
if grep -q "isFinanceItemKey" src/adapters/valueProviders/FormStateValueProvider.ts 2>/dev/null; then
  echo "✅ PASS: Adapter has finance key detection"
else
  echo "❌ FAIL: Missing isFinanceItemKey in adapter"
  FAILED=1
fi

echo ""
echo "====================================================="
if [ $FAILED -eq 0 ]; then
  echo "✅ AUDIT F-MAP PASS"
  echo ""
  echo "Domain: Strict & minimal ✅"
  echo "Adapter: Boundary normalisatie ✅"
  echo "Orchestrator: Generieke lookup ✅"
  exit 0
else
  echo "❌ AUDIT F-MAP FAILED"
  exit 1
fi