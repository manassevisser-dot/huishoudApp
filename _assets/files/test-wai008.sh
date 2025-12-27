#!/bin/bash

# Simuleer de Phoenix omgeving
PASSED_COUNT=0
TOTAL_COUNT=0

atomic_inc() {
    if [ "$1" == "passed" ]; then ((PASSED_COUNT++)); fi
    if [ "$1" == "total" ]; then ((TOTAL_COUNT++)); fi
}

echo "=== DIAGNOSTISCHE TEST WAI-008 ==="

# De test-logica
{
    atomic_inc total
    
    # Jouw handmatige verificatie-logica
    T_FILE="src/ui/styles/Tokens.ts"
    O_FILE="src/ui/styles/useAppStyles.ts"
    M_COUNT=$(ls src/ui/styles/modules/*.ts 2>/dev/null | wc -l)

    if [ -f "$T_FILE" ] && \
       grep -q "export const Space" "$T_FILE" && \
       [ -f "$O_FILE" ] && \
       [ "$M_COUNT" -gt 0 ]; then
       
        echo -e "✅ TEST GESLAAGD: Bestanden en inhoud gevonden."
        atomic_inc passed
        EXIT_CODE=0
    else
        echo -e "❌ TEST GEFAALD: Structuur niet compleet."
        EXIT_CODE=1
    fi
}

echo "--------------------------------"
echo "Resultaat doorgegeven: $EXIT_CODE"
echo "Passed teller: $PASSED_COUNT / $TOTAL_COUNT"

if [ "$PASSED_COUNT" -eq 1 ]; then
    echo -e "\n🚩 VLAG: GROEN (De logica werkt, het probleem zit in de Phoenix-engine)"
else
    echo -e "\n🚩 VLAG: ROOD (De logica zelf komt niet op 1)"
fi

exit $EXIT_CODE