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

