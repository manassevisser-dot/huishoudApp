#!/usr/bin/env bash
set -euo pipefail

# Fallback logging
if ! command -v log_info &> /dev/null; then
    log_info() { echo -e "ℹ️  $1"; }
    log_ok() { echo -e "✅ $1"; }
    log_val() { echo -e "📊 $1: $2"; }
fi

log_info "PHOENIX_FINAL_SMASH_STARTING"

# Gecorrigeerde TARGETS gebaseerd op je tsconfig.json
TARGETS="domain|state|ui|styles|app|utils|services|assets|logic|config|context|selectors|shared-types|components|fields"
# Zoek alle bestanden met relatieve imports
FILES=$(grep -rE "from ['\"]\.\.?/" src --include="*.ts" --include="*.tsx" -l || true)

for file in $FILES; do
    # We gebruiken een tijdelijk bestand om de sed 'can't read' errors te voorkomen
    # Dit werkt op elk systeem (macOS/Linux)
    sed -E "s#(['\"])(\.\.?/)+($TARGETS)#\1@\3#g" "$file" > "$file.tmp" && mv "$file.tmp" "$file"

    # Specifieke buren-fix voor de state/schemas map die we zagen
    if [[ "$file" == *"src/state/schemas/"* ]]; then
        sed -E "s#from (['\"])\.\./#from \1@state/schemas/#g" "$file" > "$file.tmp" && mv "$file.tmp" "$file"
    fi

    # Specifieke buren-fix voor services
    if [[ "$file" == *"src/services/"* ]]; then
        sed -E "s#from (['\"])(\./)(logger|storage)#from \1@services/\3#g" "$file" > "$file.tmp" && mv "$file.tmp" "$file"
    fi

    log_ok "Phoenix Treatment applied to: $(basename "$file")"
done

log_val "SUCCESS" "Imports hersteld"