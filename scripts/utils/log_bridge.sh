
#!/usr/bin/env bash
# log_bridge.sh - Phoenix Logging Bridge v3.0
# Centralized bridge between Bash and Node.js logger

# ⚠️ Zet 'set -u' NA het definiëren van defaults, zodat we eerst variabelen kunnen vullen.
set -eo pipefail

# === Project Root Detection ===
if [[ -z "${PROJECT_ROOT:-}" ]]; then
  PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
  export PROJECT_ROOT
fi

# === Logger Path ===
# Defensieve default (werkt ook als env LOGGER_PATH leeg of unset is)
: "${LOGGER_PATH:=${PROJECT_ROOT}/scripts/utils/logger.js}"

# Nu kunnen we veilig nounset inschakelen:
set -u

# === Color Fallbacks (if logger unavailable) ===
if [[ -t 1 ]] && [[ -z "${NO_COLOR:-}" ]]; then
  RED='\033[0;31m'
  GREEN='\033[0;32m'
  YELLOW='\033[0;33m'
  BLUE='\033[0;34m'
  DIM='\033[2m'
  BOLD='\033[1m'
  NC='\033[0m'
else
  RED=''
  GREEN=''
  YELLOW=''
  BLUE=''
  DIM=''
  BOLD=''
  NC=''
fi

# === Core Bridge Function ===
log_node() {
  local level="$1"
  local key="$2"
  shift 2
  local args=("$@")

  # Sanitize inputs to prevent injection
  key=$(printf '%s' "$key" | sed "s/'/'\\\\''/g")

  if [[ -f "$LOGGER_PATH" ]]; then
    # Build Node command safely
    local node_cmd="const l=require('${LOGGER_PATH}');"
    if [[ ${#args[@]} -gt 0 ]]; then
      local sanitized_args=()
      for arg in "${args[@]}"; do
        sanitized_args+=("$(printf '%s' "$arg" | sed "s/'/'\\\\''/g")")
      done
      node_cmd+="l.${level}(l.TEXT'${key}');"
    else
      node_cmd+="l.${level}('${key}');"
    fi
    node -e "$node_cmd" 2>/dev/null || { _log_fallback "$level" "$key" "${args[@]}"; }
  else
    _log_fallback "$level" "$key" "${args[@]}"
  fi
}

# === Fallback Logger (no Node.js) ===
_log_fallback() {
  local level="$1"; local msg="$2"; shift 2; local args=("$@")
  local full_msg="$msg"; [[ ${#args[@]} -gt 0 ]] && full_msg="$msg: ${args[*]}"
  case "$level" in
    info)  echo -e "${BLUE}ℹ️  ${full_msg}${NC}";;
    ok)    echo -e "${GREEN}✅ ${full_msg}${NC}";;
    warn)  echo -e "${YELLOW}⚠️  ${full_msg}${NC}";;
    error) echo -e "${RED}❌ ${full_msg}${NC}" >&2;;
    *)     echo "${full_msg}";;
  esac
}

# === Public API ===
log_info(){ log_node "info" "$1"; }
log_ok()  { log_node "ok"   "$1"; }
log_warn(){ log_node "warn" "$1"; }
log_err() { log_node "error" "$1"; }

# log_val: For dynamic messages with 1 argument
log_val(){  local level="$1" key="$2" arg="$3"; log_node "$level" "$key" "'$arg'"; }
# log_val2: For dynamic messages with 2 arguments
log_val2(){ local level="$1" key="$2" a1="$3" a2="$4"; log_node "$level" "$key" "'$a1'" "'$a2'"; }
# log_val3: For dynamic messages with 3 arguments
log_val3(){ local level="$1" key="$2" a1="$3" a2="$4" a3="$5"; log_node "$level" "$key" "'$a1'" "'$a2'" "'$a3'"; }

# === Export Functions ===
export -f log_node log_info log_ok log_warn log_err log_val log_val2 log_val3 _log_fallback

# === Validation (self-test) ===
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  echo "🧪 Testing log_bridge.sh..."
  log_info "AUDIT_START"
  log_ok   "DEDUP_OK"
  log_warn "LOCK_STALE"
  log_err  "LOCK_ACTIVE"
  echo "✅ Bridge test complete"
fi
