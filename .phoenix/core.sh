#!/bin/bash
# .phoenix/core.sh - Statistieken, Logging & Configuratie
# .phoenix/core.sh
# .phoenix/core.sh

# --- 1. Global Defaults (Voorkomt unbound variable errors) ---
VERBOSE=${VERBOSE:-false}
PARALLEL=${PARALLEL:-false}
DRY_RUN=${DRY_RUN:-false}
SOFT_FAIL=${SOFT_FAIL:-false}
GENERATE_REPORT=${GENERATE_REPORT:-false}
# In .phoenix/core.sh - bij de andere Defaults
export max_household_size=${max_household_size:-5} 

# En voor de zekerheid ook de array waarin we THRESHOLDS opslaan:
declare -A THRESHOLDS
# --- 2. UI Fallbacks (Als .phoenix-audit.conf ze niet definieert) ---
ICON_OK=${ICON_OK:-"✅"}
ICON_FAIL=${ICON_FAIL:-"❌"}
ICON_WARN=${ICON_WARN:-"⚠️"}
# Kleuren (indien nog niet elders gedefinieerd)
# ... (bestaande variabelen) ...
# Kleuren & Stijlen
BOLD=${BOLD:-'\033[1m'}
DIM=${DIM:-'\033[2m'}      # FIX: Deze ontbrak en veroorzaakte de crash
RED=${RED:-'\033[0;31m'}
GREEN=${GREEN:-'\033[0;32m'}
YELLOW=${YELLOW:-'\033[0;33m'}
BLUE=${BLUE:-'\033[0;34m'}
NC=${NC:-'\033[0m'}

# --- Atomaire Tellers ---
init_counters() {
    # Controleer of CACHE_DIR bestaat (analytische veiligheid)
    if [[ -z "${CACHE_DIR:-}" ]]; then
        CACHE_DIR="/tmp/phoenix-audit-cache"
    fi
    mkdir -p "$CACHE_DIR"
    echo "0" > "$CACHE_DIR/total"
    echo "0" > "$CACHE_DIR/passed"
    echo "0" > "$CACHE_DIR/failed"
    : > "$CACHE_DIR/failed_items.txt"
}

# Initialiseer direct bij het laden van de module
init_counters

atomic_inc() {
    local counter="$1"
    local val
    val=$(read_counter "$counter")
    echo "$((val + 1))" > "$CACHE_DIR/$counter"
}

read_counter() {
    cat "$CACHE_DIR/$1" 2>/dev/null || echo "0"
}

record_failure() {
    local _id="${1:-unknown}"
    local _desc="${2:-No description}"
    atomic_inc "failed"
    # Sla ID en Beschrijving op voor de HTML generator
    echo "$_id $_desc" >> "${CACHE_DIR}/failed_items.txt"
}

# --- Logging Helpers ---
log_section() {
    echo -e "\n${BLUE}${BOLD}=== $1 ===${NC}"
}

log_verbose() {
    [[ "$VERBOSE" == "true" ]] && echo -e "${DIM}  [DEBUG] $1${NC}"
}

# --- Config Loader ---
load_config() {
    local conf_file="${PROJECT_ROOT}/.phoenix-audit.conf"
    if [[ -f "$conf_file" ]]; then
        source "$conf_file"
        log_verbose "Config geladen uit $conf_file"
    fi
}