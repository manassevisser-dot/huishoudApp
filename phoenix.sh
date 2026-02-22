#!/usr/bin/env bash
# Phoenix Commander v3.5 – Trinity Edition 2.0 (Production)
set -euo pipefail

# === Configuratie ===
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
export PROJECT_ROOT

# Load log bridge met fallback
if [[ -f "$PROJECT_ROOT/scripts/utils/log_bridge.sh" ]]; then
    source "$PROJECT_ROOT/scripts/utils/log_bridge.sh"
else
    log_info() { echo "ℹ️  $*"; }
    log_err() { echo "❌ $*" >&2; }
    log_ok() { echo "✅ $*"; }
    log_warn() { echo "⚠️  $*"; }
fi

DRY_RUN=false
VERBOSE=false
HISTORY_DIR="$PROJECT_ROOT/.phoenix/history"

# === Argument Parser ===
parse_args() {
    for arg in "$@"; do
        case $arg in
            -d|--dry-run) DRY_RUN=true ;;
            -v|--verbose) VERBOSE=true ;;
            -h|--help) cmd_help; exit 0 ;;
        esac
    done
    export DRY_RUN VERBOSE
}

# === Dependency Check (cached) ===
check_dependencies() {
    local cache_file="$PROJECT_ROOT/.phoenix/.deps-checked"
    
    # Skip if recently checked (within 24h)
    if [[ -f "$cache_file" ]]; then
        local age=$(($(date +%s) - $(stat -f%m "$cache_file" 2>/dev/null || stat -c%Y "$cache_file")))
        if [[ $age -lt 86400 ]]; then
            return 0
        fi
    fi
    
    local missing=()
    for cmd in node npm jq git; do
        if ! command -v "$cmd" >/dev/null 2>&1; then
            missing+=("$cmd")
        fi
    done
    
    if [[ ${#missing[@]} -gt 0 ]]; then
        log_err "Missing dependencies: ${missing[*]}"
        echo ""
        echo "Install instructions:"
        echo "  • jq:   brew install jq  (or apt-get install jq)"
        echo "  • node: https://nodejs.org"
        exit 40
    fi
    
    # Cache success
    mkdir -p "$(dirname "$cache_file")"
    touch "$cache_file"
}

# === Core Functions ===

cmd_test() {
    log_info "🧪 Test Suite draaien..."
    local test_flags="--watchAll=false --coverage --json --outputFile=coverage/report.json"
    [ "$VERBOSE" = false ] && test_flags="$test_flags --silent"
    
    if ! npm test -- $test_flags; then
        log_err "Tests gefaald!"
        echo ""
        echo "Quick fixes:"
        echo "  • npm test -- --verbose    (zie details)"
        echo "  • npm test -- --watch      (iteratief fixen)"
        echo "  • ./phoenix health         (check systeem)"
        return 1
    fi
}

get_scores_json() {
    # Roep orchestrator aan en vang JSON op
    local json
    json=$(node scripts/maintenance/audit-orchestrator.js 2>/dev/null)
    
    # Valideer dat het JSON is
    if ! echo "$json" | jq empty 2>/dev/null; then
        log_err "Invalid JSON from audit-orchestrator"
        echo '{"audit":0,"coverage":0,"stability":0,"master":"U"}'
        return 1
    fi
    
    echo "$json"
}

save_history() {
    local json="$1"
    
    mkdir -p "$HISTORY_DIR"
    local timestamp; timestamp=$(date +%Y%m%d-%H%M%S)
    echo "$json" > "$HISTORY_DIR/$timestamp.json"
    
    # Cleanup: keep last 30 entries
    ls -t "$HISTORY_DIR"/*.json 2>/dev/null | tail -n +31 | xargs rm -f 2>/dev/null || true
}

check_quality_gates() {
    local json="$1"
    local coverage; coverage=$(echo "$json" | jq -r '.coverage')
    local master; master=$(echo "$json" | jq -r '.master')
    local stability; stability=$(echo "$json" | jq -r '.stability')
    
    local failed=false
    
    # Hard gates
    if [[ "$coverage" -lt 70 ]]; then
        log_err "❌ HARD GATE: Coverage onder 70% (${coverage}%)"
        failed=true
    fi
    
    if [[ "$master" == "C" ]] || [[ "$master" == "D" ]]; then
        log_err "❌ HARD GATE: Master grade onder B (${master})"
        failed=true
    fi
    
    # Soft gates (warnings only)
    if [[ "$coverage" -lt 80 ]] && [[ "$coverage" -ge 70 ]]; then
        log_warn "⚠️  SOFT GATE: Coverage ${coverage}% (target: 80%+)"
    fi
    
    if [[ "$stability" -lt 80 ]]; then
        log_warn "⚠️  SOFT GATE: Stability ${stability}% (target: 80%+)"
    fi
    
    if [[ "$failed" == "true" ]]; then
        return 1
    fi
    
    return 0
}

# === Trinity Commands ===

cmd_all() {
    log_info "🔍 Trinity Analyse..."
    
    # Run tests
    cmd_test || {
        log_warn "Tests gefaald - scores mogelijk onbetrouwbaar"
    }
    
    # Get scores
    local json; json=$(get_scores_json)
    
    # Save to history
    save_history "$json"
    
    # Parse scores
    local a; a=$(echo "$json" | jq -r '.audit')
    local c; c=$(echo "$json" | jq -r '.coverage')
    local s; s=$(echo "$json" | jq -r '.stability')
    local m; m=$(echo "$json" | jq -r '.master')
    local t; t=$(echo "$json" | jq -r '.timestamp')

    # Display dashboard
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "   📊 PHOENIX TRINITY SCORES"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "   🏛️  Audit:     ${a}%"
    echo "   🧪  Coverage:  ${c}%"
    echo "   🛡️  Stability: ${s}%"
    echo "   ⏰  Time:      $(echo "$t" | cut -d'T' -f2 | cut -d'.' -f1)"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Quality gates
    if check_quality_gates "$json"; then
        log_ok "👑 MASTER GRADE: $m"
        return 0
    else
        log_err "👑 MASTER GRADE: $m (Quality gates failed)"
        return 1
    fi
}

cmd_full() {
    log_info "🌅 Phoenix End-of-Day run..."
    echo ""
    
        log_info "🔄 Synchroniseer aliassen..."
    if [ "$DRY_RUN" = false ]; then
        if ! npm run sync:aliases -- --strict; then
            log_err "Alias sync gefaald!"
            return 1
        fi
        log_ok "Aliases gesynchroniseerd"
    else
        log_warn "[DRY-RUN] Zou alias sync uitvoeren"
    fi
    echo ""

    # 1. Linting
    if [ "$DRY_RUN" = false ]; then
        log_info "🧹 Linting..."
        npm run lint -- --fix 2>&1 | grep -E "(error|warning)" || log_ok "Lint passed"
    else
        log_warn "[DRY-RUN] Zou linting uitvoeren"
    fi
    
    # 2. Tests (Must Pass)
    echo ""
    cmd_test || { 
        log_err "Tests falen! EOD afgebroken."
        return 1
    }
    
    # 3. Get scores & check gates
    echo ""
    log_info "📊 Trinity analyse..."
    local json; json=$(get_scores_json)
    
    if ! check_quality_gates "$json"; then
        log_err "Quality gates failed! EOD afgebroken."
        echo ""
        echo "Fix issues or use:"
        echo "  git commit -m 'fix: emergency [NO-QUALITY]'"
        return 1
    fi
    
    # 4. Save history
    save_history "$json"
    
    # Parse voor commit message
    local m; m=$(echo "$json" | jq -r '.master')
    local a; a=$(echo "$json" | jq -r '.audit')
    local c; c=$(echo "$json" | jq -r '.coverage')
    local s; s=$(echo "$json" | jq -r '.stability')
    local stats="A:${a}% C:${c}% S:${s}%"

    # 5. Commit
    echo ""
    if [ "$DRY_RUN" = false ]; then
        log_info "📦 Git commit..."
        
        # Check if there are changes
        if git diff --quiet && git diff --cached --quiet; then
            log_warn "Geen wijzigingen om te committen"
        else
            git add .
            git commit -m "Phoenix EOD: $(date +'%Y-%m-%d %H:%M') - Grade $m

Trinity Scores:
- Audit:     ${a}%
- Coverage:  ${c}%
- Stability: ${s}%
- Master:    $m"
            
            local commit_hash; commit_hash=$(git rev-parse --short HEAD)
            
            # 6. EOD Ritueel Scherm
            echo ""
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            echo "   🌅 PHOENIX — END OF DAY REPORT"
            echo "   📅 $(date '+%Y-%m-%d %H:%M:%S')"
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            echo "   🏆 MASTER GRADE: $m"
            echo ""
            echo "   📊 Trinity Scores:"
            echo "      🏛️  Audit:     ${a}%"
            echo "      🧪  Coverage:  ${c}%"
            echo "      🛡️  Stability: ${s}%"
            echo ""
            echo "   ✅ Commit: $commit_hash"
            echo "   📝 Branch: $(git branch --show-current)"
            echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
            echo ""
            log_ok "Werkdag succesvol afgesloten en veiliggesteld in Git."
        fi
    else
        log_warn "[DRY-RUN] Zou commit maken met Grade $m ($stats)"
        echo ""
        echo "Preview commit message:"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "Phoenix EOD: $(date +'%Y-%m-%d %H:%M') - Grade $m"
        echo ""
        echo "Trinity Scores:"
        echo "- Audit:     ${a}%"
        echo "- Coverage:  ${c}%"
        echo "- Stability: ${s}%"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    fi
}

cmd_watch() {
    log_info "👀 Watch-modus gestart (Ctrl+C om te stoppen)"
    
    local prev_grade=""
    
    while true; do
        clear
        echo "=== Phoenix Live Dashboard === $(date +%H:%M:%S)"
        echo ""
        
        local json; json=$(get_scores_json)
        local master; master=$(echo "$json" | jq -r '.master')
        
        # Notificatie bij grade change (macOS)
        if [[ -n "$prev_grade" ]] && [[ "$master" != "$prev_grade" ]]; then
            if command -v osascript >/dev/null 2>&1; then
                osascript -e "display notification \"Grade changed: $prev_grade → $master\" with title \"Phoenix Trinity\""
            fi
            echo "🔔 Grade changed: $prev_grade → $master"
            echo ""
        fi
        
        prev_grade="$master"
        
        # Run analysis
        cmd_all || true
        
        echo ""
        echo "Next refresh in 30 seconds..."
        sleep 30
    done
}

cmd_stats() {
    log_info "📈 Trinity History (last 7 days)"
    
    if [[ ! -d "$HISTORY_DIR" ]]; then
        log_warn "Geen history gevonden. Run eerst './phoenix all'"
        return 0
    fi
    
    echo ""
    echo "Date       Time    Grade  Audit  Cov   Stab"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # Last 20 entries
    ls -t "$HISTORY_DIR"/*.json 2>/dev/null | head -20 | while read -r file; do
        local json; json=$(cat "$file")
        local timestamp; timestamp=$(basename "$file" .json)
        local date_part; date_part=$(echo "$timestamp" | cut -d'-' -f1)
        local time_part; time_part=$(echo "$timestamp" | cut -d'-' -f2)
        
        # Format: YYYYMMDD -> YYYY-MM-DD
        local formatted_date="${date_part:0:4}-${date_part:4:2}-${date_part:6:2}"
        # Format: HHMMSS -> HH:MM
        local formatted_time="${time_part:0:2}:${time_part:2:2}"
        
        local m; m=$(echo "$json" | jq -r '.master')
        local a; a=$(echo "$json" | jq -r '.audit')
        local c; c=$(echo "$json" | jq -r '.coverage')
        local s; s=$(echo "$json" | jq -r '.stability')
        
        printf "%-10s %-7s %-6s %-6s %-5s %-5s\n" \
            "$formatted_date" "$formatted_time" "$m" "${a}%" "${c}%" "${s}%"
    done
}

cmd_health() {
    log_info "🏥 System Health Check"
    echo ""
    
    # Dependencies
    echo "📦 Dependencies:"
    local deps=(node npm jq git)
    local all_ok=true
    
    for cmd in "${deps[@]}"; do
        if command -v "$cmd" >/dev/null 2>&1; then
            echo "  ✅ $cmd: $(command -v "$cmd")"
        else
            echo "  ❌ $cmd: not found"
            all_ok=false
        fi
    done
    
    echo ""
    echo "📁 Project Structure:"
    local files=(
        "scripts/maintenance/audit-orchestrator.js"
        "scripts/utils/log_bridge.sh"
        "package.json"
    )
    
    for file in "${files[@]}"; do
        if [[ -f "$PROJECT_ROOT/$file" ]]; then
            echo "  ✅ $file"
        else
            echo "  ❌ $file (missing)"
            all_ok=false
        fi
    done
    
    echo ""
    if [[ "$all_ok" == "true" ]]; then
        log_ok "All systems operational"
    else
        log_err "Some checks failed"
        return 1
    fi
}

cmd_help() {
    cat <<'HELP'
🦅 Phoenix Commander v3.5 - Trinity Edition

USAGE:
  ./phoenix [options] <command>

OPTIONS:
  -d, --dry-run    Simulatie modus (geen wijzigingen)
  -v, --verbose    Volledige logs
  -h, --help       Toon deze help

COMMANDS:
  all      Run Trinity analyse (test + score + gates)
  full     End-of-Day routine (lint + test + commit)
  watch    Live dashboard (ververst elke 30s)
  stats    Toon Trinity history (laatste 7 dagen)
  health   System health check

QUALITY GATES:
  Hard Gates (blokkeren commit):
    • Coverage < 70%
    • Master Grade < B
  
  Soft Gates (waarschuwing):
    • Coverage < 80%
    • Stability < 80%

EXAMPLES:
  ./phoenix all                    # Quick check
  ./phoenix full --dry-run         # Preview EOD
  ./phoenix full                   # Commit workflow
  ./phoenix watch                  # Live monitoring
  ./phoenix stats                  # View trends

TRINITY SCORES:
  🏛️  Audit:     Code architecture quality
  🧪  Coverage:  Test branch coverage
  🛡️  Stability: Coverage adjusted for risk
  👑  Master:    Overall grade (S/A/B/C)

HELP
}

# === Entry Point ===
check_dependencies
parse_args "$@"

# Remove parsed flags from $@
shift $((OPTIND - 1)) 2>/dev/null || true

case "${1:-help}" in
    all)    cmd_all ;;
    full)   cmd_full ;;
    watch)  cmd_watch ;;
    stats)  cmd_stats ;;
    health) cmd_health ;;
    help|-h|--help) cmd_help ;;
    *) 
        echo "❌ Unknown command: ${1}"
        echo ""
        cmd_help
        exit 1
        ;;
esac


