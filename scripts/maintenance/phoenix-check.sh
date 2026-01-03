
#!/usr/bin/env bash
set -eo pipefail

# ============ Bridge laden ============ 
# We zorgen dat LOGGER_PATH een veilige default heeft vóórdat set -u ergens in je omgeving kan toeslaan.
if ! command -v log_info >/dev/null 2>&1; then
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
  # Defensieve default (werkt ook als env LOGGER_PATH leeg of unset is)
  : "${LOGGER_PATH:=${PROJECT_ROOT}/scripts/utils/logger.js}"
  # Bridge zet zelf later set -u aan, nadat defaults zijn gezet.
  source "$PROJECT_ROOT/scripts/utils/log_bridge.sh"
fi

# ============ Locking met flock (atomic) ============ 
LOCK_FILE="/tmp/phoenix.audit.lock.$(basename "$(git rev-parse --show-toplevel 2>/dev/null || pwd)")"
exec 200>"$LOCK_FILE"
if ! flock -n 200; then
  log_err "LOCK_ACTIVE"
  exit 10
fi

log_info "AUDIT_START"
START_TS="$(date +%s)"

# ============ Optionele audit-modules ============ 
# Sommige projecten hebben geen .phoenix/* bestanden; daarom laden we ze best-effort
# en zetten we set +u tijdelijk aan om 'unbound' issues te voorkomen bij optionele variabelen.
set +u
[[ -f ".phoenix/audits.sh"  ]] && source ".phoenix/audits.sh"
[[ -f ".phoenix/reports.sh" ]] && source ".phoenix/reports.sh"
set -u

# ============ Audit uitvoeren ============ 
_audit_exit=0
if type run_all_audits >/dev/null 2>&1; then
  run_all_audits || _audit_exit=$?
fi

# ============ Samenvatting tonen ============ 
if type show_summary >/dev/null 2>&1; then
  show_summary || true
else
  log_err "AUDIT_SUMMARY_FAIL"
  _audit_exit=1
fi

# ============ Duur loggen ============ 
DURATION=$(( $(date +%s) - START_TS ))
node -e "const l=require('./scripts/utils/logger'); const msg = l.TEXT.FINISH_TIME? l.TEXT.FINISH_TIME('$DURATION') : '⏱️ Duur'; l.info(msg);" || true

exit $_audit_exit
