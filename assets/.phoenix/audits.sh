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
    check_refactor_integrity "Refactor Integration"
fi
}   