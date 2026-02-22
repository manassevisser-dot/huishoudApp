#!/bin/bash
set -e

echo "🔧 Start Robuuste Import Fix (V2)..."

# ==============================================================================
# 1. TEST UTILS BARREL FILE
# ==============================================================================
echo "   • Genereren src/test-utils/index.ts..."
mkdir -p src/test-utils

cat > src/test-utils/index.ts << 'EOF'
// Central Test Utils Barrel
export * from './render/renderers';
export * from './state';
export * from './fixtures';
export * from './mocks';
EOF

# ==============================================================================
# 2. CONFIGURATIE UPDATES (Hard Overwrite voor veiligheid)
# ==============================================================================
echo "   • tsconfig.json herstellen (Clean JSON)..."

# We schrijven een schone tsconfig zonder comments om parse-errors te voorkomen
cat > tsconfig.json << 'EOF'
{
  "extends": "@react-native/typescript-config/tsconfig.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@app/*": ["src/app/*"],
      "@domain/*": ["src/domain/*"],
      "@services/*": ["src/services/*"],
      "@shared-types/*": ["src/shared-types/*"],
      "@utils/*": ["src/utils/*"],
      "@config/*": ["src/config/*"],
      "@logic/*": ["src/logic/*"],
      "@ui/*": ["src/ui/*"],
      "@sections/*": ["src/ui/sections/*"],
      "@fields/*": ["src/ui/sections/fields/*"],
      "@screens/*": ["src/ui/screens/*"],
      "@styles/*": ["src/ui/styles/*"],
      "@state/*": ["src/state/*"],
      "@context/*": ["src/app/context/*"],
      "@selectors/*": ["src/selectors/*"],
      "@assets/*": ["assets/*"],
      "@test-utils": ["src/test-utils/index.ts"],
      "@test-utils/*": ["src/test-utils/*"]
    }
  }
}
EOF

echo "   • jest.config.ts bijwerken..."
# Update jest.config.ts met sed (dit bestand is JS/TS, dus geen JSON parse issues)
# We voegen de mapping toe als hij er nog niet in staat
if ! grep -q "'^@test-utils$':" jest.config.ts; then
    sed -i "/moduleNameMapper: {/a \    '^@test-utils$': '<rootDir>/src/test-utils/index.ts'," jest.config.ts
fi

# ==============================================================================
# 3. DOMAIN CONSTANTS FIX
# ==============================================================================
echo "   • Domain Constants check..."
mkdir -p src/domain/constants
if [ ! -f "src/domain/constants/datakeys.ts" ]; then
cat > src/domain/constants/datakeys.ts << 'EOF'
export const DATA_KEYS = {
  HOUSEHOLD: 'household',
  FINANCE: 'finance',
  SETUP: 'setup',
};
export const SUB_KEYS = {
  MEMBERS: 'members',
  INCOME: 'income',
  EXPENSES: 'expenses',
};
EOF
fi

# ==============================================================================
# 4. BULK IMPORT REPLACEMENTS
# ==============================================================================
echo "   • Imports herschrijven naar @test-utils..."

# Vervang diepe imports naar de barrel alias
grep -rl "@test-utils/render" src | xargs sed -i "s|@test-utils/render/renderers|@test-utils|g" 2>/dev/null || true
grep -rl "@test-utils/render" src | xargs sed -i "s|@test-utils/render|@test-utils|g" 2>/dev/null || true
grep -rl "@test-utils/state" src | xargs sed -i "s|@test-utils/state|@test-utils|g" 2>/dev/null || true
grep -rl "@test-utils/fixtures" src | xargs sed -i "s|@test-utils/fixtures|@test-utils|g" 2>/dev/null || true
grep -rl "\.\./\.\./test-utils/fixtures" src | xargs sed -i "s|\.\./\.\./test-utils/fixtures|@test-utils|g" 2>/dev/null || true

# ==============================================================================
# 5. SPECIFIEKE FILE FIXES
# ==============================================================================
echo "   • Specifieke bestanden repareren..."

# A. WizardController.test.tsx
TARGET="src/ui/screens/Wizard/__tests__/WizardController.test.tsx"
if [ -f "$TARGET" ]; then
    sed -i "/import.*makePhoenixState/d" "$TARGET"
    sed -i "1i import { makePhoenixState } from '@test-utils';" "$TARGET"
fi

# B. migration.members.test.ts
TARGET="src/services/__tests__/migration.members.test.ts"
if [ -f "$TARGET" ]; then
    sed -i "s/collectFinancialAndMemberData/collectAndDistributeData/g" "$TARGET"
fi

# C. householdSelectors.test.ts
TARGET="src/selectors/__tests__/householdSelectors.test.ts"
if [ -f "$TARGET" ]; then
    sed -i "s|../../domain/constants/registry|@domain/constants/datakeys|g" "$TARGET"
    sed -i "s|@constants/registry|@domain/constants/datakeys|g" "$TARGET"
fi

# D. useAppOrchestration.ts
TARGET="src/app/hooks/useAppOrchestration.ts"
if [ -f "$TARGET" ]; then
    sed -i "s|@constants/registry|@domain/constants/datakeys|g" "$TARGET"
    sed -i "s|../../services/storage|@services/storage|g" "$TARGET"
fi

echo "✅ Klaar! Draai nu 'npx tsc --noEmit' om te controleren."