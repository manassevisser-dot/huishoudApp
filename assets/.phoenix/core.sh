#!/usr/bin/env bash
# core.sh v3.1 - TIMESTAMP_PLACEHOLDER
VERBOSE=${VERBOSE:-false}
PARALLEL=${PARALLEL:-false}
DRY_RUN=${DRY_RUN:-false}
SOFT_FAIL=${SOFT_FAIL:-false}
GENERATE_REPORT=${GENERATE_REPORT:-false}
export max_household_size=${max_household_size:-5}
declare -A THRESHOLDS

# UI: kleur en iconen
if [[ -t 1 ]] && [[ -z "${NO_COLOR:-}" ]]; then
    ICON_OK="✅"; ICON_FAIL="❌"; ICON_WARN="⚠️"
    BOLD=$'\033[1m'
    DIM=$'\033[2m'
    RED=$'\033[0;31m'
    GREEN=$'\033[0;32m'
    YELLOW=$'\033[0;33m'
    BLUE=$'\033[0;34m'
    NC=$'\033[0m'


else
    ICON_OK="[OK]"; ICON_FAIL="[FAIL]"; ICON_WARN="[WARN]"
    BOLD=''; DIM=''; RED=''; GREEN=''; YELLOW=''; BLUE=''; NC=''
fi

# Cache
init_counters() {
    CACHE_DIR="${CACHE_DIR:-/tmp/phoenix-audit-$$}"
    mkdir -p "$CACHE_DIR"
    for c in total passed failed skipped; do echo "0" > "$CACHE_DIR/$c"; done
    : > "$CACHE_DIR/failed_items.txt"
}

# --- flock-less atomic locking using mkdir (portable & safe) ---

# ---------- LOCKING (flock-less & portable) ----------

ensure_file() {
    local file="$CACHE_DIR/$1"
    [[ ! -f "$file" ]] && echo "0" > "$file"
}

with_lock() {
    local lockdir="$1"
    shift
    local retries=200

    while ! mkdir "$lockdir" 2>/dev/null; do
        sleep 0.01
        retries=$((retries-1))
        [[ $retries -le 0 ]] && {
            echo "Lock timeout on $lockdir" >&2
            return 1
        }
    done

    # release lock when function exits
    trap "rm -rf '$lockdir'" RETURN

    "$@"
}

atomic_inc() {
    local name="$1"
    local file="$CACHE_DIR/$name"
    local lock="$CACHE_DIR/${name}.lock"

    ensure_file "$name"

    with_lock "$lock" bash -c "
        val=\$(cat '$file' 2>/dev/null | tr -dc '0-9')
        [[ -z \"\$val\" ]] && val=0
        echo \$(( val + 1 )) > '$file'
    "
}

read_counter() {
    cat "$CACHE_DIR/$1" 2>/dev/null || echo "0"
}

record_failure() {
    local id="${1:-unknown}"
    local desc="${2:-No desc}"

    atomic_inc failed

    local file="$CACHE_DIR/failed_items.txt"
    local lock="$CACHE_DIR/failed_items.lock"

    with_lock "$lock" bash -c "
        echo '$id $desc' >> '$file'
    "
}



invoke_rule() {
    local r="$1"
    [[ "$(type -t "$r")" == "function" ]] && { "$r"; return $?; }
    echo -e "${YELLOW}${ICON_WARN} Unknown rule: $r${NC}" >&2
    return 2
}

log_section() { echo -e "\n${BLUE}${BOLD}=== $1 ===${NC}"; }
log_verbose() { [[ "$VERBOSE" == "true" ]] && echo -e "${DIM}[DEBUG] $1${NC}"; }

load_config() {
    local c="${PROJECT_ROOT:-.}/.phoenix-check.config"
    [[ -f "$c" ]] && { source "$c"; log_verbose "Config: $c"; } || log_verbose "No config"
}

init_counters
