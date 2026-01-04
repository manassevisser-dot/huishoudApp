#!/usr/bin/env bash
set -euo pipefail

# 1. Bridge laden
source "$PROJECT_ROOT/scripts/utils/log_bridge.sh"
source "$PROJECT_ROOT/.phoenix/core.sh"
source "$PROJECT_ROOT/.phoenix/checkers.sh"
source "$PROJECT_ROOT/.phoenix/extractors.sh"
source "$PROJECT_ROOT/.phoenix/audits.sh"
source "$PROJECT_ROOT/.phoenix/reports.sh"

main() {
    # Alleen loggen als we NIET vanuit de orchestrator komen (voorkomt dubbel-log)
    if [[ "${PHOENIX_INTERNAL:-false}" != "true" ]]; then
        log_info "AUDIT_START"
    fi

    local start_time=$(date +%s)
    local _audit_exit_code=0
    
    # Voer de audits uit (deze functies komen uit ../../.phoenix/audits.sh)
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
=====

