#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}ℹ️  Start Volledige ADR & Architectuur Sanity Check...${NC}\n"

# A. Master Façade check
echo -n "A. Master Façade (geen directe engines): "
BAD_MASTER=$(grep -E "ImportOrchestrator|FinancialOrchestrator|RenderOrchestrator" src/app/orchestrators/MasterOrchestrator.ts | grep -vE "type|//")
if [ -z "$BAD_MASTER" ]; then echo -e "${GREEN}✅ OK${NC}"; else echo -e "${RED}❌ FOUT${NC}\n$BAD_MASTER"; fi

# B. UI-discipline
echo -n "B. UI-discipline (.render. alleen in UIManager): "
RENDER_LEAK=$(grep -rn "\.render\." src/app/orchestrators/ | grep -vE "__tests__|UIManager.ts|RenderOrchestrator.ts|IUIOrchestrator.ts|^\s*(//|\*|/\*)")
if [ -z "$RENDER_LEAK" ]; then echo -e "${GREEN}✅ OK${NC}"; else echo -e "${RED}❌ FOUT${NC}\n$RENDER_LEAK"; fi

# C. Legacy opschoning
echo -n "C. Geen legacy (visibilityRules/optionsMap): "
LEGACY=$(grep -rE "visibilityRules|optionsMap" src/ | grep -vE "__tests__|node_modules|^\s*(//|\*|/\*)")
if [ -z "$LEGACY" ]; then echo -e "${GREEN}✅ OK${NC}"; else echo -e "${RED}❌ FOUT${NC}\n$LEGACY"; fi

# D. ValueProvider restrictie
echo -n "D. ValueProvider via interfaces: "
VP_LEAK=$(grep -r "@domain/rules/ValueProvider" src/ | grep -vE "__tests__|interfaces/|^\s*(//|\*|/\*)")
if [ -z "$VP_LEAK" ]; then echo -e "${GREEN}✅ OK${NC}"; else echo -e "${RED}❌ FOUT${NC}\n$VP_LEAK"; fi

# E. Contract check
echo -n "E. Interface Contracts (implements): "
MISSING_CONTRACT=""
grep -q "implements IUIOrchestrator" src/app/orchestrators/UIManager.ts || MISSING_CONTRACT+="UIManager "
grep -q "implements IDataOrchestrator" src/app/orchestrators/DataManager.ts || MISSING_CONTRACT+="DataManager "
grep -q "implements IBusinessOrchestrator" src/app/orchestrators/BusinessManager.ts || MISSING_CONTRACT+="BusinessManager "
if [ -z "$MISSING_CONTRACT" ]; then echo -e "${GREEN}✅ OK${NC}"; else echo -e "${RED}❌ FOUT${NC} (Mist: $MISSING_CONTRACT)"; fi

# F. Isolatie checks
check_isolation() {
    local name=$1; local allowed=$2
    echo -n "F. Isolatie $name: "
    local violations=$(grep -rn "$name" src/app/orchestrators/ | grep -vE "__tests__|$allowed|$name.ts|I[A-Z].*Orchestrator.ts|^\s*(//|\*|/\*)" | grep -vE "import type")
    if [ -z "$violations" ]; then echo -e "${GREEN}✅ OK${NC}"; else echo -e "${RED}❌ FOUT${NC}\n$violations"; fi
}
check_isolation "ImportOrchestrator" "DataManager.ts"
check_isolation "FinancialOrchestrator" "BusinessManager.ts"
check_isolation "SectionOrchestrator" "UIManager.ts"

# G. Pipeline & No-Any check
echo -n "G. Geen 'as any' in Master: "
ANY_IN_MASTER=$(grep "as any" src/app/orchestrators/MasterOrchestrator.ts)
if [ -z "$ANY_IN_MASTER" ]; then echo -e "${GREEN}✅ OK${NC}"; else echo -e "${RED}❌ FOUT${NC}\n$ANY_IN_MASTER"; fi

echo -e "\n${BLUE}ℹ️  Check voltooid.${NC}"
