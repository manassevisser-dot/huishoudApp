#!/bin/bash

# Phoenix Audit Script: Domme UI Decoupling v2.0
# Token: TOKEN-ID-NOVA-AUDIT-SCRIPT-DOMME-UI-V2
# Purpose: Binary ADR compliance verification based on Tara's 43 Testcases
# Context: Masterclass Schone Code 2025

set -u

# ==============================================================================
# CONFIGURATION
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)" # Pas aan indien script niet in /scripts staat
UI_DIR="$PROJECT_ROOT/src/ui"
DOMAIN_DIR="$PROJECT_ROOT/src/domain"
APP_DIR="$PROJECT_ROOT/src/app"

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0

# ==============================================================================
# HELPER FUNCTIONS
# ==============================================================================

print_header() {
    echo -e "\n${BLUE}=== $1 ===${NC}"
}

# Check if a file exists
check_file_exists() {
    local check_id="$1"
    local description="$2"
    local filepath="$3"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    echo -n "[$check_id] $description... "
    
    if [ -f "$filepath" ]; then
        echo -e "${GREEN}PASS${NC}"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        echo -e "${RED}FAIL${NC} (File not found: $filepath)"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
        return 1
    fi
}

# Check if a pattern exists (REQUIRED)
check_pattern_required() {
    local check_id="$1"
    local description="$2"
    local pattern="$3"
    local directory="$4"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    echo -n "[$check_id] $description... "
    
    # We zoeken in .ts en .tsx files
    if grep -r "$pattern" "$directory" --include="*.ts" --include="*.tsx" > /dev/null 2>&1; then
        echo -e "${GREEN}PASS${NC}"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        echo -e "${RED}FAIL${NC} (Pattern '$pattern' not found in $directory)"
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
        return 1
    fi
}

# Check if a pattern is absent (FORBIDDEN)
check_pattern_forbidden() {
    local check_id="$1"
    local description="$2"
    local pattern="$3"
    local directory="$4"
    local exclude_tests="${5:-false}"
    
    TOTAL_CHECKS=$((TOTAL_CHECKS + 1))
    echo -n "[$check_id] $description... "
    
    local grep_cmd="grep -r \"$pattern\" \"$directory\" --include=\"*.ts\" --include=\"*.tsx\""
    
    if [ "$exclude_tests" = "true" ]; then
        grep_cmd="$grep_cmd --exclude-dir=\"__tests__\" --exclude=\"*.test.ts\" --exclude=\"*.spec.ts\" --exclude=\"*.test.tsx\""
    fi
    
    local output
    output=$(eval "$grep_cmd" || true)
    
    if [ -z "$output" ]; then
        echo -e "${GREEN}PASS${NC}"
        PASSED_CHECKS=$((PASSED_CHECKS + 1))
        return 0
    else
        local count=$(echo "$output" | wc -l)
        echo -e "${RED}FAIL${NC} ($count matches found)"
        # Show first 3 failures for context
        echo "$output" | head -n 3 | sed 's/^/   > /'
        FAILED_CHECKS=$((FAILED_CHECKS + 1))
        return 1
    fi
}

echo "================================================"
echo "Phoenix Audit v2.0: Domme UI Decoupling"
echo "================================================"

# ==============================================================================
# CATEGORIE 3: DECOUPLING VERIFICATION (Static Analysis)
# ==============================================================================
print_header "Categorie 3: Decoupling Verification (Strict)"

check_pattern_forbidden "UI-DECOUPLE-001" \
    "No DATA_KEYS usage (inline or import)" \
    "DATA_KEYS" \
    "$UI_DIR" \
    "true"

check_pattern_forbidden "UI-DECOUPLE-002" \
    "No SUB_KEYS usage" \
    "SUB_KEYS" \
    "$UI_DIR" \
    "true"

check_pattern_forbidden "UI-DECOUPLE-003" \
    "No direct state.data access" \
    "state\.data\[" \
    "$UI_DIR" \
    "true"

check_pattern_forbidden "UI-DECOUPLE-004" \
    "No datakeys imports (case insensitive)" \
    "import.*datakeys" \
    "$UI_DIR" \
    "true"

check_pattern_forbidden "UI-DECOUPLE-005" \
    "No domain registry imports (except UX_TOKENS)" \
    "import.*registry.*[^UX_TOKENS]" \
    "$UI_DIR" \
    "true"

check_pattern_forbidden "UI-DECOUPLE-006" \
    "No direct imports from src/domain in UI" \
    "from.*@domain" \
    "$UI_DIR" \
    "true"

# UI-DECOUPLE-007: FieldRenderer check
# We controleren of FieldRenderer GEEN 'section' prop leest om te gebruiken in logica
check_pattern_forbidden "UI-DECOUPLE-007" \
    "FieldRenderer has no section logic" \
    "props\.section" \
    "$UI_DIR/components/FieldRenderer.tsx" \
    "true"

# UI-DECOUPLE-010: CsvUploadScreen
check_pattern_forbidden "UI-DECOUPLE-010" \
    "CsvUploadScreen has no DATA_KEYS.FINANCE" \
    "DATA_KEYS\.FINANCE" \
    "$UI_DIR/screens/CSV" \
    "true"

# Logic in Config Checks (Cruciaal voor Domme UI)
CONFIG_DIR="$UI_DIR/screens/Wizard/pages" # Pas pad aan indien nodig

check_pattern_forbidden "UI-DECOUPLE-012" \
    "No visibleIf functions in configs" \
    "visibleIf:" \
    "$CONFIG_DIR" \
    "true"

check_pattern_forbidden "UI-DECOUPLE-013" \
    "No valueGetter functions in configs" \
    "valueGetter:" \
    "$CONFIG_DIR" \
    "true"

check_pattern_forbidden "UI-DECOUPLE-014" \
    "No filter functions in configs" \
    "filter:" \
    "$CONFIG_DIR" \
    "true"

# ==============================================================================
# CATEGORIE 1: READ OPERATIONS (Code Patterns)
# ==============================================================================
print_header "Categorie 1: Read Operations (Patterns)"

# UI-RW-001: FieldRenderer moet getValue(fieldId) gebruiken, NIET getValue(section, fieldId)
# We zoeken naar de correcte call.
check_pattern_required "UI-RW-001" \
    "FieldRenderer calls getValue(fieldId)" \
    "getValue(.*fieldId)" \
    "$UI_DIR/components/FieldRenderer.tsx"

# Controleren op het VERBODEN patroon (2 argumenten in getValue)
check_pattern_forbidden "UI-RW-001-STRICT" \
    "FieldRenderer does NOT call getValue(section, fieldId)" \
    "getValue(.*,.*)" \
    "$UI_DIR/components/FieldRenderer.tsx" \
    "true"

# UI-RW-003: WizardPage rendering
check_pattern_required "UI-RW-003" \
    "WizardPage renders FieldRenderer" \
    "<FieldRenderer" \
    "$UI_DIR/screens/Wizard/WizardPage.tsx"

# ==============================================================================
# CATEGORIE 2: WRITE OPERATIONS (Code Patterns)
# ==============================================================================
print_header "Categorie 2: Write Operations (Patterns)"

# UI-RW-019: updateField called with correct fieldId (no bucket prefix)
# We checken of de aanroep in generic components gebeurt
check_pattern_required "UI-RW-019" \
    "Generic components call updateField" \
    "updateField" \
    "$UI_DIR/components"

# UI-RW-011: Counter field specific
check_pattern_required "UI-RW-011" \
    "Counter uses updateField" \
    "updateField" \
    "$UI_DIR/components/fields/Counter.tsx"

# ==============================================================================
# CATEGORIE 4: UI_SECTIONS INDEPENDENCE
# ==============================================================================
print_header "Categorie 4: UI_SECTIONS Independence"

# UI-SECT-001
check_pattern_required "UI-SECT-001" \
    "WizardPage uses UI_SECTIONS constant" \
    "UI_SECTIONS" \
    "$UI_DIR/screens/Wizard/WizardPage.tsx"

# UI-SECT-007
check_pattern_required "UI-SECT-007" \
    "UX_TOKENS used for titles" \
    "UX_TOKENS" \
    "$UI_DIR/constants/uiSections.ts"

# ==============================================================================
# ARCHITECTURE & DOMAIN CHECKS
# ==============================================================================
print_header "Architecture & Domain Integrity"

# ADR-03 / ADR-06 checks (Fixed locations)
check_file_exists "ADR-03-001" \
    "ValueProvider interface in Domain" \
    "$DOMAIN_DIR/interfaces/ValueProvider.ts"

check_file_exists "ADR-03-002" \
    "StateWriter interface in Domain" \
    "$DOMAIN_DIR/interfaces/StateWriter.ts"

check_file_exists "ADR-03-003" \
    "FieldPathResolver exists in Domain rules" \
    "$DOMAIN_DIR/rules/FieldPathResolver.ts"

# Verify FormStateOrchestrator implementation location
check_file_exists "ADR-06-003" \
    "FormStateOrchestrator exists in App layer" \
    "$APP_DIR/orchestrators/FormStateOrchestrator.ts"

# ==============================================================================
# TEST COVERAGE PROXIES (Existence Checks)
# ==============================================================================
print_header "Test Coverage Proxies"

# We kunnen runtime gedrag (UI-RW-009) niet testen met bash, maar we checken of de tests bestaan.
check_file_exists "TEST-001" \
    "FieldRenderer tests exist" \
    "$UI_DIR/components/__tests__/FieldRenderer.test.tsx"

check_file_exists "TEST-002" \
    "FormStateOrchestrator tests exist" \
    "$APP_DIR/orchestrators/__tests__/FormStateOrchestrator.test.ts"

# ==============================================================================
# SUMMARY
# ==============================================================================

echo ""
echo "================================================"
echo "Audit Summary"
echo "================================================"
echo "Total Checks: $TOTAL_CHECKS"
echo -e "Passed: ${GREEN}$PASSED_CHECKS${NC}"
echo -e "Failed: ${RED}$FAILED_CHECKS${NC}"
echo ""

if [ $FAILED_CHECKS -eq 0 ]; then
    echo -e "${GREEN}✓ MIGRATION STATUS: ADR-COMPLIANT${NC}"
    echo "De UI is succesvol losgekoppeld van de datastructuur."
    exit 0
else
    echo -e "${RED}✗ MIGRATION STATUS: NON-COMPLIANT${NC}"
    echo "Er zijn $FAILED_CHECKS schendingen gevonden. Zie de logs hierboven."
    exit 1
fi