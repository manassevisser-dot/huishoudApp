#!/bin/bash

# 1. Fix App.tsx imports naar de Wizard submap
sed -i "s|'@ui/screens/SplashScreen'|'@ui/screens/Wizard/SplashScreen'|g" src/App.tsx
sed -i "s|'@ui/screens/WelcomeWizard'|'@ui/screens/Wizard/WelcomeWizard'|g" src/App.tsx

# 2. Fix MainNavigator imports (als ze daar ook fout staan)
# We gaan ervan uit dat de Wizard-schermen nu in hun eigen map staan
sed -i "s|'@ui/screens/SplashScreen'|'@ui/screens/Wizard/SplashScreen'|g" src/ui/navigation/MainNavigator.tsx
sed -i "s|'@ui/screens/WelcomeWizard'|'@ui/screens/Wizard/WelcomeWizard'|g" src/ui/navigation/MainNavigator.tsx

# 3. Fix de Logger import mismatch in de hele src map
# Verandert 'import { logger }' naar 'import logger' voor default exports
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i "s/import { logger } from '@services\/logger'/import logger from '@services\/logger'/g"

echo "✅ Phoenix Path Realigner voltooid. Laten we de schade opnemen..."