#!/bin/bash
set -e

echo "🔧 Alias Config & TSConfig corrigeren..."

# 1. Pas config.js aan: Verwijder '@test' uit reservedPrefixes
# Zodat @test-utils gewoon mag worden gesynced.
cat > scripts/sync-aliases/config.js << 'EOF'
const path = require('path');
const ROOT = process.cwd();

const TAG = "@alias-start"; 
const END_TAG = "@alias-end";

const markers = {
  babel:    { start: `// ${TAG}`, end: `// ${END_TAG}` },
  jest:     { start: `// ${TAG}`, end: `// ${END_TAG}` },
  jsconfig: { start: `// ${TAG}`, end: `// ${END_TAG}` },
};

module.exports = {
  paths: {
    root: ROOT,
    tsconfig: path.join(ROOT, 'tsconfig.json'),
    jsconfig: path.join(ROOT, 'jsconfig.json'),
    babel: path.join(ROOT, 'babel.config.js'),
    jest: path.join(ROOT, 'jest.config.js'),
  },
  markers,
  // LET OP: '@test' is hier verwijderd zodat @test-utils werkt!
  reservedPrefixes: ['@types', '@react', '@expo', '@jest', '@babel', '@node', '@native', '@testing-library'],

  flags: {
    dryRun: process.argv.includes('--dry-run'),
    verbose: process.argv.includes('--verbose'),
    backup: process.argv.includes('--backup'),
    restore: process.argv.includes('--restore'),
    help: process.argv.includes('--help'),
  }
};
EOF

# 2. Update tsconfig.json met ALLE paths (SSOT)
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
      "@components/*": ["src/ui/components/*"],
      "@fields/*": ["src/ui/components/fields/*"],
      "@screens/*": ["src/ui/screens/*"],
      "@styles/*": ["src/ui/styles/*"],
      "@state/*": ["src/state/*"],
      "@context/*": ["src/app/context/*"],
      "@selectors/*": ["src/selectors/*"],
      "@assets/*": ["assets/*"],
      "@test-utils/*": ["src/test-utils/*"]
    }
  }
}
EOF

echo "✅ Configs bijgewerkt."
echo "🔄 Sync draaien..."

# 3. Draai de sync
scripts/maintenance/sync-aliases.sh