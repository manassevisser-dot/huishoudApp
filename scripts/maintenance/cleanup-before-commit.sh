#!/usr/bin/env bash
# Automated cleanup before committing
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
source "$PROJECT_ROOT/scripts/utils/log_bridge.sh" || true

echo "🧹 Pre-Commit Cleanup"
echo "──────────────────────────────────────────────────────────"
cd "$PROJECT_ROOT"

# 1. Remove duplicate files (name duplicates like *(*).txt)
duplicates=$(find . -type f -name "*(*).*" ! -path "*/node_modules/*" ! -path "*/.git/*" 2>/dev/null || true)
if [[ -n "$duplicates" ]]; then
  echo "Found duplicate files:"
  echo "$duplicates"
  read -p "Remove these? (y/N) " -n 1 -r; echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "$duplicates" | xargs -I {} rm "{}"
    echo "✅ Removed duplicates"
  else
    echo "Skipped"
  fi
else
  echo "✅ No duplicates found"
fi

# 2. Fix script permissions
fixed=0
while IFS= read -r script; do
  if [[ ! -x "$script" ]]; then chmod +x "$script"; ((fixed++)); fi
done < <(find scripts -type f -name "*.sh" 2>/dev/null || true)
[[ $fixed -gt 0 ]] && echo "✅ Fixed $fixed script(s)" || echo "✅ All scripts executable"

# 3. Remove backup files
backup_count=$(find src -type f \( -name "*.bak" -o -name "*.bak.*" \) 2>/dev/null | wc -l | tr -d ' ' || echo 0)
if [[ "$backup_count" -gt 0 ]]; then
  echo "Found $backup_count backup file(s)"
  read -p "Remove these? (y/N) " -n 1 -r; echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    find src -type f \( -name "*.bak" -o -name "*.bak.*" \) -delete
    echo "✅ Removed backup files"
  else
    echo "Skipped"
  fi
else
  echo "✅ No backup files found"
fi

# 4. Validate shell scripts (syntax fallback)
errors=0
while IFS= read -r script; do
  bash -n "$script" 2>/dev/null || { echo "✗ $script (syntax error)"; ((errors++)); }
done < <(find scripts -type f -name "*.sh" 2>/dev/null || true)
[[ $errors -eq 0 ]] && echo "✅ Shell scripts have valid syntax" || echo "⚠️  $errors script(s) have syntax errors"

# 5. Check debug statements in staged files
debug_files=$(git diff --cached --name-only --diff-filter=ACM | xargs -I {} grep -l -E "(console\.log|debugger;|TODO:|FIXME:)" {} 2>/dev/null || true)
if [[ -n "$debug_files" ]]; then
  echo "⚠️  Debug statements in staged files:"; echo "$debug_files"; echo "Consider removing before commit"
else
  echo "✅ No debug statements in staged files"
fi

# 6. Quick audit (best effort)
if [[ -x "./scripts/maintenance/phoenix-check.sh" ]]; then
  ./scripts/maintenance/phoenix-check.sh || true
fi

echo "──────────────────────────────────────────────────────────"
echo "✅ Cleanup Complete"
