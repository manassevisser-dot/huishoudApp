#!/bin/bash
# .phoenix/checkers.sh - Validatie Logica

check_file_exists() {
    local _file="$1"
    local _desc="$2"
    atomic_inc "total"
    
    if [[ -f "${_file}" ]]; then
        echo -e "${GREEN}${ICON_OK} ${_desc} gevonden${NC}"
        atomic_inc "passed"
        return 0
    else
        echo -e "${RED}${ICON_FAIL} ${_desc} NIET gevonden (${_file})${NC}"
        record_failure "${_desc}"
        return 1
    fi
}

# --- Universele Patroon Checker ---
check_pattern() {
    local _pat="${1:-}"
    local _target="${2:-}"
    local _desc="${3:-Pattern}"
    local _min="${4:-1}"
    local _exclude="${5:-}"
    local _id="${6:-}"
    
    atomic_inc "total"
    log_verbose "Check: ${_desc} op ${_target}"

    # 1. Controleer of target bestaat
    if [[ ! -e "${_target}" ]]; then
        echo -e "${RED}${ICON_FAIL} ${_desc} ${BOLD}(target niet gevonden: ${_target})${NC}"
        record_failure "${_desc}"
        return 1
    fi

    # 2. Zoekactie uitvoeren (ripgrep of grep)
    local _matches=""
    if command -v rg >/dev/null 2>&1; then
        if [[ -n "${_exclude}" ]]; then
            _matches="$(rg -n --type-add 'ts:*.{ts,tsx}' --type ts -e "${_pat}" "${_target}" 2>/dev/null | grep -v "${_exclude}" || true)"
        else
            _matches="$(rg -n --type-add 'ts:*.{ts,tsx}' --type ts -e "${_pat}" "${_target}" 2>/dev/null || true)"
        fi
    else
        local _opts=(-rn --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx")
        _matches="$(grep "${_opts[@]}" -E "${_pat}" "${_target}" 2>/dev/null | { [[ -n "${_exclude}" ]] && grep -v "${_exclude}" || cat; } || true)"
    fi

    # 3. Tellen van resultaten
    local _count="0"
    [[ -n "${_matches}" ]] && _count="$(printf '%s\n' "${_matches}" | grep -c '^')"

    # 4. Evaluatie (DIT MOET HIER ONDERAAN)
    if [[ "${_count}" -ge "${_min}" ]]; then
        echo -e "${GREEN}${ICON_OK} ${_desc} ${BOLD}(${_count})${NC}"
        atomic_inc "passed"
        [[ "${VERBOSE}" == "true" && -n "${_matches}" ]] && printf '%s\n' "${_matches}" | head -3 | sed 's/^/   /'
        return 0
    else
        echo -e "${RED}${ICON_FAIL} ${_desc} ${BOLD}(${_count} < ${_min})${NC}"
        # We slaan het ID en de beschrijving op voor het rapport
        record_failure "${_id}" "${_desc}"
        
        # Directe feedback in de terminal
        [[ -n "${_id}" ]] && suggest_fix "${_id}" "print"
        return 1
    fi
}

# --- Anti-patroon Checker (Verboden elementen) ---
check_antipattern() {
    local _pat="${1:-}"
    local _target="${2:-}"
    local _desc="${3:-Anti-pattern}"
    local _exclude="${4:-}"
    local _id="${5:-}"

    atomic_inc "total"
    if [[ ! -e "${_target}" ]]; then
        echo -e "${YELLOW}${ICON_WARN} ${_desc} ${BOLD}(overslag: doel niet gevonden)${NC}"
        atomic_inc "passed"; return 0
    fi

    # Zoekactie (we hergebruiken de ripgrep/grep logica van check_pattern)
    local _matches=""
    if command -v rg >/dev/null 2>&1; then
        _matches="$(rg -n --type-add 'ts:*.{ts,tsx}' --type ts -e "${_pat}" "${_target}" 2>/dev/null | { [[ -n "${_exclude}" ]] && grep -v "${_exclude}" || cat; } || true)"
    else
        _matches="$(grep -rnE "${_pat}" "${_target}" 2>/dev/null | { [[ -n "${_exclude}" ]] && grep -v "${_exclude}" || cat; } || true)"
    fi

    local _count="0"
    [[ -n "${_matches}" ]] && _count="$(printf '%s\n' "${_matches}" | grep -c '^')"

    # BEOORDELING: Als de count 0 is, is het een PASS.
    if [[ "${_count}" -eq 0 ]]; then
        echo -e "${GREEN}${ICON_OK} ${_desc} ${BOLD}(geen verboden elementen)${NC}"
        atomic_inc "passed"
        return 0
    else
        echo -e "${RED}${ICON_FAIL} ${_desc} ${BOLD}(${_count} verboden elementen gevonden!)${NC}"
        record_failure "${_id}" "${_desc}"
        
        # Toon details bij verboden elementen als verbose aan staat
        [[ "${VERBOSE}" == "true" ]] && printf '%s\n' "${_matches}" | head -3 | sed 's/^/   /'
        
        [[ -n "${_id}" ]] && suggest_fix "${_id}" "print"
        return 1
    fi
}
# --- Command Runner ---
run_cmd() {
    local cmd="$1" desc="$2" allow="${3:-false}"
    atomic_inc "total"
    
    if [[ "${DRY_RUN:-false}" == "true" ]]; then
        echo -e "${YELLOW}${ICON_WARN} $desc [DRY RUN]${NC}"
        atomic_inc "passed"
        return 0
    fi

    # Voer commando uit en vang output op
    local out; 
    if out=$(eval "$cmd" 2>&1); then
        echo -e "${GREEN}${ICON_OK} $desc${NC}"
        atomic_inc "passed"
        return 0
    else
        if [[ "$allow" == "true" ]]; then
            echo -e "${YELLOW}${ICON_WARN} $desc (toegestane fout)${NC}"
            atomic_inc "passed"
            return 0
        else
            echo -e "${RED}${ICON_FAIL} $desc${NC}"
            # Sla de fout op voor het rapport
            record_failure "cmd_fail" "$desc"
            
            # Toon alleen de laatste 5 regels van de foutmelding bij verbose
            if [[ "${VERBOSE:-false}" == "true" ]]; then
                echo -e "${DIM}Foutmelding details:${NC}"
                echo "$out" | tail -5 | sed 's/^/    /'
            fi
            return 1
        fi
    fi
}