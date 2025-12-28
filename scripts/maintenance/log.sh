#!/usr/bin/env bash

# Gebruik: log_info "SYNC_START"
log_info() {
    node -e "const l=require('./scripts/utils/logger'); l.info(l.TEXT['$1'] || '$1')"
}

log_ok() {
    node -e "const l=require('./scripts/utils/logger'); l.ok(l.TEXT['$1'] || '$1')"
}

# Voor functions zoals SYNC_ALIASES_FOUND(n)
log_info_val() {
    node -e "const l=require('./scripts/utils/logger'); l.info(l.TEXT['$1']('$2'))"
}