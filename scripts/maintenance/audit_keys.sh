#!/usr/bin/env bash
set -euo pipefail

# Configuratie
TARGET_DIR="${1:-src}"
TEMP_FILE=$(mktemp)

# Kleuren
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m'

trap 'rm -f "$TEMP_FILE"' EXIT

if ! command -v rg &> /dev/null; then
    echo -e "${RED}Error: 'rg' (ripgrep) is niet geïnstalleerd.${NC}"
    exit 1
fi

echo -e "${BLUE}${BOLD}🔍 Start Complete Audit in: $TARGET_DIR${NC}\n"

# --- FUNCTIE: Key/Value Analyse ---
# $1 = Key (bijv. pageId)
# $2 = Mode (consistency, duplicate)
# $3 = Regex voor "Verdacht" (Optioneel)
analyze_key() {
    local key="$1"
    local mode="$2"
    local suspicious_regex="${3:-}"
    local error_found=0

    echo -e "${BOLD}--- Analyse: $key ---${NC}"

    # 1. Zoek & Extract
    rg -Hn "${key}\s*[:=]\s*['\"][^'\"]+['\"]" "$TARGET_DIR" \
    | sed -E "s/^([^:]+:[0-9]+):.*${key}[[:space:]]*[:=][[:space:]]*['\"]([^'\"]+)['\"].*$/\2\t\1/" \
    > "$TEMP_FILE"

    if [ ! -s "$TEMP_FILE" ]; then
        echo -e "${YELLOW}Geen resultaten voor $key.${NC}\n"
        return 0
    fi

    # 2. Analyseer
    awk -F'\t' -v mode="$mode" -v susp="$suspicious_regex" \
        -v red="$RED" -v green="$GREEN" -v yellow="$YELLOW" -v nc="$NC" '
    {
        val=$1; loc=$2;
        count[val]++;
        locs[val] = (locs[val] ? locs[val] ", " loc : loc);
    }
    END {
        distinct_count = 0;
        has_dupes = 0;
        has_suspicious = 0;
        
        printf "%-30s | %-5s | %s\n", "Waarde", "Aantal", "Locaties"
        print "--------------------------------------------------------------------------------"

        for (v in count) {
            distinct_count++;
            is_suspicious = 0;
            
            if (susp != "" && v ~ susp) {
                is_suspicious = 1;
                has_suspicious = 1;
            }

            color = green;
            prefix = "";
            
            if (mode == "duplicate" && count[v] > 1) { color = red; }
            if (mode == "consistency") { color = nc; }
            
            if (is_suspicious == 1) { 
                color = yellow; 
                prefix = "⚠️  ";
            }

            printf "%s%-30s%s | %s%-5d%s | %s\n", color, prefix v, nc, color, count[v], nc, locs[v]
        }

        if (mode == "consistency" && distinct_count > 1) print "FAIL_CONSISTENCY"
        if (mode == "duplicate" && has_dupes == 1) print "FAIL_DUPLICATE"
        if (has_suspicious == 1) print "WARN_SUSPICIOUS"
    }' "$TEMP_FILE" | tee /dev/tty > "$TEMP_FILE.out"

    if grep -q "FAIL_" "$TEMP_FILE.out"; then error_found=1; fi
    
    if grep -q "WARN_SUSPICIOUS" "$TEMP_FILE.out"; then
        echo -e "${YELLOW}⚠️  WAARSCHUWING: Er zijn verdachte waardes gevonden voor $key (zie geel).${NC}"
        echo -e "${YELLOW}    Dit zijn waarschijnlijk veldnamen die per ongeluk als ID worden gebruikt.${NC}"
    fi

    if [ $error_found -eq 1 ]; then
        if [ "$mode" == "consistency" ]; then
            echo -e "${RED}❌ FAIL: Inconsistentie gedetecteerd.${NC}\n"
        else
            echo -e "${RED}❌ FAIL: Duplicaten gedetecteerd.${NC}\n"
        fi
        return 1
    else
        echo -e "${GREEN}✅ PASS: Geen harde fouten.${NC}\n"
        return 0
    fi
}

# --- UITVOERING ---

EXIT_CODE=0

# 1. schemaVersion
analyze_key "schemaVersion" "consistency" || EXIT_CODE=1

# 2. pageId (Suspicious: begint met kleine letter)
analyze_key "pageId" "duplicate" "^[a-z]" || EXIT_CODE=1

# 3. fieldId (Suspicious: begint met Hoofdletter)
analyze_key "fieldId" "duplicate" "^[A-Z]" || EXIT_CODE=1

# 4. entityId
analyze_key "entityId" "duplicate" || EXIT_CODE=1

# 5. Legacy RTL Selector Check (Anti-deprecation gate)
echo -e "${BOLD}--- Analyse: Legacy RTL Selectors ---${NC}"
LEGACY_SELECTORS="getByA11yRole|getByA11yLabel|queryByA11yRole|queryByA11yLabel"
DEPRECATED_FOUND=$(rg -n "$LEGACY_SELECTORS" "$TARGET_DIR" || true)

if [ -n "$DEPRECATED_FOUND" ]; then
  echo -e "${RED}❌ FAIL: Legacy selectors gevonden:${NC}"
  echo "$DEPRECATED_FOUND" | awk -F: '{print "   - " $1 ":" $2 " -> " $3}'
  echo -e "${YELLOW}⚠️  Tip: Gebruik de nieuwe 'getByRole' of 'getByLabelText' syntax.${NC}\n"
  EXIT_CODE=1
else
  echo -e "${GREEN}✅ PASS: Geen legacy selectors gevonden.${NC}\n"
fi

# 6. Syntax Check: queryByRole state object
echo -e "${BOLD}--- Analyse: queryByRole Syntax ---${NC}"
# Zoekt naar queryByRole({ selected: true }) zonder rol-argument
# Gebruikt PCRE (-P) voor betere matching van haakjes en spaties
BAD_SYNTAX=$(rg -n -P "queryByRole\(\{\s*selected:\s*true\s*\}\)" "$TARGET_DIR" || true)

if [ -n "$BAD_SYNTAX" ]; then
  echo -e "${RED}❌ FAIL: Foutieve syntax gevonden:${NC}"
  echo "$BAD_SYNTAX" | awk -F: '{print "   - " $1 ":" $2 " -> " $3}'
  echo -e "${YELLOW}👉 Fix: Voeg een rol toe, bijv: queryByRole('button', { selected: true })${NC}\n"
  EXIT_CODE=1
else
  echo -e "${GREEN}✅ PASS: queryByRole syntax is correct.${NC}\n"
fi

# --- EINDRESULTAAT ---

if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}${BOLD}🎉 Audit compleet geslaagd. Geen conflicten gevonden.${NC}"
else
    echo -e "${RED}${BOLD}🔥 Audit gefaald. Los de bovenstaande fouten op.${NC}"
fi

exit $EXIT_CODE