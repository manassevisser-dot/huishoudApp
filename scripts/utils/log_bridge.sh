#!/usr/bin/env bash
# Phoenix Logging Bridge v3.3 - Hybride

log_node() {
    local cmd="const l = require('${PROJECT_ROOT}/scripts/utils/logger'); l.$1('$2'${3:+, '$3'});"
    node -e "$cmd" 2>/dev/null || echo "$2"
}

log_info() { log_node "info" "$1"; }
log_ok()   { log_node "ok" "$1"; }
log_warn() { log_node "warn" "$1"; }
log_err()  { log_node "error" "$1"; }
log_val()  { log_node "val" "$1" "$2"; }

export -f log_info log_ok log_warn log_err log_val
