#!/bin/bash
set -u

# Kleuren
RED='\033[0;31m'
GREEN='\033[0;32m'
BOLD='\033[1m'
NC='\033[0m'

echo -e "${BOLD}🔍 Checking Test-Utils Architecture Hierarchy...${NC}"
FAIL=0

# Helper functie om verboden imports te vinden
check_forbidden() {
    local layer_name="$1"
    local path_to_check="$2"
    local forbidden_pattern="$3"
    local error_msg="$4"

    # Zoek naar imports die matchen met het verboden patroon
    # We zoeken naar: from '...forbidden...' OF from "...forbidden..."
    local matches
    matches=$(grep -rnE "from ['\"].*($forbidden_pattern)" "$path_to_check" 2>/dev/null)

    if [ -n "$matches" ]; then
        echo -e "${RED}❌ VIOLATION in $layer_name:${NC}"
        echo "   $error_msg"
        echo "   Gevonden in:"
        echo "$matches" | sed 's/^/      /'
        FAIL=1
    else
        echo -e "${GREEN}✅ $layer_name is clean.${NC}"
    fi
}

# --- CHECK 1: Level 0 (Utils/Fixtures) mag NIETS importeren uit hogere lagen ---
# Verboden: factories, render
check_forbidden "Level 0 (Utils/Fixtures)" \
    "src/test-utils/utils src/test-utils/fixtures" \
    "factories|render" \
    "Mag niet importeren uit 'factories' of 'render'."

# --- CHECK 2: Level 1 (Factories) mag NIET importeren uit Render ---
# Verboden: render
check_forbidden "Level 1 (Factories)" \
    "src/test-utils/factories" \
    "render" \
    "Mag niet importeren uit 'render' (Providers/Renderers)."

# --- CHECK 3: Level 2 (Providers) mag NIET importeren uit Renderers ---
# Verboden: renderers
check_forbidden "Level 2 (Providers)" \
    "src/test-utils/render/providers.tsx" \
    "renderers" \
    "Providers mogen 'renderers' niet importeren (Cirkel risico!)."

# --- CONCLUSIE ---
echo ""
if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}${BOLD}🎉 Architectuur is valide! De hiërarchie wordt gerespecteerd.${NC}"
    exit 0
else
    echo -e "${RED}${BOLD}🔥 Architectuur fouten gevonden. Los de imports hierboven op.${NC}"
    exit 1
fi