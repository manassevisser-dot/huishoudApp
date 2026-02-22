#!/usr/bin/env bash
set -euo pipefail

# 1) Income/Expenses mapping sanity: zoek een steekproef
required=(grossMonthly inkomstenPerLid autoVerzekering car_repeater)
for k in "${required[@]}"; do 
    grep -R "${k}" src/adapters/valueProviders/FormStateValueProvider.ts >/dev/null || { 
        echo "Missing mapping for ${k}"; exit 2; 
    }; 
done

# 2) Geen boundary-schema miss spams in logs
if grep -R "BOUNDARY_NO_SCHEMA" logs/* 2>/dev/null | grep -v "^$"; then 
    echo 'Boundary schema miss detected'; exit 3; 
fi

echo 'AUDIT F PASS'
