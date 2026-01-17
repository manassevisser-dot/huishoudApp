
// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-expo',

  setupFiles: [
    '<rootDir>/jest.setup.early.js',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/src/test-utils/jest.setup.tsx',
  ],

  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    customExportConditions: ['react-native'],
  },

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@app/(.*)$': '<rootDir>/src/app/$1',

    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',

    '^@shared-types/(.*)$': '<rootDir>/src/domain/types/$1',

    // Kies hier de "primaire" utils map:
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    // Extra (optioneel) voor legacy submappen — alleen als je ze echt nodig hebt:
    '^@utils-legacy-helpers/(.*)$': '<rootDir>/src/domain/helpers/$1',
    '^@utils-legacy-validation/(.*)$': '<rootDir>/src/domain/validation/$1',

    '^@shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@logic/(.*)$': '<rootDir>/src/logic/$1',
    '^@ui/(.*)$': '<rootDir>/src/ui/$1',
    '^@components/(.*)$': '<rootDir>/src/ui/components/$1',
    '^@fields/(.*)$': '<rootDir>/src/ui/components/fields/$1',
    '^@screens/(.*)$': '<rootDir>/src/ui/screens/$1',
    '^@styles/(.*)$': '<rootDir>/src/ui/styles/$1',
    '^@state/(.*)$': '<rootDir>/src/state/$1',
    '^@context/(.*)$': '<rootDir>/src/app/context/$1',
    '^@selectors/(.*)$': '<rootDir>/src/selectors/$1',
    '^@assets/(.*)$': '<rootDir>/assets/$1',
    '^@test-utils$': '<rootDir>/src/test-utils/index.ts',
    '^@test-utils/(.*)$': '<rootDir>/src/test-utils/$1',
    '^@kernel/(.*)$': '<rootDir>/src/kernel/$1',

    // Single-file aliases
    '^@shared-types/form$': '<rootDir>/src/core/types/form.ts',
    '^@shared-types/finance$': '<rootDir>/src/core/types/finance.ts',
    '^@shared-types/fields$': '<rootDir>/src/core/types/form.ts',
    '^@shared-types/wizard$': '<rootDir>/src/core/types/wizard.ts',

    '^@domain/types/(.*)$': '<rootDir>/src/core/types/$1',
    '^@adapters/(.*)$': '<rootDir>/src/adapters/$1',
    '^@domain/rules/(.*)$': '<rootDir>/src/domain/rules/$1',
  },

  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|react-native(-.*)?|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg|expo-modules-core|expo-constants|expo-file-system|expo-asset))',
  ],

  clearMocks: true,
  restoreMocks: true,

  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['html', 'text', 'text-summary', 'json', 'json-summary'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!**/node_modules/**',
  ],

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
