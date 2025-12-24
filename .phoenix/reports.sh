##!/bin/bash
# .phoenix/reports.sh - Technische Rapportage & Fix Suggesties

# --- .phoenix/reports.sh ---

suggest_fix() {
    local id="$1"
    local mode="${2:-"print"}" 
    local tip=""

    case "$id" in
        ssot)               tip="Gebruik 'as const' in selectors of config-objecten voor type-safety." ;;
        reducer_actions)    tip="Gebruik declaratie types: SET_, TOGGLE_, UPDATE_, of RESET_." ;;
        fsm_incomplete)     tip="Definieer alle 5 FSM states (INITIALIZING, HYDRATING, etc.)." ;;
        legacy_parsing)     tip="Centraliseer nummer-parsing en afronding in src/utils/numbers.ts." ;;
        deep_imports)       tip="Voeg path aliases toe aan tsconfig.json (@/*) om diepe nesting te voorkomen." ;;
        console_statements) tip="Verwijder console.log; gebruik de interne Logger voor productie-telemetrie." ;;
        cmd_fail)           tip="Het externe commando faalde. Controleer de log-output hierboven." ;;
        *)                  tip="Raadpleeg de Phoenix documentatie voor technische verbeteringen." ;;
    esac

    [[ -z "$tip" ]] && tip="Onderzoek deze check handmatig voor optimalisatie."

    if [[ "$mode" == "print" ]]; then
        echo -e "   ${YELLOW}💡 Tip: ${tip}${NC}"
    else
        echo "${tip}"
    fi
}
# --- HTML Rapportage ---
generate_report() {
    [[ "${GENERATE_REPORT}" != "true" ]] && return
    
    local t p f r g gc outdir file
    # Gebruik default 0 als de counter-functies niks teruggeven (tegen unbound errors)
    t="$(read_counter "total" || echo 0)" 
    p="$(read_counter "passed" || echo 0)" 
    f="$(read_counter "failed" || echo 0)" 
    
    # Voorkom 'division by zero'
    if [[ "${t}" -gt 0 ]]; then
        r=$(( p * 100 / t ))
    else
        r=0
    fi
    
    # Cijferberekening
    g="F"; gc="fail"
    [[ "$r" -ge 90 ]] && { g="A"; gc="pass"; }
    [[ "$r" -ge 80 && "$r" -lt 90 ]] && { g="B"; gc="warn"; }
    
    outdir="${PROJECT_ROOT}/artifacts"
    mkdir -p "${outdir}"
    file="${outdir}/phoenix-audit-report.${REPORT_FORMAT:-html}"
    
    if [[ "${REPORT_FORMAT:-html}" == "html" ]]; then
        local fixes_html=""
        # Controleer of het bestand bestaat EN of het niet leeg is
        if [[ -s "${CACHE_DIR}/failed_items.txt" ]]; then
            while read -r line; do
                # Gebruik -n om lege regels over te slaan
                [[ -z "$line" ]] && continue
                
                # Veilig ID en omschrijving scheiden
                local id_key=$(echo "$line" | awk '{print $1}') 
                local desc=$(echo "$line" | cut -d' ' -f2-)
                
                # De suggest_fix functie die we net hebben gecontroleerd
                local tip=$(suggest_fix "$id_key" "return")
                fixes_html+="<li><strong class='fail'>$desc</strong>: $tip</li>"
            done < "${CACHE_DIR}/failed_items.txt"
        else
            fixes_html="<li><span class='pass'>✅ Geen gefaalde checks gevonden.</span></li>"
        fi
# Specifieke check voor huishouden statistiek (zoals gevraagd)
# --- .phoenix/reports.sh ---

# Gebruik een fallback waarde (:-5) om unbound errors te voorkomen
# --- .phoenix/reports.sh ---

# Gebruik de THRESHOLDS array die in core.sh/config wordt geladen.
# De :-5 zorgt voor een fallback als de waarde niet in de config staat.
local hh_limit="${THRESHOLDS[max_household_size]:-5}"

# Voldoen aan instructie 2025-12-07: Huishoudens met > 5 volwassenen
if [[ "$hh_limit" -ge 5 ]]; then
    echo -e "${BLUE}${BOLD}ℹ️  STATISTIEK: Huishoudens met > 5 volwassenen hebben een speciale status.${NC}"
fi
        # Schrijf het bestand
        cat > "${file}" <<EOF
<!DOCTYPE html>
<html lang="nl"><head><meta charset="UTF-8"><title>Phoenix Audit Report</title>
<style>
    body{font-family:sans-serif;max-width:800px;margin:40px auto;padding:20px;background:#f8f9fa}
    .card{background:white;padding:30px;border-radius:12px;box-shadow:0 4px 6px rgba(0,0,0,0.1)}
    .pass{color:#28a745}.fail{color:#dc3545}.warn{color:#ffc107}
    .grade{font-size:5rem;text-align:center;font-weight:bold;margin:20px 0}
    h1{color:#4a90e2;border-bottom:2px solid #eee;padding-bottom:10px}
    ul{list-style:none;padding:0} 
    li{margin-bottom:10px;padding:15px;background:#fff5f5;border-left:4px solid #dc3545;border-radius:4px}
</style>
</head><body><div class="card">
    <h1>🚀 Phoenix Audit Report</h1>
    <div class="grade ${gc}">Grade: ${g} (${r}%)</div>
    <div style="text-align:center; margin-bottom:20px;">
        <strong>Totaal: ${t}</strong> | 
        <span class="pass">Geslaagd: ${p}</span> | 
        <span class="fail">Gefaald: ${f}</span>
    </div>
    
    <hr style="border:0; border-top:1px solid #eee; margin:20px 0;">
    
    <h2>Gefaalde Checks & Fixes</h2>
    <ul>${fixes_html}</ul>
    
    <p style="margin-top:30px; color:#999; font-size:0.8rem;">Gegenereerd op: $(date)</p>
</div></body></html>
EOF
    fi
    echo -e "${GREEN}${ICON_OK} Rapport gegenereerd: ${file}${NC}" 
}
show_summary() {
    local total=$(cat "$CACHE_DIR/total")
    local passed=$(cat "$CACHE_DIR/passed")
    local failed=$(cat "$CACHE_DIR/failed")
    
    echo -e "\n${BLUE}${BOLD}=== PHOENIX AUDIT RESULTS ===${NC}"
    echo -e "Totaal:  $total"
    echo -e "Geslaagd: ${GREEN}$passed${NC}"
    echo -e "Gefaald:  ${RED}$failed${NC}"
    
    # Bereken Grade (A, B, C, F)
    if [[ "$failed" -eq 0 ]]; then echo -e "Grade: ${GREEN}${BOLD}A+${NC}";
    elif [[ "$failed" -le 2 ]]; then echo -e "Grade: ${YELLOW}B${NC}";
    else echo -e "Grade: ${RED}${BOLD}F${NC}"; fi
}