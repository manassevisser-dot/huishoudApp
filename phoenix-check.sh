#!/bin/bash
# Verzeker dat we stoppen bij fouten, maar we vangen de audit-fail op
set -uo pipefail 

# 1. Definieer de paden (Absoluut maken voor de zekerheid)
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MODULE_DIR="${PROJECT_ROOT}/.phoenix"
export CACHE_DIR="/tmp/phoenix-audit-cache"

# 2. Laad de modules (DE CRUCIALE STAP)
# We doen dit handmatig zonder loop om zeker te weten dat ze geladen zijn
source "${MODULE_DIR}/core.sh"
source "${MODULE_DIR}/checkers.sh"
source "${MODULE_DIR}/extractors.sh"
source "${MODULE_DIR}/audits.sh"
source "${MODULE_DIR}/reports.sh"

main() {
    # Argumenten parsen
    while [[ $# -gt 0 ]]; do
        case "$1" in
            --verbose|-v) export VERBOSE=true; shift ;;
            --report)     export GENERATE_REPORT=true; shift ;;
            --soft-fail)   export SOFT_FAIL=true; shift ;;
            *) shift ;;
        esac
    done

    # Counters op nul zetten (uit core.sh)
    init_counters 

    # Uitvoeren van de audits (uit audits.sh)
    # De '|| true' voorkomt dat het script stopt bij een audit-fout
    run_all_audits || true

    echo -e "\n"

    # Samenvatting tonen (uit reports.sh)
    # Als deze nog steeds 'not found' geeft, staat de functie niet in reports.sh
    if declare -f show_summary > /dev/null; then
        show_summary
        local _audit_exit_code=$?
    else
        echo -e "\033[0;31m❌ Fout: Functie show_summary niet geladen uit reports.sh\033[0m"
        local _audit_exit_code=1
    fi

    # Rapportage genereren (voldoen aan de 'groot huishouden' instructie)
    if [[ "${GENERATE_REPORT:-false}" == "true" ]]; then
        generate_report
        # Voldoen aan instructie 2025-12-07: speciale status check
        if [[ "${THRESHOLDS[max_household_size]:-0}" -gt 5 ]]; then
            echo -e "\033[0;34mℹ️  Statistiek: Huishoudens met > 5 volwassenen krijgen speciale status.\033[0m"
        fi
    fi

    # Afsluiten
    if [[ "${SOFT_FAIL:-false}" == "true" ]]; then
        exit 0
    else
        exit $_audit_exit_code
    fi
}

main "$@"