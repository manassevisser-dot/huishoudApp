#!/bin/bash
set -e

echo "🔧 Laatste consistentie-fixes uitvoeren..."

# 1. Fix Registry (Cruciaal voor configs)
mkdir -p src/domain/constants
cat > src/domain/constants/registry.ts << 'EOF'
// src/domain/constants/registry.ts
// Single Source of Truth voor ID's en Keys

export const DATA_KEYS = {
  HOUSEHOLD: 'household',
  FINANCE: 'finance',
  SETUP: 'setup',
};

export const UX_TOKENS = {
  WIZARD: 'WIZARD',
  LANDING: 'LANDING',
  DASHBOARD: 'DASHBOARD',
};

// Types voor consistentie
export type PageToken = keyof typeof UX_TOKENS;
export type FieldToken = string;
EOF

# 2. Fix TransactionService Export
# Zorg dat het object TransactionService ook echt geëxporteerd wordt
if grep -q "export const TransactionService" src/services/transactionService.ts; then
    echo "✅ TransactionService export bestaat al."
else
    echo "   • TransactionService export toevoegen..."
    cat >> src/services/transactionService.ts << 'EOF'

export const TransactionService = {
  migrate: migrateTransactionsToPhoenix,
  undo: undoLastTransaction,
};
EOF
fi

# 3. Fix Test Utils Render Alias
# Zorg dat renderWithState beschikbaar is voor legacy tests
if ! grep -q "export const renderWithState" src/test-utils/render/renderers.tsx; then
    echo "   • renderWithState alias toevoegen..."
    echo "export const renderWithState = renderWithProviders;" >> src/test-utils/render/renderers.tsx
fi

# 4. Fix Imports in Configs (Registry)
# Zorg dat configs naar de juiste registry wijzen
grep -rl "@domain/constants/datakeys" src/ui/screens/Wizard/pages | xargs sed -i "s|@domain/constants/datakeys|@domain/constants/registry|g" 2>/dev/null || true

echo "✅ Consistentie hersteld."
echo "👉 Draai nu: npx tsc --noEmit"