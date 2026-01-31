
#!/usr/bin/env bash
set -euo pipefail

echo "[P1-AUDIT] Start"

# 1) Geen circulaires die P1 blokkeren (verwacht: geen 'circular' output)
if grep -qiE 'circular|cycle' madge-report.txt; then
  echo "[FAIL] Circular dependencies detected"
  exit 1
else
  echo "[OK] No circular dependency indicators found (madge)"
fi

# 2) Coverage snapshot beschikbaar + kernbestanden bestaan
test -f coverage-output.json && echo "[OK] coverage-output.json present" || { echo "[FAIL] coverage missing"; exit 1; }
jq -e '.coverageMap|type=="object"' coverage-output.json >/dev/null && echo "[OK] coverageMap present" || { echo "[FAIL] coverageMap missing"; exit 1; }

# 3) P1 target files aanwezig
for f in \
 src/domain/rules/FieldPathResolver.ts \
 src/domain/rules/visibilityRules.ts \
 src/domain/rules/fieldConstraints.ts \
 src/domain/validation/fieldValidator.ts \
 src/domain/validation/stepValidator.ts \
 src/domain/interfaces/ValueProvider.ts
do
  test -f "$f" && echo "[OK] $f" || { echo "[FAIL] missing $f"; exit 1; }
done

echo "[P1-AUDIT] Passed (structural checks)"
