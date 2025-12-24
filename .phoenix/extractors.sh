#!/bin/bash
# .phoenix/extractors.sh - Regex Extractors & Helpers

# --- Reducer Finder ---
find_reducer_file() {
    local _dir="${1:-src}"
    # Zoekt naar bestanden met 'reducer' in de naam of inhoud
    find "$_dir" -type f \( -name "*Reducer*" -o -name "reducer.ts" \) 2>/dev/null | head -1
}

# --- Actie Extractie ---
extract_declared_actions() {
    local _files=("$@")
    # Zoekt naar: export const ACTION_NAME = ... of ACTION_NAME: '...'
    grep -rhE "export const [A-Z0-9_]+| [A-Z0-9_]+: ['\"][A-Z0-9_]+['\"]" "${_files[@]}" 2>/dev/null | \
        grep -oE "[A-Z0-9_]{4,}" | sort -u
}

extract_case_actions() {
    local _file="$1"
    [[ ! -f "$_file" ]] && return
    # Zoekt naar 'case' statements of Redux Toolkit 'builder.addCase'
    grep -E "case [A-Z0-9_.\"']+|builder\.addCase\([A-Z0-9_.]+" "$_file" 2>/dev/null | \
        grep -oE "[A-Z0-9_]{4,}" | sort -u
}

extract_dispatch_actions() {
    local _dir="${1:-src}"
    # Zoekt naar aanroepen van dispatch({ type: ... })
    rg -h "type: [A-Z0-9_.\"']+" "$_dir" 2>/dev/null | \
        grep -oE "[A-Z0-9_]{4,}" | sort -u
}

# --- Line Counter (Helper) ---
count_lines() {
    local _input="$1"
    if [[ -z "$_input" ]]; then echo "0"; return; fi
    printf '%s\n' "$_input" | grep -v '^[[:space:]]*$' | wc -l | tr -dc '0-9'
}

# --- Fix Suggester ---
suggest_fix() {
    local _id="$1"
    case "$_id" in
        "ssot") echo -e "  💡 Gebruik 'as const' voor je selectors om type-lekkage te voorkomen." ;;
        "kernel") echo -e "  💡 Financiële berekeningen moeten in src/logic/finance.ts staan." ;;
        "fsm_incomplete") echo -e "  💡 Controleer of useAppOrchestration.ts alle verplichte statussen bevat." ;;
        "deep_imports") echo -e "  💡 Gebruik @aliases (zoals @ui) i.p.v. ../../../." ;;
        *) echo -e "  💡 Raadpleeg de WAI documentatie voor deze check." ;;
    esac
}