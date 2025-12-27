#!/usr/bin/env bash
# checkers.sh v3.1 - TIMESTAMP_PLACEHOLDER

check_file_exists() {
    local f="$1" d="$2"
    atomic_inc "total"
    [[ -f "$f" ]] && { echo -e "${GREEN}${ICON_OK} $d${NC}"; atomic_inc "passed"; return 0; }
    echo -e "${RED}${ICON_FAIL} $d (missing: $f)${NC}"
    record_failure "missing_file" "$d"
    return 1
}

check_pattern() {
    local pat="$1" tgt="$2" desc="${3:-Pattern}" min="${4:-1}" exc="${5:-}" id="${6:-}"
    atomic_inc "total"
    log_verbose "Check: $desc on $tgt"
    
    [[ ! -e "$tgt" ]] && { echo -e "${RED}${ICON_FAIL} $desc (no target: $tgt)${NC}"; record_failure "${id:-no_target}" "$desc"; return 1; }
    
    local m=""
    if command -v rg >/dev/null 2>&1; then
        m="$(rg -i -n --type-add 'ts:*.{ts,tsx}' --type ts -e "$pat" "$tgt" 2>/dev/null | { [[ -n "$exc" ]] && grep -vE "$exc" || cat; } || true)"
    else
        local ed="--exclude-dir={node_modules,.venv,.phoenix,.git,__pycache__,dist,build,.next}"
        local inc="--include=*.ts --include=*.tsx --include=*.js --include=*.jsx --include=*.json"
        m="$(grep -rni -I $ed $inc -E "$pat" "$tgt" 2>/dev/null | { [[ -n "$exc" ]] && grep -vE "$exc" || cat; } || true)"
    fi
    
    local c=0
    [[ -n "$m" ]] && c=$(printf '%s\n' "$m" | grep -c '^')
    
    if [[ "$c" -ge "$min" ]]; then
        echo -e "${GREEN}${ICON_OK} $desc ($c)${NC}"
        atomic_inc "passed"
        [[ "$VERBOSE" == "true" && -n "$m" ]] && printf '%s\n' "$m" | head -3 | sed 's/^/   /'
        return 0
    else
        echo -e "${RED}${ICON_FAIL} $desc ($c < $min)${NC}"
        record_failure "${id:-pattern_miss}" "$desc"
        [[ -n "$id" ]] && suggest_fix "$id" "print"
        return 1
    fi
}

check_antipattern() {
    local pat="$1" tgt="$2" desc="${3:-Anti}" exc="${4:-}" id="${5:-}"
    atomic_inc "total"
    
    [[ ! -e "$tgt" ]] && { echo -e "${YELLOW}${ICON_WARN} $desc (skip: no target)${NC}"; atomic_inc "passed"; return 0; }
    
    local m=""
    if command -v rg >/dev/null 2>&1; then
        m="$(rg -i -n --type-add 'ts:*.{ts,tsx}' --type ts -e "$pat" "$tgt" 2>/dev/null | { [[ -n "$exc" ]] && grep -vE "$exc" || cat; } || true)"
    else
        local ed="--exclude-dir={node_modules,.venv,.phoenix,.git,__pycache__,dist,build,.next}"
        local inc="--include=*.ts --include=*.tsx --include=*.js --include=*.jsx --include=*.json"
        m="$(grep -rni -I $ed $inc -E "$pat" "$tgt" 2>/dev/null | { [[ -n "$exc" ]] && grep -vE "$exc" || cat; } || true)"
    fi
    
    local c=0
    [[ -n "$m" ]] && c=$(printf '%s\n' "$m" | grep -c '^')
    
    if [[ "$c" -eq 0 ]]; then
        echo -e "${GREEN}${ICON_OK} $desc (clean)${NC}"
        atomic_inc "passed"
        return 0
    else
        echo -e "${RED}${ICON_FAIL} $desc ($c violations)${NC}"
        record_failure "${id:-anti_found}" "$desc"
        printf '%s\n' "$m" | head -5 | sed 's/^/   /'
        [[ -n "$id" ]] && suggest_fix "$id" "print"
        return 1
    fi
}

run_cmd() {
    local cmd="$1" desc="$2" allow="${3:-false}"
    atomic_inc "total"
    
    [[ "${DRY_RUN:-false}" == "true" ]] && { echo -e "${YELLOW}${ICON_WARN} $desc [SKIP]${NC}"; atomic_inc "skipped"; return 0; }
    
    local out
    if out=$(eval "$cmd" 2>&1); then
        echo -e "${GREEN}${ICON_OK} $desc${NC}"
        atomic_inc "passed"
        return 0
    else
        [[ "$allow" == "true" ]] && { echo -e "${YELLOW}${ICON_WARN} $desc (allowed)${NC}"; atomic_inc "passed"; return 0; }
        echo -e "${RED}${ICON_FAIL} $desc${NC}"
        record_failure "cmd_fail" "$desc"
        [[ "${VERBOSE:-false}" == "true" ]] && { echo -e "${DIM}Error:${NC}"; echo "$out" | tail -10 | sed 's/^/  /'; }
        return 1
    fi
}
check_refactor_integrity() {
    local desc=$1
    atomic_inc total
    
    # Verificatie logica
    local t_file="src/ui/styles/Tokens.ts"
    local o_file="src/ui/styles/useAppStyles.ts"
    local m_count=$(ls src/ui/styles/modules/*.ts 2>/dev/null | wc -l)

    # Check of alles aanwezig is
    if [[ -f "$t_file" ]] && grep -q "export const Space" "$t_file" && [[ -f "$o_file" ]] && [[ $m_count -gt 0 ]]; then
        # SUCCESS
        # De combinatie ${BOLD}${GREEN} zorgt voor dikgedrukt groen
echo -e "${GREEN}${ICON_OK}${NC} ${BOLD}${GREEN}$desc${NC} ${DIM}($m_count modules)${NC}"
        atomic_inc passed
    elif [[ -f "$t_file" ]] || [[ -f "$o_file" ]]; then
        # WARNING (Iets gevonden, maar niet alles)
        echo -e "${YELLOW}${ICON_WARN}${NC} ${BOLD}$desc${NC} ${YELLOW}(Incompleet: $m_count modules)${NC}"
    else
        # FAIL
        echo -e "${RED}${ICON_FAIL}${NC} ${BOLD}$desc${NC} ${RED}(Niet gevonden)${NC}"
    fi
}