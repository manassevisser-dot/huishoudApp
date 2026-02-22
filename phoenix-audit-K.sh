#!/usr/bin/env bash
# phoenix-audit-K.sh
# Complete K-Phase validation (K3 + K4)
# Dev GEN4.0.0 - K-Phase Audit

set -euo pipefail

echo "🚀 Phoenix Audit: Complete K-Phase Validation"
echo "=============================================="
echo ""

FAILED=0

# Run K3 audit
echo "📋 Running K3 Audit (SSOT)..."
echo ""
if bash phoenix-audit-K3.sh; then
  echo ""
  echo "✅ K3 Audit: PASS"
else
  echo ""
  echo "❌ K3 Audit: FAILED"
  FAILED=1
fi

echo ""
echo "=============================================="
echo ""

# Run K4 audit
echo "📋 Running K4 Audit (Test/Typing Fixes)..."
echo ""
if bash phoenix-audit-K4.sh; then
  echo ""
  echo "✅ K4 Audit: PASS"
else
  echo ""
  echo "❌ K4 Audit: FAILED"
  FAILED=1
fi

echo ""
echo "=============================================="
echo ""

if [ $FAILED -eq 0 ]; then
  echo "🎉 COMPLETE K-PHASE AUDIT: PASS"
  echo ""
  echo "All 7 CUs validated:"
  echo "  ✅ K3-B1: SSOT Export"
  echo "  ✅ K3-B2: App Uses SSOT"
  echo "  ✅ K-B4: FieldPathResolver Decommission"
  echo "  ✅ K4-B1: Factories DeepPartial"
  echo "  ✅ K4-B2: Union Narrowing"
  echo "  ✅ K4-B3: Jest CLI + Test Helpers"
  echo "  ✅ K4-B4: ThemeContext Non-Null"
  echo ""
  echo "✅ K-Phase ready for Fase F"
  exit 0
else
  echo "❌ COMPLETE K-PHASE AUDIT: FAILED"
  echo ""
  echo "Review audit output above for details"
  exit 1
fi