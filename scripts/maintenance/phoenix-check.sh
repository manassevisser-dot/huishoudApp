#!/usr/bin/env bash
set -euo pipefail

# 1. Bridge laden

# 2. Lock-logica (Voorkomt dat de audit twee keer tegelijk draait)
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
REPO_NAME="$(basename "$REPO_ROOT")"
LOCKDIR="/tmp/phoenix.audit.lock.${REPO_NAME}.$(id -u)"
LOCK_FILE="$LOCKDIR/started"

if mkdir "$LOCKDIR" 2>/dev/null; then
  echo "$$" > "$LOCKDIR/pid"
  date > "$LOCKDIR/started"
  trap 'rm -rf "$LOCKDIR"' EXIT
else
  if [[ -f "$LOCK_FILE" ]]; then
    NOW="$(date +%s)"
    STARTED_TS=$(date -r "$LOCK_FILE" +%s 2>/dev/null || stat -f%m "$LOCK_FILE" 2>/dev/null || echo 0)
    if [[ "$NOW" -gt $(( STARTED_TS + 1800 )) ]]; then
      log_warn "LOCK_STALE"
      rm -rf "$LOCKDIR"
      exec "$0" "$@"
    fi
  fi
  log_err "LOCK_ACTIVE"
  exit 1
fi

# 3. Modules laden (Stil, tenzij verbose)
log_info "AUDIT_START"
set +u
source ".phoenix/core.sh"
source ".phoenix/checkers.sh"
source ".phoenix/extractors.sh"
source ".phoenix/audits.sh"
source ".phoenix/reports.sh"
set -u

#!/usr/bin/env bash
set -euo pipefail

# 1. Bridge laden

main() {
    # Alleen loggen als we NIET vanuit de orchestrator komen (voorkomt dubbel-log)
    if [[ "${PHOENIX_INTERNAL:-false}" != "true" ]]; then
        log_info "AUDIT_START"
    fi

    local start_time=$(date +%s)
    local _audit_exit_code=0
    
    # Voer de audits uit (deze functies komen uit .phoenix/audits.sh)
    run_all_audits || _audit_exit_code=$? 

    # Toon de samenvatting (A+ score)
    if declare -f show_summary > /dev/null; then
        show_summary
    else
        log_err "AUDIT_SUMMARY_FAIL"
        _audit_exit_code=1
    fi

    # Timer berekenen
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    # Tijd loggen via de bridge
    node -e "const l=require('./scripts/utils/logger'); \
      const msg = typeof l.TEXT.FINISH_TIME === 'function' ? l.TEXT.FINISH_TIME('$duration') : l.TEXT.FINISH_TIME; \
      l.info(msg);"

    # Bepaal exit status
    if [[ "${SOFT_FAIL:-false}" == "true" ]]; then
        exit 0
    else
        exit $_audit_exit_code
    fi
}

main "$@"