#!/bin/bash
# Dynamisch pad bepalen naar de root van je project
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source "$SCRIPT_DIR/scripts/utils/log_bridge.sh"

# Gebruik de variabelen direct als de functies niet exporteren
# (Sommige systemen blokkeren export -f naar subshells)
log_info "DEDUP_START"
# Zorg dat de brug geladen is (pad aanpassen indien nodig)
source "${PROJECT_ROOT}/scripts/utils/log_bridge.sh"

# Scan voor dubbelingen tussen src/ui en de rest
find src/ui -type f \( -name "*.tsx" -o -name "*.ts" \) | while read ui_path; do
    filename=$(basename "$ui_path")
    
    # Zoek buiten src/ui en src/Tempwizard
    other_path=$(find src -type f -name "$filename" ! -path "src/ui/*" ! -path "src/Tempwizard/*" ! -path "*/node_modules/*" | head -n 1)

    if [ ! -z "$other_path" ]; then
        # Gebruik de log_val voor gedetailleerde info
        log_warn "📍 Dubbel gevonden: $filename"
        
        hash_a=$(md5sum "$ui_path" | awk '{ print $1 }')
        hash_b=$(md5sum "$other_path" | awk '{ print $1 }')

        if [ "$hash_a" == "$hash_b" ]; then
            log_ok "DEDUP_OK ($filename is identiek)"
            # Optioneel: Automatisch de oude verwijderen?
            # rm "$other_path" && log_info "🗑️ Verwijderd: $other_path"
        else
            log_err "⚠️ Verschil gedetecteerd in $filename!"
            echo "   UI: $ui_path"
            echo "   OLD: $other_path"
        fi
    fi
done

log_ok "FINISH"