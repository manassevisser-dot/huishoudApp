#!/usr/bin/env bash
# extractors.sh v3.1 - TIMESTAMP_PLACEHOLDER

find_reducer_file() {
    find "${1:-src}" -type f \( -name "*Reducer*" -o -name "reducer.ts" \) 2>/dev/null | head -1
}

extract_declared_actions() {
    grep -rhE "export const [A-Z0-9_]+| [A-Z0-9_]+: ['\"][A-Z0-9_]+" "$@" 2>/dev/null | grep -oE "[A-Z0-9_]{4,}" | sort -u
}

extract_case_actions() {
    [[ ! -f "$1" ]] && return
    grep -E "case [A-Z0-9_.\"']+|builder\.addCase\([A-Z0-9_.]+" "$1" 2>/dev/null | grep -oE "[A-Z0-9_]{4,}" | sort -u
}

extract_dispatch_actions() {
    command -v rg >/dev/null 2>&1 && rg -h "type: [A-Z0-9_.\"']+" "${1:-src}" 2>/dev/null | grep -oE "[A-Z0-9_]{4,}" | sort -u
}

count_lines() {
    [[ -z "$1" ]] && { echo "0"; return; }
    printf '%s\n' "$1" | grep -v '^[[:space:]]*$' | wc -l | tr -dc '0-9'
}
