
// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-expo',

  // Setup files
  setupFiles: [
    '<rootDir>/jest.setup.early.js',
  ],
  setupFilesAfterEnv: [
    // Je gebruikt hier .tsx en dat kan; Jest laadt dit als setupmodule
    '<rootDir>/src/test-utils/jest.setup.tsx',
  ],

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

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

  // RN/Expo transform-ignore
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|expo-modules-core|expo-constants|expo-file-system|expo-asset)',
  ],

  // Mocks lifecycle
  clearMocks: true,
  restoreMocks: true,

  // ✅ Coverage (overzicht van waardes: statements/branches/functions/lines)
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['html', 'text', 'text-summary'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!**/node_modules/**',
  ],
  // Optioneel: drempel (zet desnoods lager/hoger)
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
