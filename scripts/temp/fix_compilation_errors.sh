#!/bin/bash
set -e

echo "🔧 Compilatie & Configuratie Fouten Herstellen..."

# 1. Fix Bestandsextensies (TS vs TSX)
# renderers.ts bevat JSX -> hernoemen naar .tsx
if [ -f "src/test-utils/render/renderers.ts" ]; then
    mv src/test-utils/render/renderers.ts src/test-utils/render/renderers.tsx
    echo "✅ Renamed renderers.ts -> .tsx"
fi

# jest.setup.js bevat types -> hernoemen naar .tsx
if [ -f "src/test-utils/jest.setup.js" ]; then
    mv src/test-utils/jest.setup.js src/test-utils/jest.setup.tsx
    echo "✅ Renamed jest.setup.js -> .tsx"
fi

# 2. Fix jest.config.ts (De variabele 'config' ontbrak)
cat > jest.config.ts << 'EOF'
import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-expo',
  
  // Verwijzing naar de setup files (let op de nieuwe extensie .tsx)
  setupFiles: [
    "<rootDir>/src/test-utils/jest.setup.early.js" 
  ],
  setupFilesAfterEnv: [
    "<rootDir>/src/test-utils/jest.setup.tsx"
  ],

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@shared-types/(.*)$': '<rootDir>/src/shared-types/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@logic/(.*)$': '<rootDir>/src/logic/$1',
    '^@ui/(.*)$': '<rootDir>/src/ui/$1',
    '^@sections/(.*)$': '<rootDir>/src/ui/sections/$1',
    '^@styles/(.*)$': '<rootDir>/src/ui/styles/$1',
    '^@state/(.*)$': '<rootDir>/src/state/$1',
    '^@context/(.*)$': '<rootDir>/src/app/context/$1',
    '^@selectors/(.*)$': '<rootDir>/src/selectors/$1',
    '^@assets/(.*)$': '<rootDir>/assets/$1',
    '^@test-utils/(.*)$': '<rootDir>/src/test-utils/$1'
  },

  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|expo-modules-core|expo-constants|expo-file-system|expo-asset)'
  ],

  clearMocks: true,
  restoreMocks: true,
};

export default config;
EOF
echo "✅ jest.config.ts gerepareerd."

# 3. Fix Phoenix Permissions
if [ -f "phoenix" ]; then
    chmod +x phoenix
    echo "✅ Permissions fixed for 'phoenix'."
fi

echo "👉 Draai nu: npx tsc --noEmit && npm test"