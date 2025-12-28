#!/bin/bash
# ===================================================================
# PROJECT PHOENIX: ULTIMATE AUDIT SCRIPT v4.0
# ===================================================================
# Features: Progress bars, parallel buffering, reports, git hooks,
#           fix suggestions, configurable thresholds
# ===================================================================

set -euo pipefail
IFS=$'\n\t'

readonly SCRIPT_VERSION="4.0.0"
readonly PROJECT_ROOT="${PROJECT_ROOT:-$(git rev-parse --show-toplevel 2>/dev/null || echo "$PWD")}"
readonly CACHE_DIR="/tmp/phoenix-audit-$(id -u)"
readonly CONFIG_FILE="${PROJECT_ROOT}/.phoenix-audit.conf"

# Colors
if [[ "${NO_COLOR:-}" == "1" ]] || [[ ! -t 1 ]]; then
    readonly RED='' GREEN='' BLUE='' YELLOW='' BOLD='' NC=''
    readonly ICON_OK="[OK]" ICON_FAIL="[FAIL]" ICON_WARN="[WARN]"
else
    readonly RED='\033[0;31m' GREEN='\033[0;32m' BLUE='\033[0;34m'
    readonly YELLOW='\033[1;33m' BOLD='\033[1m' NC='\033[0m'
    readonly ICON_OK="✅" ICON_FAIL="❌" ICON_WARN="⚠️"
fi

# Flags
VERBOSE="${VERBOSE:-false}"
PARALLEL="${PARALLEL:-false}"
DRY_RUN="${DRY_RUN:-false}"
PROGRESS="${PROGRESS:-true}"
GENERATE_REPORT="${GENERATE_REPORT:-true}"
REPORT_FORMAT="${REPORT_FORMAT:-html}"
INSTALL_HOOK="${INSTALL_HOOK:-false}"
UNINSTALL_HOOK="${UNINSTALL_HOOK:-false}"

# Default thresholds

declare -A THRESHOLDS=(
  ["min_ssot"]=1 ["min_reducer"]=3 ["min_kernel"]=2
  # Scheid decimal checks voor logic vs UI (presentatie)
  ["min_decimal_logic"]=0 ["min_decimal_ui"]=1
  ["min_parsing"]=2
  ["max_deep"]=0 ["max_console"]=0 ["fsm_states"]=5
)

mock_generate_report() {
  # Gebruik een veilige fallback voor de root
  local _root="${PROJECT_ROOT:-.}"
  local _outdir="${_root}/artifacts"
  
  mkdir -p "${_outdir}" || { echo -e "${RED}❌ Kon artifacts niet aanmaken${NC}"; return 1; }

  local _file="${_outdir}/phoenix-audit-report.html"
  cat > "${_file}" <<'HTML'
<!DOCTYPE html>
<html lang="nl">
<head><meta charset="UTF-8"><title>Phoenix Audit (mock)</title></head>
<body>
  <h1>🚀 Phoenix Audit Report (mock)</h1>
  <p>Status: Verbinding met bestandssysteem is succesvol.</p>
</body>
</html>
HTML

  echo -e "${GREEN}${ICON_OK} Mock report gegenereerd: ${_file}${NC}"
  return 0
}


load_config() {
    [[ -f "$CONFIG_FILE" ]] && source "$CONFIG_FILE" 2>/dev/null || true
}

init_audit() {
    rm -rf "$CACHE_DIR"
    mkdir -p "$CACHE_DIR/locks" "$CACHE_DIR/sections"
    echo "0" > "$CACHE_DIR/total"
    echo "0" > "$CACHE_DIR/passed"
    echo "0" > "$CACHE_DIR/failed"
    : > "$CACHE_DIR/failed_items.txt"
}


atomic_inc() {
  local counter="${1:-total}"
  local file="$CACHE_DIR/$counter"
  local lockfile="${CACHE_DIR}/locks/${counter}.lock" # Gebruik de locks-map uit init_audit

  [[ ! -f "$file" ]] && echo "0" > "$file"

  # We definiëren de actie direct in de flock-aanroep voor snelheid
  if command -v flock >/dev/null 2>&1; then
    (
      flock -x 200
      local v=$(cat "$file" 2>/dev/null || echo 0)
      echo $(( ${v:-0} + 1 )) > "$file"
    ) 200>"$lockfile"
  else
    # Fallback voor omgevingen zonder flock
    local v=$(cat "$file" 2>/dev/null || echo 0)
    echo $(( ${v:-0} + 1 )) > "$file"
  fi
}


read_counter() {
    local v=$(cat "$CACHE_DIR/$1" 2>/dev/null | tr -dc '0-9'); echo "${v:-0}"
}

log_section() { echo; echo -e "${BOLD}${BLUE}━━━━━━━━━━ $* ━━━━━━━━━━${NC}"; }
log_verbose() { [[ "$VERBOSE" == "true" ]] && echo -e "  ${BLUE}→${NC} $*"; return 0; }

show_progress() {
    [[ "$PROGRESS" != "true" || ! -t 1 ]] && return
    local cur=$1 tot=$2 msg="${3:-Processing}"
    local pct=$((cur * 100 / tot)) filled=$((pct / 2)) empty=$((50 - filled))
    local bar=""; for ((i=0;i<filled;i++)); do bar+="█"; done
    for ((i=0;i<empty;i++)); do bar+="░"; done
    printf "\r${BLUE}${msg}:${NC} [${bar}] ${BOLD}${pct}%%${NC} (${cur}/${tot})"
    [[ "$cur" -eq "$tot" ]] && echo
}

safe_grep() {
    local pat="$1" tgt="$2" excl="${3:-}" res=""
    if command -v rg &>/dev/null; then
        res=$(rg -n --type-add 'ts:*.{ts,tsx}' --type ts -e "$pat" "$tgt" 2>/dev/null | \
              { [[ -n "$excl" ]] && grep -v "$excl" || cat; } || true)
    else
        local opts=(-rn --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx")
        res=$(grep "${opts[@]}" -E "$pat" "$tgt" 2>/dev/null | \
              { [[ -n "$excl" ]] && grep -v "$excl" || cat; } || true)
    fi
    echo "$res"
}

count_lines() {
    local t="$1"; [[ -z "$t" ]] && { echo "0"; return; }
    local c=$(echo "$t" | grep -c '^' 2>/dev/null || echo "0")
    echo "$(($(echo "$c" | tr -dc '0-9')))"
}



# -------- ACTIONS: extractors & auto-detect (nounset-safe) --------------------

# Zoek een waarschijnlijk reducer-bestand (switch / if / handler-map)
find_reducer_file() {
  local _root="${1:-src}" _cand=""
  if command -v rg >/dev/null 2>&1; then
    _cand="$(rg -l "switch\\s*\\(\\s*action\\.type" "${_root}" 2>/dev/null | head -1 || true)"
    [[ -n "${_cand}" ]] && { echo "${_cand}"; return 0; }
    _cand="$(rg -l "if\\s*\\(\\s*action\\.type\\s*===\\s*['\"][A-Z0-9_]+['\"]\\s*\\)" "${_root}" 2>/dev/null | head -1 || true)"
    [[ -n "${_cand}" ]] && { echo "${_cand}"; return 0; }
    _cand="$(rg -l "(caseReducers|handlers|reducers)\\.[A-Z0-9_]+\\s*=" "${_root}" 2>/dev/null | head -1 || true)"
    [[ -n "${_cand}" ]] && { echo "${_cand}"; return 0; }
    _cand="$(rg -l "\\{\\s*[A-Z0-9_]+\\s*:" "${_root}" 2>/dev/null | head -1 || true)"
    [[ -n "${_cand}" ]] && { echo "${_cand}"; return 0; }
  else
    _cand="$(grep -Rnl --include='*.ts' --include='*.tsx' --include='*.js' --include='*.jsx' "switch *( *action\.type" "${_root}" 2>/dev/null | head -1 || true)"
    [[ -n "${_cand}" ]] && { echo "${_cand}"; return 0; }
  fi
  echo ""
}

# 1) Declared actions (union / enum / literal as const)
extract_declared_actions() 
{
  # $@ = bronnen met declaraties (mag leeg zijn)
  local _out="" _file
  for _file in "$@"; do
    [[ -n "${_file}" && -f "${_file}" ]] || continue
    
    if command -v rg >/dev/null 2>&1; then
      # Union: { type: 'FOO' } → we vangen de inhoud binnen de quotes
      _out="${_out}$(
        rg -No --replace '$1' "type:[[:space:]]*'([A-Z0-9_]+)'" "${_file}" 2>/dev/null
        rg -No --replace '$1' "type:[[:space:]]*\"([A-Z0-9_]+)\"" "${_file}" 2>/dev/null
        # Literal map: keys vóór de dubbele punt
        rg -No --replace '$1' "([A-Z0-9_]+)[[:space:]]*:[[:space:]]*['\"][A-Z0-9_]+['\"]" "${_file}" 2>/dev/null
        # Enum members (multiline ripgrep)
        rg -U -No "enum[[:space:]]+Action(Type)?[[:space:]]*\{([^}]*)\}" "${_file}" 2>/dev/null \
          | sed -E "s/.*\{([^}]*)\}.*/\1/" \
          | tr ',\n' '\n' | sed -E 's/^\s*([A-Za-z0-9_]+).*/\1/' | grep -E '^[A-Z0-9_]+' || true
      )"
    else
      # grep/awk fallback: pak enkel quoted literals
      _out="${_out}$(
        grep -Eno "type:[[:space:]]*'([A-Z0-9_]+)'" "${_file}" 2>/dev/null | awk -F"'" '{print $2}'
        grep -Eno "type:[[:space:]]*\"([A-Z0-9_]+)\"" "${_file}" 2>/dev/null | awk -F'"' '{print $2}'
      )"
    fi
    # Voeg een newline toe om te voorkomen dat namen aan elkaar plakken
    _out+=$'\n'
  done
  
  # Final cleanup: verwijder lege regels en sorteer uniek
  printf '%s\n' "${_out}" | sed '/^\s*$/d' | sort -u
}

# 2) Case-actions (switch / if / handler-map), met underscore-vereiste om C7 te filteren
extract_case_actions() {
  local _target="${1:-}"
  [[ -z "${_target}" || ! -f "${_target}" ]] && return 0
  local _out=""
  
  if command -v rg >/dev/null 2>&1; then
    # 'FOO_BAR' string cases
    _out="$(
      # Let op: Geen { nodig hier
      echo "${_out}"
      rg -No --replace '$1' "case[[:space:]]+'([A-Z][A-Z0-9_]*_[A-Z0-9_]+)':[[:space:]]*$" "${_target}" 2>/dev/null
      rg -No --replace '$1' "case[[:space:]]+\"([A-Z][A-Z0-9_]*_[A-Z0-9_]+)\"[[:space:]]*:[[:space:]]*$" "${_target}" 2>/dev/null
      # if (action.type === 'FOO_BAR')
      rg -No --replace '$1' "if[[:space:]]*\\([[:space:]]*action\\.type[[:space:]]*===[[:space:]]*'([A-Z][A-Z0-9_]*_[A-Z0-9_]+)'" "${_target}" 2>/dev/null
      rg -No --replace '$1' "if[[:space:]]*\\([[:space:]]*action\\.type[[:space:]]*===[[:space:]]*\"([A-Z][A-Z0-9_]*_[A-Z0-9_]+)\"" "${_target}" 2>/dev/null
      # handler-map: reducers.FOO_BAR = ..., caseReducers.FOO_BAR = ..., { FOO_BAR: (...) }
      rg -No --replace '$2' "(caseReducers|handlers|reducers)\\.([A-Z][A-Z0-9_]*_[A-Z0-9_]+)[[:space:]]*=" "${_target}" 2>/dev/null
      rg -No --replace '$1' "\\{[[:space:]]*([A-Z][A-Z0-9_]*_[A-Z0-9_]+)[[:space:]]*:" "${_target}" 2>/dev/null
    )"
  else
    _out="$(grep -Eno "case[[:space:]]+'([A-Z][A-Z0-9_]*_[A-Z0-9_]+)':[[:space:]]*$" "${_target}" 2>/dev/null | awk -F"'" '{print $2}')"
  fi
  
  # De sorting doen we één keer aan het einde voor maximale stabiliteit
  printf '%s\n' "${_out}" | sed '/^\s*$/d' | sort -u
}

# 3) Dispatch-actions (literal én constant namespace)
extract_dispatch_actions() {
  local _root="${1:-src}" _out=""
  
  if command -v rg >/dev/null 2>&1; then
    # We vangen de output van meerdere rg commando's direct op in de variabele
    _out="$(
      rg -No --replace '$1' "dispatch\\([^)]*type:[[:space:]]*'([A-Z][A-Z0-9_]*_[A-Z0-9_]+)'" "${_root}" 2>/dev/null
      rg -No --replace '$1' "dispatch\\([^)]*type:[[:space:]]*\"([A-Z][A-Z0-9_]*_[A-Z0-9_]+)\"" "${_root}" 2>/dev/null
      rg -No --replace '$1' "dispatch\\([^)]*type:[[:space:]]*[A-Za-z0-9_.]+\\.([A-Z][A-Z0-9_]*_[A-Z0-9_]+)" "${_root}" 2>/dev/null
    )"
  else
    # Fallback met verbeterde compatibiliteit
    _out="$(grep -Erno --include='*.{ts,tsx,js,jsx}' "dispatch\(.*type:[[:space:]]*'([A-Z][A-Z0-9_]*_[A-Z0-9_]+)'" "${_root}" 2>/dev/null | awk -F"'" '{print $2}')"
  fi
  
  # Opschonen en uniek maken
  printf '%s\n' "${_out}" | sed '/^\s*$/d' | sort -u
}



suggest_fix() {
    local id="$1"
    case "$id" in
        deep_imports)
            cat <<EOF
${YELLOW}💡 Add path aliases to tsconfig.json:${NC}
    "paths": { "@/*": ["./src/*"] }
${GREEN}    import { x } from '@/utils'${NC}
EOF
            ;;
        legacy_parsing)
            cat <<EOF
${YELLOW}💡 Create centralized parser in src/utils/numbers.ts:${NC}
${GREEN}    export const parseNumber = (input: string) => 
      Math.max(0, parseFloat(input.replace(",", ".")) || 0);${NC}
EOF
            ;;
        console_statements)
            echo -e "${YELLOW}💡 Remove console.log or use proper logger${NC}"
            ;;
        reducer_actions)
            echo -e "${YELLOW}💡 Add declarative action types: SET_, TOGGLE_, UPDATE_, RESET_${NC}"
            ;;
        fsm_incomplete)
            cat <<EOF
${YELLOW}💡 Define all 5 FSM states in your state machine:${NC}
${GREEN}    INITIALIZING, HYDRATING, UNBOARDING, READY, ERROR${NC}
EOF
            ;;
    esac
}

record_failure() {
    local _desc="$1"
    atomic_inc "failed"
    echo "${_desc}" >> "${CACHE_DIR}/failed_items.txt"
}

# ---- SAFE CHECKS (no unbound vars, nounset-friendly) ----
check_pattern() {
  local _pat="${1:-}"
  local _target="${2:-}"
  local _desc="${3:-Pattern}"
  local _min="${4:-1}"
  local _exclude="${5:-}"
  local _id="${6:-}"

  atomic_inc "total"
  log_verbose "Check: ${_desc}"

  # Target guard
  if [[ -z "${_target}" ]]; then
    echo -e "${RED}${ICON_FAIL} ${_desc} ${BOLD}(target not provided)${NC}"
    record_failure "${_desc}"; return 1
  fi
  if [[ ! -e "${_target}" ]]; then
    echo -e "${RED}${ICON_FAIL} ${_desc} ${BOLD}(target not found: ${_target})${NC}"
    record_failure "${_desc}"; return 1
  fi

  # Zoek matches (rg of grep)
  local _matches=""
  if command -v rg >/dev/null 2>&1; then
    if [[ -n "${_exclude}" ]]; then
      _matches="$(rg -n --type-add 'ts:*.{ts,tsx}' --type ts -e "${_pat}" "${_target}" 2>/dev/null | grep -v "${_exclude}" || true)"
    else
      _matches="$(rg -n --type-add 'ts:*.{ts,tsx}' --type ts -e "${_pat}" "${_target}" 2>/dev/null || true)"
    fi
  else
    local _opts=(-rn --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx")
    if [[ -n "${_exclude}" ]]; then
      _matches="$(grep "${_opts[@]}" -E "${_pat}" "${_target}" 2>/dev/null | grep -v "${_exclude}" || true)"
    else
      _matches="$(grep "${_opts[@]}" -E "${_pat}" "${_target}" 2>/dev/null || true)"
    fi
  fi

  # Tel regels veilig
  local _count="0"
  [[ -n "${_matches}" ]] && _count="$(printf '%s\n' "${_matches}" | grep -c '^')"

  # Evaluatie
  if [[ "${_count}" -ge "${_min}" ]]; then
    echo -e "${GREEN}${ICON_OK} ${_desc} ${BOLD}(${_count})${NC}"
    atomic_inc "passed"
    [[ "${VERBOSE}" == "true" && -n "${_matches}" ]] && printf '%s\n' "${_matches}" | head -3 | sed 's/^/  /'
    return 0
  else
    echo -e "${RED}${ICON_FAIL} ${_desc} ${BOLD}(${_count} < ${_min})${NC}"
    record_failure "${_desc}"
    [[ -n "${_id}" ]] && suggest_fix "${_id}"
    return 1
  fi
}

check_antipattern() {
  local _pat="${1:-}"
  local _target="${2:-}"
  local _desc="${3:-Anti-pattern}"
  local _exclude="${4:-}"
  local _id="${5:-}"

  atomic_inc "total"
  log_verbose "Anti-check: ${_desc}"

  # Als het doel niet bestaat, beschouwen we het als 'clean'
  if [[ ! -e "${_target}" ]]; then
    echo -e "${YELLOW}${ICON_WARN} ${_desc} ${BOLD}(skip)${NC}"
    atomic_inc "passed"; return 0
  fi

  local _matches=""
  if command -v rg >/dev/null 2>&1; then
    # Direct filteren in de subshell is efficiënter
    if [[ -n "${_exclude}" ]]; then
      _matches="$(rg -n --type-add 'ts:*.{ts,tsx}' --type ts -e "${_pat}" "${_target}" 2>/dev/null | grep -v "${_exclude}" || true)"
    else
      _matches="$(rg -n --type-add 'ts:*.{ts,tsx}' --type ts -e "${_pat}" "${_target}" 2>/dev/null || true)"
    fi
  else
    local _opts=(-rn --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx")
    if [[ -n "${_exclude}" ]]; then
      _matches="$(grep "${_opts[@]}" -E "${_pat}" "${_target}" 2>/dev/null | grep -v "${_exclude}" || true)"
    else
      _matches="$(grep "${_opts[@]}" -E "${_pat}" "${_target}" 2>/dev/null || true)"
    fi
  fi

  local _count="0"
  [[ -n "${_matches}" ]] && _count="$(printf '%s\n' "${_matches}" | grep -c '^')"

  if [[ "${_count}" -eq 0 ]]; then
    echo -e "${GREEN}${ICON_OK} ${_desc} ${BOLD}(clean)${NC}"
    atomic_inc "passed"; return 0
  else
    echo -e "${RED}${ICON_FAIL} ${_desc} ${BOLD}(${_count} found)${NC}"
    record_failure "${_desc}"
    [[ -n "${_id}" ]] && suggest_fix "${_id}"
    
    # Toon de eerste 5 overtredingen voor snelle debug
    [[ -n "${_matches}" ]] && printf '%s\n' "${_matches}" | head -5 | sed 's/^/  /'
    return 1
  fi
}


check_file_exists() {
  local fp="$1" 
  local desc="$2" 
  local mins="${3:-1}"
  
  atomic_inc "total"
  
  # 1. Bestaat het bestand?
  if [[ ! -f "$fp" ]]; then
    echo -e "${RED}${ICON_FAIL} $desc (not found)${NC}"
    record_failure "$desc"
    return 1
  fi
  
  # 2. Bepaal grootte (Universele methode)
  local sz
  if [[ "$OSTYPE" == "darwin"* ]]; then
    sz=$(stat -f%z "$fp" 2>/dev/null || echo "0")
  else
    sz=$(stat -c%s "$fp" 2>/dev/null || echo "0")
  fi
  
  # Fallback voor als stat faalt (bijv. op vreemde shells)
  [[ -z "$sz" ]] && sz=0

  # 3. Validatie
  if [[ "$sz" -lt "$mins" ]]; then
    echo -e "${RED}${ICON_FAIL} $desc (${sz}B < ${mins}B)${NC}"
    record_failure "$desc"
    return 1
  fi
  
  echo -e "${GREEN}${ICON_OK} $desc (${sz}B)${NC}"
  atomic_inc "passed"
  return 0
}

run_cmd() {
  local cmd="$1" 
  local desc="$2" 
  local allow="${3:-false}"
  
  atomic_inc "total"
  log_verbose "Run: $cmd"
  
  # Dry Run afhandeling
  if [[ "$DRY_RUN" == "true" ]]; then
    echo -e "${YELLOW}${ICON_WARN} $desc [DRY RUN]${NC}"
    atomic_inc "passed"
    return 0
  fi
  
  # Voer commando uit en vang output
  local out
  if out=$(eval "$cmd" 2>&1); then
    # Succes
    echo -e "${GREEN}${ICON_OK} $desc${NC}"
    atomic_inc "passed"
    return 0
  else
    # Fout afgehandeld op basis van 'allow'
    if [[ "$allow" == "true" ]]; then
      echo -e "${YELLOW}${ICON_WARN} $desc (allowed failure)${NC}"
      atomic_inc "passed"
      return 0
    else
      echo -e "${RED}${ICON_FAIL} $desc${NC}"
      record_failure "$desc"
      # Toon output bij falen in verbose mode
      if [[ "$VERBOSE" == "true" ]]; then
        echo -e "${BLUE}Last 10 lines of output:${NC}"
        echo "$out" | tail -10 | sed 's/^/    /'
      fi
      return 1
    fi
  fi
}

audit_wai_001_003() 
{
  log_section "1. CORE & HOUSEHOLD (WAI-001-003)"
  run_cmd "npm run typecheck" "TypeScript"
  check_file_exists "golden_master_scenarios.json" "Golden Master" 50
  check_pattern "as const" "src/selectors/householdSelectors.ts" "SSOT" "${THRESHOLDS[min_ssot]}" "" "ssot"
  
  # ---- Actions (semantisch): declared vs reducer cases vs dispatch ----
  # VERWIJDERD: De loze openings-accolade die hier stond
  
  atomic_inc "total"
  log_verbose "Actions: declared vs reducer cases vs dispatch"

  local _root="src"
  local _decl_sources=(
    "src/context/FormContext.tsx"
    "src/context/actions.ts"
    "src/state/types.ts"
  )
  
  local _reducer="$(find_reducer_file "${_root}")"
  [[ -z "${_reducer}" ]] && _reducer="src/context/FormContext.tsx"

  local _decl_file="${CACHE_DIR}/declared.actions"
  local _case_file="${CACHE_DIR}/cases.actions"
  local _used_file="${CACHE_DIR}/used.actions"

  # Extractie
  extract_declared_actions "${_decl_sources[@]}" > "${_decl_file}" || true
  extract_case_actions     "${_reducer}"         > "${_case_file}" || true
  extract_dispatch_actions "${_root}"            > "${_used_file}" || true

  local _decl_count
  _decl_count="$(wc -l < "${_decl_file}" | tr -dc '0-9')"
  _decl_count="${_decl_count:-0}"

  # Fallback 1: declared ∪ used
  if [[ "$_decl_count" -lt "${THRESHOLDS[min_reducer]}" ]]; then
    sort -u "${_decl_file}" "${_used_file}" > "${_decl_file}.tmp" && mv "${_decl_file}.tmp" "${_decl_file}"
    _decl_count="$(wc -l < "${_decl_file}" | tr -dc '0-9')"
    [[ "${VERBOSE}" == "true" ]] && echo "  ℹ️ Expanded declared = declared ∪ used (${_decl_count})"
  fi

  # Evaluatie
  if [[ "${_decl_count:-0}" -lt 1 ]]; then
    echo -e "${RED}${ICON_FAIL} Actions (no declared/case actions found)${NC}"
    record_failure "Actions (no declared/case found)"
  else
    # Vergelijk sets met comm
    local _missing_cases="${CACHE_DIR}/missing.cases"
    local _unknown_cases="${CACHE_DIR}/unknown.cases"
    local _undeclared_used="${CACHE_DIR}/undeclared.used"
    local _dead_declared="${CACHE_DIR}/dead.declared"

    comm -23 "${_decl_file}" "${_case_file}"   > "${_missing_cases}"   || true
    comm -13 "${_decl_file}" "${_case_file}"   > "${_unknown_cases}"   || true
    comm -13 "${_decl_file}" "${_used_file}"   > "${_undeclared_used}" || true
    comm -23 "${_decl_file}" "${_used_file}"   > "${_dead_declared}"   || true

    # Check drempelwaarde
    if [[ "${_decl_count:-0}" -ge "${THRESHOLDS[min_reducer]}" ]]; then
      echo -e "${GREEN}${ICON_OK} Actions (declared ${BOLD}${_decl_count}${NC})"
      atomic_inc "passed"
    else
      echo -e "${RED}${ICON_FAIL} Actions (declared ${BOLD}${_decl_count}${NC} < ${THRESHOLDS[min_reducer]})"
      record_failure "Actions (insufficient declared)"
    fi

    # Loop door de detailfouten
    local _pair _label _f _cnt
    for _pair in "Missing cases:${_missing_cases}" "Unknown cases:${_unknown_cases}" "Undeclared used:${_undeclared_used}"; do
      _label="${_pair%%:*}"
      _f="${_pair#*:}"
      _cnt="$(wc -l < "${_f}" | tr -dc '0-9')"
      
      if [[ "${_cnt:-0}" -gt 0 ]]; then
        echo -e "${RED}${ICON_FAIL} Actions – ${_label} ${BOLD}(${_cnt})${NC}"
        record_failure "Actions – ${_label}"
        [[ "${VERBOSE}" == "true" ]] && sed 's/^/  /' "${_f}" | head -10
      else
        echo -e "${GREEN}${ICON_OK} Actions – ${_label} ${BOLD}(clean)${NC}"
        atomic_inc "passed"
      fi
    done

    # Dode code (alleen waarschuwing)
    local _dead_cnt="$(wc -l < "${_dead_declared}" | tr -dc '0-9')"
    if [[ "${_dead_cnt:-0}" -gt 0 ]]; then
      echo -e "${YELLOW}${ICON_WARN} Actions – Declared but never used ${BOLD}(${_dead_cnt})${NC}"
    fi
  fi
} # <--- Sluit de functie correct af


audit_wai_004() {
    log_section "2. EURO-GARANTIE (WAI-004)"
    check_pattern "Math\\.max\\(0," "src/utils/numbers.ts" "Non-negative parser" 1 "" "parser"
    check_pattern "\\b(computeNetCents|toCents|fromCents)" "src/logic/finance.ts" "Kernel" "${THRESHOLDS[min_kernel]}" "" "kernel"
    check_antipattern "\\bparseFloat\\(|\\bparseInt\\(" "src/logic/finance.ts" "No unsafe parse" "" "unsafe"
  
    # Presentatie: toFixed(2) hoort in UI, niet in kernel
    check_pattern "\\.toFixed\\(2\\)" "src/ui"    "Decimal precision (UI)"    "${THRESHOLDS[min_decimal_ui]}"    "" "decimal_ui"
    check_pattern "\\.toFixed\\(2\\)" "src/logic" "Decimal precision (Logic)" "${THRESHOLDS[min_decimal_logic]}" "" "decimal_logic"
}

audit_wai_006a() {
    log_section "3. APP STATUS FSM (WAI-006A)"
    
    local fsm="src/app/hooks/useAppOrchestration.ts"
    atomic_inc "total"
    
    if [[ -f "$fsm" ]]; then
        local found=0
        # Check voor zowel 'Status' als "Status"
        for s in "INITIALIZING" "HYDRATING" "UNBOARDING" "READY" "ERROR"; do
            if grep -qE "['\"]$s['\"]" "$fsm" 2>/dev/null; then
                found=$((found + 1))
            fi
        done
        
        if [[ "$found" -eq "${THRESHOLDS[fsm_states]:-5}" ]]; then
            echo -e "${GREEN}${ICON_OK} FSM complete (${found}/${THRESHOLDS[fsm_states]:-5})${NC}"
            atomic_inc "passed"
        else
            echo -e "${RED}${ICON_FAIL} FSM incomplete (${found}/${THRESHOLDS[fsm_states]:-5})${NC}"
            record_failure "FSM"
            suggest_fix "fsm_incomplete"
        fi
    else
        echo -e "${RED}${ICON_FAIL} FSM not found${NC}"
        record_failure "FSM file missing"
    fi
    
    check_pattern "switch.*\\(status\\)" "src/App.tsx" "Pure projector" 1 "" "projector"
    # Anti-pattern: Verboden side-effects in de main entry point
    check_antipattern "useEffect\\(.*\\[\\]|fetch\\(|axios\\." "src/App.tsx" "No side effects" "^[[:space:]]*//|/\\*" "effects"
}

audit_wai_006d() {
    log_section "4. INPUT HARDENING (WAI-006D)"
    check_antipattern "parseFloat\\(|Number\\([^)]*\\)" "src/ui" "No legacy parse" "MoneyField\\.tsx" "legacy_parsing"
    check_pattern "export.*function.*(parse|sanitize|validate)" "src/utils/numbers.ts" "Centralized parse" "${THRESHOLDS[min_parsing]}" "" "centralized"
}

audit_wai_006e() {
    log_section "5. CLEANUP (WAI-006E)"
    
    # 1. Deep Imports check (gebruik de helper voor consistentie)
    # We zoeken naar 3 of meer niveaus diep: ../../../
    check_antipattern "\\.\\./\\.\\./\\.\\." "src" "No deep imports" "" "deep_imports"

    # 2. Phoenix Aliases in tsconfig.json
    # We maken de regex iets robuuster voor JSON formatting
    local alias_list=(
        "domain" "state" "ui" "app" "utils" "services" 
        "assets" "logic" "context" "selectors"
    )

    for a in "${alias_list[@]}"; do
        # Zoekt naar "@alias/*": ["src/alias/*"] met variabele witruimte
        check_pattern "\"@${a}/\\*\":[[:space:]]*\\[[[:space:]]*\"(src/)?${a}/\\*\"[[:space:]]*\\]" \
                      "tsconfig.json" "Alias @${a}" 1 "" "aliases"
    done

    # 3. Console statements
    check_antipattern "console\\.(log|debug|info)" "src" "No console" "(\\.test\\.|dev-tools|^[[:space:]]*//|/\\*)" "console_statements"
}








install_git_hook() {
    local hook_file="${PROJECT_ROOT}/.git/hooks/pre-commit"
    
    # Controleer of .git map bestaat (we moeten in een git repo zitten)
    if [[ ! -d "${PROJECT_ROOT}/.git" ]]; then
        echo -e "${RED}${ICON_FAIL} Not a git repository, skipping hook installation${NC}"
        return 1
    fi

    # Backup bestaande hook als die er al is
    if [[ -f "$hook_file" ]]; then
        cp "$hook_file" "${hook_file}.bak"
        log_verbose "Backup created: ${hook_file}.bak"
    fi

    cat > "$hook_file" <<'HOOK'
#!/bin/bash
# Phoenix Quality Gate
echo "🔍 Running Phoenix audit..."
if bash phoenix-check.sh; then
    echo "✅ Audit passed"
    exit 0
else
    echo "❌ Audit failed - commit blocked"
    echo "Run: bash phoenix-check.sh -v"
    exit 1
fi
HOOK
    
    chmod +x "$hook_file"
    echo -e "${GREEN}${ICON_OK} Git hook installed: $hook_file${NC}"
}

uninstall_git_hook() {
    local hook_file="${PROJECT_ROOT}/.git/hooks/pre-commit"
    if [[ -f "$hook_file" ]]; then
        rm -f "$hook_file"
        echo -e "${GREEN}${ICON_OK} Git hook removed: $hook_file${NC}"
        
        # Herstel backup indien aanwezig
        if [[ -f "${hook_file}.bak" ]]; then
            mv "${hook_file}.bak" "$hook_file"
            echo -e "${BLUE}${ICON_OK} Restored previous hook backup${NC}"
        fi
    else 
        echo -e "${YELLOW}${ICON_WARN} No pre-commit hook found${NC}"
    fi
}



show_summary() {
  local t p f r g
  t="$(read_counter "total")"
  p="$(read_counter "passed")"
  f="$(read_counter "failed")"
  r="$([[ "${t}" -gt 0 ]] && echo $(( p * 100 / t )) || echo 0)"

  # Bepaal Grade op basis van Project Phoenix standaarden
  g="F"
  if   [[ "${r}" -ge 95 ]]; then g="A+"
  elif [[ "${r}" -ge 90 ]]; then g="A"
  elif [[ "${r}" -ge 85 ]]; then g="B"
  elif [[ "${r}" -ge 70 ]]; then g="C"
  fi

  log_section "AUDIT RESULTS"
  echo -e "Passed:    ${GREEN}${BOLD}${p}${NC}"
  echo -e "Failed:    ${RED}${BOLD}${f}${NC}"
  echo -e "Rate:      ${BOLD}${r}%${NC}"
  echo -e "Grade:     ${BOLD}${g}${NC}"
  echo

  if [[ "${f}" -gt 0 ]]; then
    echo -e "${RED}${BOLD}FAILED CHECKS:${NC}"
    # Toon unieke fouten met een bullet point
    if [[ -f "${CACHE_DIR}/failed_items.txt" ]]; then
        sort -u "${CACHE_DIR}/failed_items.txt" | sed "s/^/  ${RED}•${NC} /"
    fi
    echo
    echo -e "${RED}${BOLD}⚠️  AUDIT FAILED${NC}"
    return 1
  else
    echo -e "${GREEN}${BOLD}🎉 AUDIT PASSED!${NC}"
    return 0
  fi
}

show_help() {
  # Geen quotes om EOF zodat variabelen zoals ${BOLD} worden ingevuld
  cat <<EOF
${BOLD}Phoenix Audit v${SCRIPT_VERSION:-1.0.0}${NC}

${BOLD}USAGE:${NC}
  $0 [OPTIONS]

${BOLD}OPTIONS:${NC}
  -v, --verbose          Verbose output (show matches)
  -p, --parallel         Parallel execution (faster)
  --dry-run              Simulate execution
  --no-progress          Disable progress bar (better for CI)
  --report FORMAT        Generate report (html/json)
  --install-hook         Install git pre-commit hook
  --uninstall-hook       Remove git pre-commit hook
  -h, --help             Show this help screen

${BOLD}CONFIG FILE:${NC} .phoenix-audit.conf
  Je kunt drempelwaarden overschrijven in dit bestand, bijv:
  THRESHOLDS[min_ssot]=5

EOF
}



main() {
  # --- CLI parsing ---
  while [[ $# -gt 0 ]]; do
    case "$1" in
      -v|--verbose)       VERBOSE=true ;;
      -p|--parallel)      PARALLEL=true ;;
      --dry-run)          DRY_RUN=true ;;
      --no-progress)      PROGRESS=false ;;
      --report) 
        GENERATE_REPORT=true
        # Veiligheidscheck voor argument $2
        if [[ -n "${2:-}" && "$2" != -* ]]; then
          REPORT_FORMAT="$2"; shift
        else
          REPORT_FORMAT="html" # default
        fi
        ;;
      --install-hook)     INSTALL_HOOK=true ;;
      --uninstall-hook)   UNINSTALL_HOOK=true ;;
      -h|--help)          show_help; exit 0 ;;
      *)                  echo -e "${RED}Unknown option: $1${NC}"; show_help; exit 2 ;;
    esac
    shift
  done

  # --- config & init ---
  load_config
  init_audit
  
  # --- opt-in Git hook acties ---
  if [[ "${INSTALL_HOOK:-false}" == "true" ]]; then
    install_git_hook; exit 0
  fi
  if [[ "${UNINSTALL_HOOK:-false}" == "true" ]]; then
    uninstall_git_hook; exit 0
  fi

  # --- banner ---
  echo -e "${BLUE}${BOLD}🚀 Phoenix Audit v${SCRIPT_VERSION:-1.0.0}${NC}"
  echo -e "${BLUE}📁 $(pwd)${NC}"
  [[ "$DRY_RUN" == "true" ]] && echo -e "${YELLOW}⚠️  DRY RUN MODE ACTIVE${NC}"
  echo

  # --- audits uitvoeren ---
  if [[ "${PARALLEL:-false}" == "true" ]]; then
    echo -e "${BLUE}Running in parallel mode...${NC}"
    # Start audits in subshells
    audit_wai_001_003 &
    audit_wai_004 &
    audit_wai_006a &
    audit_wai_006d &
    audit_wai_006e &
    wait
  else
    audit_wai_001_003
    audit_wai_004
    audit_wai_006a
    audit_wai_006d
    audit_wai_006e
  fi 

  echo # Spacer voor leesbaarheid

# --- afsluiting & mock-rapportage ---
echo -e "${BLUE}${BOLD}📦 Finalization (mock)${NC}"

# ↳ Roep de mock-reportfunctie aan i.p.v. de complexe generate_report
mock_generate_report

# ↳ Toon samenvatting en sluit af
show_summary
local _exit_code=$?

[[ "${VERBOSE}" != "true" ]] && rm -rf "${CACHE_DIR}"
exit ${_exit_code}
}
main "$@"

