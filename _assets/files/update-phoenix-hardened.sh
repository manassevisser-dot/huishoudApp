#!/usr/bin/env bash
# Phoenix Audit Engine - Complete Hardened Update Script v3.1
# Updates: core.sh, checkers.sh, audits.sh, reports.sh, extractors.sh

set -euo pipefail

# === ERROR HANDLING ===
on_error() {
    echo "❌ Update failed at line $1" >&2
    echo "   Rolling back backups..." >&2
    for backup in .phoenix/*.sh.bak.*; do
        [[ -f "$backup" ]] && {
            original="${backup%.bak.*}"
            echo "   Restoring $original"
            mv "$backup" "$original"
        }
    done
    exit 1
}
trap 'on_error $LINENO' ERR

# === ENVIRONMENT ===
SCRIPT_VERSION="3.1"
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$REPO_ROOT" || exit 1
TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
DRY_RUN="${DRY_RUN:-false}"

# TTY detection
if [[ -t 1 ]]; then
    I="ℹ️"; S="✅"; W="⚠️"; E="❌"
else
    I="[INFO]"; S="[OK]"; W="[WARN]"; E="[FAIL]"
fi

log_info() { echo "${I}  $*"; }
log_ok() { echo "${S} $*"; }
log_warn() { echo "${W}  $*"; }

# === HELPERS ===
portable_sed() {
    local pattern="$1" file="$2" tmp
    [[ ! -f "$file" ]] && { log_warn "Skip: $file"; return 0; }
    tmp="$(mktemp)"
    sed "$pattern" "$file" > "$tmp" && mv "$tmp" "$file"
    log_ok "Patched: $file"
}

write_atomic() {
    local dst="$1" label="$2" content="$3" tmp
    [[ "$DRY_RUN" == "true" ]] && { log_warn "DRY: $label → $dst"; return 0; }
    
    tmp="$(mktemp)"
    trap "rm -f '$tmp'" RETURN
    printf '%s\n' "$content" > "$tmp"
    
    [[ "$dst" == *.sh ]] && { bash -n "$tmp" || return 1; chmod +x "$tmp"; }
    
    [[ -f "$dst" ]] && ! cmp -s "$dst" "$tmp" && {
        cp -p "$dst" "${dst}.bak.${TIMESTAMP}"
        log_info "Backup: ${dst}.bak.${TIMESTAMP}"
    }
    
    mv "$tmp" "$dst"
    log_ok "Written: $label"
}

# === MAIN ===
log_info "🔧 Phoenix v${SCRIPT_VERSION} Complete Upgrade"
mkdir -p .phoenix .phoenix/.cache artifacts

# STEP 1: Patch source
log_info "\n📝 Step 1: Patching source..."
[[ -f "src/domain/rules/evaluateDomainRules.ts" ]] && \
    portable_sed 's/GEEN PROVINCIES/GEEN SUB-NATIONALE NIVEAUS/g' \
        "src/domain/rules/evaluateDomainRules.ts"

# STEP 2: core.sh
log_info "\n🏗️  Step 2: core.sh..."
write_atomic ".phoenix/core.sh" "core.sh" "$(cat <<'CORE'
#!/usr/bin/env bash
# core.sh v3.1 - TIMESTAMP_PLACEHOLDER
VERBOSE=${VERBOSE:-false}
PARALLEL=${PARALLEL:-false}
DRY_RUN=${DRY_RUN:-false}
SOFT_FAIL=${SOFT_FAIL:-false}
GENERATE_REPORT=${GENERATE_REPORT:-false}
export max_household_size=${max_household_size:-5}
declare -A THRESHOLDS

# UI
[[ -t 1 ]] && { ICON_OK="✅"; ICON_FAIL="❌"; ICON_WARN="⚠️"; } || { ICON_OK="[OK]"; ICON_FAIL="[FAIL]"; ICON_WARN="[WARN]"; }
BOLD='\033[1m'; DIM='\033[2m'; RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[0;33m'; BLUE='\033[0;34m'; NC='\033[0m'

# Cache
init_counters() {
    CACHE_DIR="${CACHE_DIR:-/tmp/phoenix-audit-$$}"
    mkdir -p "$CACHE_DIR"
    for c in total passed failed skipped; do echo "0" > "$CACHE_DIR/$c"; done
    : > "$CACHE_DIR/failed_items.txt"
}

atomic_inc() {
    local f="$CACHE_DIR/$1" l="${f}.lock"
    [[ ! -f "$f" ]] && echo "0" > "$f"
    ( flock -x 200; echo "$(($(cat "$f" 2>/dev/null | tr -dc '0-9') + 1))" > "$f" ) 200>"$l"
}

read_counter() { cat "$CACHE_DIR/$1" 2>/dev/null || echo "0"; }

record_failure() {
    local id="${1:-unknown}" desc="${2:-No desc}"
    [[ "$id" == "unknown" && "${STRICT_MODE:-false}" == "true" ]] && echo -e "${YELLOW}Missing ID: $desc${NC}" >&2
    atomic_inc "failed"
    ( flock -x 200; echo "$id $desc" >> "$CACHE_DIR/failed_items.txt" ) 200>"$CACHE_DIR/failed_items.txt.lock"
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
    local c="${PROJECT_ROOT:-.}/.phoenix-audit.conf"
    [[ -f "$c" ]] && { source "$c"; log_verbose "Config: $c"; } || log_verbose "No config"
}

init_counters
CORE
)"
CORE_CONTENT="$(cat <<'CORE'
... TIMESTAMP_PLACEHOLDER ...
CORE
)"

CORE_CONTENT="${CORE_CONTENT/TIMESTAMP_PLACEHOLDER/$TIMESTAMP}"




# STEP 3: checkers.sh
log_info "\n🔍 Step 3: checkers.sh..."
write_atomic ".phoenix/checkers.sh" "checkers.sh" "$(cat <<'CHECKERS'
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
CHECKERS
)"

# STEP 4: audits.sh (unchanged from previous)
log_info "\n🎯 Step 4: audits.sh..."
write_atomic ".phoenix/audits.sh" "audits.sh" "$(cat <<'AUDITS'
#!/usr/bin/env bash
# audits.sh v3.1 - TIMESTAMP_PLACEHOLDER

run_all_audits() {
    log_section "PHOENIX AUDITS"
    check_file_exists "package.json" "Node Manifest"
    check_file_exists "tsconfig.json" "TS Config"
    check_pattern "as const" "src" "Type-safety" "1" "" "ssot"
    check_pattern "Math\.max\(0," "src" "Non-negative parser" "1" "" "parsing"
    check_pattern "\.toFixed\(2\)" "src" "Currency format" "1" "" "parsing"
    check_antipattern "\.\./\.\./\.\./" "src" "Deep Imports" "" "deep_imports"
    check_antipattern "console\.(log|debug|warn|error)\(" "src" "Console" "(\.test\.|dev-tools/|logger\.ts)" "console"
    check_pattern "SET_|TOGGLE_|UPDATE_|RESET_" "src" "Actions" "1" "" "actions"
    check_antipattern "\b(provincie|province|district)\b" "src" "Geo ADR-18" "(node_modules|\.venv|\.phoenix)" "geo_terms"
    check_pattern "geo_scope" "src/domain/rules/evaluateDomainRules.ts" "Contract" "1" "" "contract"
    check_pattern "PHOENIX_EVENT" "src/domain/rules/evaluateDomainRules.ts" "Telemetry" "1" "" "telemetry"
    
    if ! npm list tsconfig-paths &>/dev/null; then
        echo -e "${YELLOW}${ICON_WARN} Refactor test skip (no tsconfig-paths)${NC}"
        atomic_inc "total"; atomic_inc "skipped"
    else
        local t=".temp_wai008.ts"
        trap "rm -f '$t'" RETURN
        cat > "$t" <<'TS'
import { getAppStyles } from './src/ui/styles/useAppStyles';
import { Colors } from './src/ui/styles/Colors';
import { Space } from './src/ui/styles/Tokens';
try {
    if (Space.xl !== 20) throw new Error('Space.xl != 20');
    if (Colors.light.primary !== '#007AFF') throw new Error('Colors wrong');
    const s = getAppStyles('light');
    const m = ['container','button','moneyInputWrapper'].filter(k => !s?.[k]);
    if (m.length) throw new Error(`Missing: ${m.join(',')}`);
    process.exit(0);
} catch(e) { console.error(e.message); process.exit(1); }
TS
        run_cmd "npx ts-node -r tsconfig-paths/register --transpileOnly $t" "Refactor Integration" "false"
    fi
}
AUDITS
)"

# STEP 5-6: reports.sh & extractors.sh (compact versions)
log_info "\n📊 Step 5: reports.sh..."
write_atomic ".phoenix/reports.sh" "reports.sh" "$(cat <<'REPORTS'
#!/usr/bin/env bash
# reports.sh v3.1 - TIMESTAMP_PLACEHOLDER

suggest_fix() {
    local id="$1" mode="${2:-print}" tip=""
    case "$id" in
        ssot) tip="Use 'as const' for type-safety" ;;
        actions) tip="Use SET_/TOGGLE_/UPDATE_/RESET_ prefixes" ;;
        parsing) tip="Centralize in src/utils/numbers.ts" ;;
        deep_imports) tip="Add path aliases (@/*) in tsconfig" ;;
        console) tip="Remove console.*; use Logger" ;;
        geo_terms) tip="ADR-18: Remove province/district refs" ;;
        contract) tip="Pass 'geo_scope' in evaluateDomainRules" ;;
        telemetry) tip="Add PHOENIX_EVENT logging" ;;
        *) tip="See Phoenix docs" ;;
    esac
    [[ "$mode" == "print" ]] && echo -e "   ${YELLOW}💡 $tip${NC}" || echo "$tip"
}

generate_report() {
    [[ "${GENERATE_REPORT}" != "true" ]] && return
    local t p f s r g
    t=$(read_counter total); p=$(read_counter passed); f=$(read_counter failed); s=$(read_counter skipped)
    local eff=$((t-s))
    r=$(( eff > 0 ? p*100/eff : 0 ))
    [[ $r -ge 95 ]] && g="A+" || [[ $r -ge 90 ]] && g="A" || [[ $r -ge 80 ]] && g="B" || g="F"
    
    local out="${PROJECT_ROOT:-$REPO_ROOT}/artifacts/phoenix-audit.html"
    mkdir -p "$(dirname "$out")"
    
    local fixes=""
    [[ -s "$CACHE_DIR/failed_items.txt" ]] && {
        while read -r line; do
            [[ -z "$line" ]] && continue
            local id=$(echo "$line" | awk '{print $1}')
            local desc=$(echo "$line" | cut -d' ' -f2-)
            fixes+="<li><b>$desc</b><br/><i>$(suggest_fix "$id" return)</i></li>"
        done < "$CACHE_DIR/failed_items.txt"
    } || fixes="<li>✅ All checks passed</li>"
    
    cat > "$out" <<HTML
<!DOCTYPE html><html><head><meta charset="utf-8"><title>Phoenix Report</title>
<style>body{font:14px sans-serif;max-width:800px;margin:40px auto;padding:20px}
.card{background:#fff;padding:30px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1)}
.grade{font-size:4rem;text-align:center;color:#28a745}
h1{color:#4a90e2;border-bottom:2px solid #eee;padding-bottom:10px}
li{margin:10px 0;padding:10px;background:#f9f9f9;border-left:3px solid #dc3545}</style>
</head><body><div class="card">
<h1>🚀 Phoenix Audit</h1>
<div class="grade">$g ($r%)</div>
<p><b>Total:</b> $t | <b>Passed:</b> $p | <b>Failed:</b> $f | <b>Skipped:</b> $s</p>
<h2>Failed Checks</h2><ul>$fixes</ul>
<p style="color:#999;font-size:0.8rem">Generated: $(date)</p>
</div></body></html>
HTML
    echo -e "${GREEN}${ICON_OK} Report: $out${NC}"
}

show_summary() {
    local t p f s
    t=$(read_counter total); p=$(read_counter passed); f=$(read_counter failed); s=$(read_counter skipped)
    echo -e "\n${BLUE}${BOLD}=== RESULTS ===${NC}"
    echo "Total: $t | Passed: ${GREEN}$p${NC} | Failed: ${RED}$f${NC} | Skipped: ${YELLOW}$s${NC}"
    [[ $f -eq 0 ]] && echo -e "Grade: ${GREEN}A+${NC}" || [[ $f -le 2 ]] && echo -e "Grade: ${YELLOW}B${NC}" || echo -e "Grade: ${RED}F${NC}"
}
REPORTS
)"

log_info "\n🔧 Step 6: extractors.sh..."
write_atomic ".phoenix/extractors.sh" "extractors.sh" "$(cat <<'EXTRACTORS'
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
EXTRACTORS
)"

# FINAL
log_info "\n🔒 Setting permissions..."
chmod +x .phoenix/*.sh 2>/dev/null || true

log_ok "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_ok "Phoenix v${SCRIPT_VERSION} COMPLETE"
log_ok "━━━━━━━━━━━━━━━━━━━━━━━━━━━"
log_info "\nUpdated files:"
log_info "  ✓ core.sh (infrastructure)"
log_info "  ✓ checkers.sh (validation)"
log_info "  ✓ audits.sh (checks)"
log_info "  ✓ reports.sh (reporting)"
log_info "  ✓ extractors.sh (helpers)"
log_info "\nBackups: .phoenix/*.bak.${TIMESTAMP}"
log_info "\nNext: bash .phoenix/audit.sh"
[[ "$DRY_RUN" == "true" ]] && log_warn "\nDRY RUN - No changes made"
exit 0