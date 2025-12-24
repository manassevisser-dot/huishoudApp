#!/bin/bash
# .phoenix/audits.sh - Technische Audit Definities

run_all_audits() {
    log_section "PHOENIX TECHNICAL AUDITS"

    # --- 1. CORE & INTEGRITY ---
    # Controleert of de basis bestanden aanwezig zijn
    check_file_exists "package.json" "Node.js Manifest"
    check_file_exists "tsconfig.json" "TypeScript Configuration"

    # --- 2. ARCHITECTUUR (WAI-001 t/m WAI-003) ---
    # Gebruik van 'as const' voor Single Source of Truth
    check_pattern "as const" "src" "Type-safety (SSOT)" "1" "" "ssot"

    # --- 3. DATA & PARSING (WAI-004) ---
    # Centraal nummer-parsing beleid
    check_pattern "Math\.max\(0," "src" "Non-negative parser" "1" "" "legacy_parsing"
    check_pattern "\.toFixed\(2\)" "src" "Currency formatting" "1" "" "legacy_parsing"

    # --- 4. IMPORT BELEID (WAI-006) ---
    # Voorkomen van diepe imports (moet via aliases)
    check_antipattern "../../../" "src" "Deep Imports" "" "deep_imports"

    # --- 5. CODE HYGIËNE ---
    # Verwijderen van debug logs in productie code
    # We sluiten test-bestanden en dev-tools uit van deze check
    check_antipattern "console\.(log|debug)" "src" "Console Statements" "(\.test\.|dev-tools)" "console_statements"

    # --- 6. STATE MANAGEMENT ---
    # Controleert op de aanwezigheid van reducer acties
    check_pattern "SET_|TOGGLE_|UPDATE_|RESET_" "src" "Declarative Actions" "1" "" "reducer_actions"
}