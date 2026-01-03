#!/usr/bin/env bash
set -euo pipefail

# Bridge laden
if ! command -v log_info >/dev/null 2>&1; then
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
  source "$PROJECT_ROOT/scripts/utils/log_bridge.sh"
fi

# Locking met flock (atomic)
LOCK_FILE="/tmp/phoenix.audit.lock.$(basename "$(git rev-parse --show-toplevel 2>/dev/null || pwd)")"
exec 200>"$LOCK_FILE"
if ! flock -n 200; then
  log_err "LOCK_ACTIVE"
  exit 10
fi

log_info "AUDIT_START"
START_TS=$(date +%s)

# Modules (optioneel) – alleen sourcen als bestanden bestaan
set +u
[ -f ".phoenix/core.sh" ]      && source ".phoenix/core.sh"
[ -f ".phoenix/checkers.sh" ]  && source ".phoenix/checkers.sh"
[ -f ".phoenix/extractors.sh" ]&& source ".phoenix/extractors.sh"
[ -f ".phoenix/audits.sh" ]    && source ".phoenix/audits.sh"
[ -f ".phoenix/reports.sh" ]   && source ".phoenix/reports.sh"
set -u

# Run audits (best effort)
_audit_exit=0
if type run_all_audits >/dev/null 2>&1; then
  run_all_audits || _audit_exit=$?
else
  # geen modules? minimal pass
  _audit_exit=0
fi

# Summary tonen (indien aanwezig)
if type show_summary >/dev/null 2>&1; then
  show_summary || true
else
  log_err "AUDIT_SUMMARY_FAIL"
  _audit_exit=1
fi

DURATION=$(( $(date +%s) - START_TS ))
node -e "const l=require('./scripts/utils/logger'); const msg= l.TEXT.FINISH_TIME? l.TEXT.FINISH_TIME('$DURATION'): '⏱️ Duur'; l.info(msg);" || true

exit $_audit_exit
