#!/usr/bin/env bash
# reports.sh v3.2 - TIMESTAMP_PLACEHOLDER

calc_grade() {
    local t="$1" p="$2" f="$3" s="$4" eff r g

    eff=$(( t - s ))
    if [[ "$eff" -le 0 ]]; then
        printf "N/A"
        return
    fi

    r=$(( p * 100 / eff ))

    if   [[ "$r" -ge 95 && "$f" -eq 0 ]]; then g="A+"
    elif [[ "$r" -ge 90 ]]; then g="A"
    elif [[ "$r" -ge 80 ]]; then g="B"
    else g="F"
    fi

    printf "%s" "$g"
}

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

    if [[ "$mode" == "print" ]]; then
        printf "   %b💡 %s%b\n" "$YELLOW" "$tip" "$NC"
    else
        printf "%s" "$tip"
    fi
}

generate_report() {
    # 1. Zorg dat de variabele altijd een waarde heeft (default: true)
    : "${GENERATE_REPORT:=true}"

    # 2. Gebruik nu een simpele check of we doorgaan
    [[ "${GENERATE_REPORT}" == "false" ]] && return

   

    local t p f s eff r g
    t=$(read_counter total)
    p=$(read_counter passed)
    f=$(read_counter failed)
    s=$(read_counter skipped)

    eff=$((t-s))
    if [[ "$eff" -gt 0 ]]; then
        r=$(( p*100/eff ))
    else
        r=0
    fi

    g="$(calc_grade "$t" "$p" "$f" "$s")"

    local out="${PROJECT_ROOT:-$REPO_ROOT}/artifacts/phoenix-audit.html"
    mkdir -p "$(dirname "$out")"

    local fixes=""
    if [[ -s "$CACHE_DIR/failed_items.txt" ]]; then
        while read -r line; do
            [[ -z "$line" ]] && continue
            local id desc
            id=$(printf "%s\n" "$line" | awk '{print $1}')
            desc=$(printf "%s\n" "$line" | cut -d' ' -f2-)
            fixes+="<li><b>$desc</b><br/><i>$(suggest_fix "$id" return)</i></li>"
        done < "$CACHE_DIR/failed_items.txt"
    else
        fixes="<li>✅ All checks passed</li>"
    fi

    cat > "$out" <<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Phoenix Audit Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 40px auto; padding: 0 20px; background: #f4f7f6; }
        .card { background: white; border-radius: 8px; padding: 25px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); margin-bottom: 20px; }
        .grade { font-size: 72px; font-weight: bold; color: #2ecc71; text-align: center; margin: 20px 0; }
        .stats { display: flex; justify-content: space-around; text-align: center; border-top: 1px solid #eee; padding-top: 20px; }
        .stat-val { font-size: 24px; font-weight: bold; display: block; }
        .stat-label { font-size: 12px; color: #888; text-transform: uppercase; }
        h1 { border-bottom: 2px solid #2ecc71; padding-bottom: 10px; }
        ul { list-style: none; padding: 0; }
        li { background: #fff; margin-bottom: 10px; padding: 15px; border-left: 5px solid #2ecc71; border-radius: 4px; }
    </style>
</head>
<body>
    <div class="card">
        <h1>🦅 Project Phoenix Audit</h1>
        <p>Timestamp: $(date '+%Y-%m-%d %H:%M:%S')</p>
        <div class="grade">$g</div>
        <div class="stats">
            <div><span class="stat-val">$t</span><span class="stat-label">Checks</span></div>
            <div><span class="stat-val">$p</span><span class="stat-label">Passed</span></div>
            <div><span class="stat-val">$f</span><span class="stat-label">Failed</span></div>
        </div>
    </div>
    <div class="card">
        <h2>🛠️ Aanbevelingen & Revisies</h2>
        <ul>$fixes</ul>
    </div>
</body>
</html>
HTML

    printf "%b%s%b %s\n" "$GREEN" "$ICON_OK" "$NC" "Report: $out"
    
    echo "Rapport wordt gegenereerd..."
}

show_summary() {
    local t p f s letter color

    t="$(read_counter total)"
    p="$(read_counter passed)"
    f="$(read_counter failed)"
    s="$(read_counter skipped)"

    printf "\n${BLUE}${BOLD}=== RESULTS ===${NC}\n"

    printf "Total: %s | Passed: ${GREEN}%s${NC} | Failed: ${RED}%s${NC} | Skipped: ${YELLOW}%s${NC}\n" \
        "$t" "$p" "$f" "$s"

    letter="$(calc_grade "$t" "$p" "$f" "$s")"

    case "$letter" in
        A+|A) color="$GREEN" ;;
        B)   color="$YELLOW" ;;
        F|N/A) color="$RED" ;;
        *)   color="$YELLOW" ;;
    esac

    printf "Grade: %b%s%b\n" "$color" "$letter" "$NC"
}
