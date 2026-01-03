#!/usr/bin/env bash
# safe_unused_cleanup.sh — compacte output + opties (strict-safe)
set -euo pipefail

# ---- CLI options ----
VERBOSE=false
QUIET=false
MAX_LINES=10

while [[ $# -gt 0 ]]; do
  case "$1" in
    --verbose) VERBOSE=true; shift ;;
    --quiet)   QUIET=true; shift ;;
    --max-lines)
      shift
      MAX_LINES="${1:-10}"
      shift ;;
    *) break ;;
  esac
done

SYMBOL="${1:-}"
DEF_FILE="${2:-}"
ROOT="${3:-src}"

if [[ -z "$SYMBOL" || -z "$DEF_FILE" ]]; then
  echo "USAGE: $0 [--verbose|--quiet] [--max-lines N] <SYMBOL> <DEF_FILE> [ROOT_DIR]"
  exit 2
fi

GREEN=$'\033[32m'; YELLOW=$'\033[33m'; RED=$'\033[31m'; CYAN=$'\033[36m'; RESET=$'\033[0m'
info()  { [[ "$QUIET" == "true" ]] || echo "${CYAN}[INFO]${RESET} $*"; }
warn()  { [[ "$QUIET" == "true" ]] || echo "${YELLOW}[WARN]${RESET} $*"; }
ok()    { [[ "$QUIET" == "true" ]] || echo "${GREEN}[OK] ${RESET} $*"; }
err()   { echo "${RED}[ERR]${RESET} $*"; }

has_cmd() { command -v "$1" >/dev/null 2>&1; }

SEARCH_CMD=""
SEARCH_ARGS=()
if has_cmd rg; then
  SEARCH_CMD="rg"
  SEARCH_ARGS=( -n -w --hidden --glob '!node_modules' --glob '!dist' --glob '!build' )
else
  SEARCH_CMD="grep"
  SEARCH_ARGS=( -Rnw --exclude-dir=node_modules --exclude-dir=dist --exclude-dir=build )
fi

# ---- 1) Classificatie ----
is_import_in_def=false
is_export_in_def=false

grep -nE "^\s*import\s+\{[^}]*\b${SYMBOL}\b[^}]*\}" "$DEF_FILE" >/dev/null 2>&1 && is_import_in_def=true
grep -nE "^\s*import\s+${SYMBOL}\s+from" "$DEF_FILE" >/dev/null 2>&1 && is_import_in_def=true
grep -nE "^\s*import\s+\*\s+as\s+${SYMBOL}\s+from" "$DEF_FILE" >/dev/null 2>&1 && is_import_in_def=true

grep -nE "^\s*export\s+(const|function|class|type|interface)\s+${SYMBOL}\b" "$DEF_FILE" >/dev/null 2>&1 && is_export_in_def=true
grep -nE "^\s*export\s+\{[^}]*\b${SYMBOL}\b[^}]*\}" "$DEF_FILE" >/dev/null 2>&1 && is_export_in_def=true
grep -nE "^\s*export\s+default\s+${SYMBOL}\b" "$DEF_FILE" >/dev/null 2>&1 && is_export_in_def=true

# ---- 2) Projectbreed zoeken ----
ALL_MATCHES="$($SEARCH_CMD "${SEARCH_ARGS[@]}" "$SYMBOL" "$ROOT" || true)"
OUTSIDE_MATCHES="$(echo "$ALL_MATCHES" | awk -v file="$DEF_FILE" -F: '$1 != file {print}' || true)"

# ---- 3) Barrel check ----
BARREL_MATCHES="$($SEARCH_CMD "${SEARCH_ARGS[@]}" -P "export\\s+\\{[^}]*\\b${SYMBOL}\\b[^}]*\\}" "$ROOT" 2>/dev/null || true)"

# ---- 4) Lokaal gebruik ----
DEF_LINES="$(grep -n -w "$SYMBOL" "$DEF_FILE" || true)"
DEF_NON_IMPORT_LINES="$(echo "$DEF_LINES" | grep -Ev '^\s*[0-9]+:\s*import\s' || true)"

no_usage_beyond_import=false
if [[ "$is_import_in_def" == "true" && -z "$DEF_NON_IMPORT_LINES" ]]; then
  no_usage_beyond_import=true
fi

# ---- 5) Type-check (bindend) ----
tsc_ok=true
if has_cmd npm; then
  if ! npm run tsc -- --noEmit >/dev/null 2>&1; then
    tsc_ok=false
  fi
fi

# ---- 6) Beslissing (strict) ----
decision=""
reason=""

if [[ "$tsc_ok" == "false" ]]; then
  decision="UNSAFE_DO_NOT_TOUCH"
  reason="Type-check faalde: eerst compile-errors oplossen."
elif [[ "$is_export_in_def" == "true" || -n "$BARREL_MATCHES" ]]; then
  decision="DO_NOT_REMOVE_EXPORT"
  reason="Export of barrel gevonden."
elif [[ -n "$OUTSIDE_MATCHES" ]]; then
  decision="AMBIGUOUS_DO_NOT_CHANGE"
  reason="Referenties buiten dit bestand: handmatige inspectie vereist."
elif [[ "$is_import_in_def" == "true" && "$no_usage_beyond_import" == "true" ]]; then
  decision="SAFE_TO_REMOVE_LOCAL"
  reason="Lokale import zonder gebruik."
else
  decision="SAFE_TO_REMOVE_LOCAL"
  reason="Geen export en geen externe referenties."
fi

# ---- 7) Resultaat ----
echo
echo "============================"
echo " DECISION: ${GREEN}${decision}${RESET}"
echo " REASON:   ${reason}"
echo "============================"
