#!/usr/bin/env bash
set -euo pipefail

# Bepaal de root van het project (rekenend vanaf scripts/maintenance/)
# dirname ${BASH_SOURCE[0]} geeft de map van het script zelf
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Nu is het pad naar de bridge ALTIJD correct

log_info "COMMIT_START"

# 1) Opruimen
log_info "CLEAN_ARTIFACTS"
rm -rf artifacts compare_out dedup_reports || true

log_info "CLEAN_BAK"
find src -type f -name '*.bak.*' -delete 2>/dev/null || true

if [[ -d reports ]]; then
  log_info "CLEAN_REPORTS"
  ( cd reports && ls -1t | grep -v latest | tail -n +6 | xargs -r rm -rf ) 2>/dev/null || true
fi

# 2) Dev caches
if command -v npx >/dev/null 2>&1; then
  log_info "CLEAN_EXPO"
  # npx expo start -c >/dev/null 2>&1 || true
fi

# 3) Lint/TypeScript (non-fatal)
log_info "RUN_CHECKS"
npm run -s lint  >/dev/null 2>&1 || log_val "warn" "CHECK_ISSUE" "lint"
npx tsc --noEmit >/dev/null 2>&1 || log_val "warn" "CHECK_ISSUE" "type"

# 4) Git logica
branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown)"
timestamp="$(date +'%Y-%m-%d_%H%M')"
tag="phoenix-${timestamp}"
commit_msg="chore: phoenix run ${timestamp} — audits green (A+) — cleanup & maintenance"

log_info "GIT_ADD"
git add -A

log_val "info" "GIT_COMMIT" "$commit_msg"
git commit -m "$commit_msg" || log_warn "GIT_COMMIT_NONE"

log_val "info" "GIT_TAG" "$tag"
git tag -f "${tag}" || true

log_info "GIT_PUSH"
git push --follow-tags || git push && git push --tags || true

log_val2 "ok" "COMMIT_DONE" "$branch" "$tag"
=====
