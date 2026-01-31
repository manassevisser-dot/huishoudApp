#!/bin/bash

# Verplichte bestanden
required=(
  "src/domain/rules/FieldPathResolver.ts"
  "src/domain/rules/visibilityRules.ts"
  "src/domain/rules/evaluateDomainRules.ts"
  "src/app/orchestrators/FormStateValueProvider.ts"
  "src/app/orchestrators/FormStateOrchestrator.ts"
  "src/ui/screens/Wizard/WizardPage.tsx"
  "src/ui/components/FieldRenderer.tsx"
  "src/ui/screens/Wizard/pages/1setupHousehold.config.ts"
  "src/ui/screens/Wizard/pages/4fixedExpenses.config.ts"
)

# Optioneel: kies ÓF interface ÓF implementatie
optional_interface="src/domain/interfaces/ValueProvider.ts"
optional_impl="src/domain/rules/ValueProvider.ts"

missing=0

# Controleer verplichte bestanden
for p in "${required[@]}"; do
  if [ -e "$p" ]; then
    printf "✅ %s\n" "$p"
  else
    printf "❌ %s (missing)\n" "$p"
    ((missing++))
  fi
done

# Controleer ValueProvider: minstens één moet bestaan
if [ -e "$optional_interface" ]; then
  printf "✅ %s (interface found)\n" "$optional_interface"
elif [ -e "$optional_impl" ]; then
  printf "✅ %s (implementation found)\n" "$optional_impl"
else
  printf "❌ Neither %s nor %s exists\n" "$optional_interface" "$optional_impl"
  ((missing++))
fi

exit $missing