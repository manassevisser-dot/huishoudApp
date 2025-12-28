#!/bin/bash
set -e

echo "🔧 Jest Transform Patterns repareren (Expo Modules support)..."

cat > jest.config.js << 'EOF'
/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  
  setupFiles: [
    "<rootDir>/jest.setup.early.js" 
  ],
  setupFilesAfterEnv: [
    "<rootDir>/jest.setup.js"
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
    '^@components/(.*)$': '<rootDir>/src/ui/components/$1',
    '^@styles/(.*)$': '<rootDir>/src/ui/styles/$1',
    '^@state/(.*)$': '<rootDir>/src/state/$1',
    '^@context/(.*)$': '<rootDir>/src/app/context/$1',
    '^@selectors/(.*)$': '<rootDir>/src/selectors/$1',
    '^@assets/(.*)$': '<rootDir>/assets/$1'
  },

  // DE CRUCIALE FIX:
  // We moeten expo-modules-core expliciet toelaten tot transformatie.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|expo-modules-core|expo-constants|expo-file-system|expo-asset)'
  ],

  clearMocks: true,
  restoreMocks: true,
};
EOF

echo "✅ Jest Transform Patterns bijgewerkt."
echo "👉 Draai nu: npm test -- --clearCache && npm test"