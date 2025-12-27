
#!/usr/bin/env bash
set -eo pipefail  # let op: geen -u hier

# Disable nounset alleen tijdens source (voorkomt VSCode env-issues)
set +u
source ".phoenix/core.sh"
source ".phoenix/checkers.sh"
source ".phoenix/extractors.sh"
source ".phoenix/audits.sh"
source ".phoenix/reports.sh"
set -u

# ─────────────────────────────────────────────────────────────────────────────
# PROCESS LOCK (voorkom parallelle audits) + STALE LOCK AUTOCLEAN (30 minuten)
# Plaats dit blok direct onder de shebang en flags, vóór alle 'source' regels.
# ─────────────────────────────────────────────────────────────────────────────

# Repo-root & unieke locknaam per repo (+ user, voor multi-user omgevingen)
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
REPO_NAME="$(basename "$REPO_ROOT")"
LOCKDIR="/tmp/phoenix.audit.lock.${REPO_NAME}.$(id -u)"
LOCK_FILE="$LOCKDIR/started"

# Probeer lock te nemen (mkdir is atomic). Bij succes: schrijf metadata + trap.
if mkdir "$LOCKDIR" 2>/dev/null; then
  echo "$$"  > "$LOCKDIR/pid"
  date       > "$LOCKDIR/started"
  # Lock altijd vrijgeven, ook bij errors of Ctrl+C
  trap 'rm -rf "$LOCKDIR"' EXIT

else
  # ── STALE LOCK CHECK: als lock ouder is dan 30 min (1800s), ruim op en herstart ──
  if [[ -f "$LOCK_FILE" ]]; then
    NOW="$(date +%s)"
    # Cross-platform parsing: eerst BSD/macOS 'date -r', dan GNU/Linux 'date -d', anders 0
    STARTED_TS="$(
      date -r "$(cat "$LOCK_FILE")" +%s 2>/dev/null || \
      date -d "$(cat "$LOCK_FILE")" +%s 2>/dev/null || echo 0
    )"

    if [[ "$NOW" -gt $(( STARTED_TS + 1800 )) ]]; then
      echo "⚠️  Oude lock gevonden (>30 min). Opruimen en opnieuw starten…"
      rm -rf "$LOCKDIR"
      exec "$0" "$@"
    fi
  fi

  # Niet stale: er draait al een audit. Toon info en stop.
  echo "❌ Phoenix audit is al bezig sinds:"
  cat "$LOCK_FILE" 2>/dev/null || echo "(onbekend tijdstip)"
  echo "ℹ️  PID: $(cat "$LOCKDIR/pid" 2>/dev/null || echo '?')"
  exit 1
fi



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