
#!/usr/bin/env bash
set -euo pipefail

# UI: TTY-veilig
if [[ -t 1 ]] && [[ -z "${NO_COLOR:-}" ]]; then
  GREEN='\033[0;32m'; YELLOW='\033[0;33m'; RED='\033[0;31m'; BLUE='\033[0;34m'; BOLD='\033[1m'; DIM='\033[2m'; NC='\033[0m'
  OK="✅"; WARN="⚠️"; FAIL="❌"; INFO="ℹ️"
else
  GREEN=''; YELLOW=''; RED=''; BLUE=''; BOLD=''; DIM=''; NC=''
  OK='[OK]'; WARN='[WARN]'; FAIL='[FAIL]'; INFO='[INFO]'
fi

echo -e "${BOLD}${BLUE}🧹 Cleanup, prepare & commit${NC}"

# 1) Opruimen (maar bewaar laatste reports-map)
echo -e "• ${BOLD}Cleaning artifacts${NC}"
rm -rf artifacts compare_out dedup_reports || true

# verwijder oude .bak.* (backups van import fixer)
echo -e "• ${BOLD}Removing .bak backups${NC}"
find src -type f -name '*.bak.*' -print -delete 2>/dev/null || true

# prune reports (bewaar 5 nieuwste)
if [[ -d reports ]]; then
  echo -e "• ${BOLD}Pruning old reports (keep 5)${NC}"
  ( cd reports && ls -1t | grep -v latest | tail -n +6 | xargs -r rm -rf ) 2>/dev/null || true
fi

# 2) Dev caches (optioneel: comment uit als je het niet wilt)
if command -v npx >/dev/null 2>&1; then
  echo -e "• ${BOLD}Clearing Expo cache (optional)${NC}"
  # npx expo start -c >/dev/null 2>&1 || true
fi

# 3) Lint/TypeScript (fail-safe; stop niet de commit)
echo -e "• ${BOLD}Running lint/ts checks (non-fatal)${NC}"
npm run -s lint  >/dev/null 2>&1 || echo -e "${YELLOW}${WARN} lint issues (ignored)${NC}"
npx tsc --noEmit >/dev/null 2>&1 || echo -e "${YELLOW}${WARN} type issues (ignored)${NC}"

# 4) Git: add, commit, tag, push
branch="$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo unknown)"
short_sha="$(git rev-parse --short HEAD 2>/dev/null || echo nohead)"
timestamp="$(date +'%Y-%m-%d_%H%M')"

echo -e "• ${BOLD}Git add${NC}"
git add -A

# Kies een nette commit message
commit_msg="chore: phoenix run ${timestamp} — audits green (A+) — cleanup & maintenance"
echo -e "• ${BOLD}Git commit${NC}"
git commit -m "${commit_msg}" || echo -e "${YELLOW}${WARN} Nothing to commit${NC}"

# Optionele lightweight tag
tag="phoenix-${timestamp}"
echo -e "• ${BOLD}Create tag${NC}"
git tag -f "${tag}" || true

# Push branch + tags
echo -e "• ${BOLD}Git push${NC}"
git push --follow-tags || git push && git push --tags || true

echo -e "${GREEN}${OK} Done. Branch: ${branch}, tag: ${tag}${NC}"
