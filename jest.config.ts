// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-expo',

  // 1. Setup Files (Volgorde is cruciaal voor de 'Nuclear De-Winterizer')
  setupFiles: [
    '<rootDir>/jest.setup.early.js', // Eerst de core mocks & winter-fix
  ],
  setupFilesAfterEnv: [
    '<rootDir>/src/test-utils/jest.setup.tsx', // Dan de matchers en UI-specifieke mocks
  ],

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

  // 2. Module Mapping (Aliassen voor schone imports)
  moduleNameMapper: {
  // @alias-start
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
    '^@assets/(.*)$': '<rootDir>/assets/$1',
    '^@test-utils$': '<rootDir>/src/test-utils/index.ts',
    '^@test-utils/(.*)$': '<rootDir>/src/test-utils/$1',
    '^@shared-types/forms$': '<rootDir>/src/shared-types/forms.ts',
  // @alias-end
  },

  // 3. RN/Expo transform-ignore (Voorkomt SyntaxErrors in node_modules)
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|expo-modules-core|expo-constants|expo-file-system|expo-asset)',
  ],

  // 4. Mocks lifecycle (Houdt tests zuiver)
  clearMocks: true,
  restoreMocks: true,

  // 5. Coverage (Kwaliteitscontrole)
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['html', 'text', 'text-summary', 'json', 'json-summary'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!**/node_modules/**',
  ],
  
  // Drempels om de 'Core Sanity' te bewaken
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};

export default config;