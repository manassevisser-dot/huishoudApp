/** @jest-config-loader ts-node */
/** @jest-config-loader-options {"transpileOnly": true} */
import type { Config } from 'jest';

const config: Config = {
  // We gebruiken de preset, maar overschrijven de rotzooi die het blokkeert
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
  modulePathIgnorePatterns: ['<rootDir>/backups/'],
  moduleNameMapper: {
// @alias-start
      '^@state/schemas/sections/(.*)$': '<rootDir>/src/state/schemas/sections/$1',
      '^@domain/validation/(.*)$': '<rootDir>/src/domain/validation/$1',
      '^@app/orchestrators/(.*)$': '<rootDir>/src/app/orchestrators/$1',
      '^@domain/constants/(.*)$': '<rootDir>/src/domain/constants/$1',
      '^@domain/registry/(.*)$': '<rootDir>/src/domain/registry/$1',
      '^@domain/services/(.*)$': '<rootDir>/src/domain/services/$1',
      '^@domain/research/(.*)$': '<rootDir>/src/domain/research/$1',
      '^@domain/helpers/(.*)$': '<rootDir>/src/domain/helpers/$1',
      '^@domain/finance/(.*)$': '<rootDir>/src/domain/finance/$1',
      '^@infrastructure/(.*)$': '<rootDir>/src/infrastructure/$1',
      '^@state/schemas/(.*)$': '<rootDir>/src/state/schemas/$1',
      '^@domain/rules/(.*)$': '<rootDir>/src/domain/rules/$1',
      '^@app/context/(.*)$': '<rootDir>/src/app/context/$1',
      '^@core/types/(.*)$': '<rootDir>/src/core/types/$1',
      '^@test-utils/(.*)$': '<rootDir>/src/test-utils/$1',
      '^@app/hooks/(.*)$': '<rootDir>/src/app/hooks/$1',
      '^@adapters/(.*)$': '<rootDir>/src/adapters/$1',
      '^@services/(.*)$': '<rootDir>/src/services/$1',
      '^@kernel/(.*)$': '<rootDir>/src/kernel/$1',
      '^@domain/(.*)$': '<rootDir>/src/domain/$1',
      '^@config/(.*)$': '<rootDir>/src/config/$1',
      '^@styles/(.*)$': '<rootDir>/src/domain/styles/$1',
      '^@utils/(.*)$': '<rootDir>/src/utils/$1',
      '^@state/(.*)$': '<rootDir>/src/state/$1',
      '^@core/(.*)$': '<rootDir>/src/core/$1',
      '^@app/(.*)$': '<rootDir>/src/app/$1',
      '^@ui/(.*)$': '<rootDir>/src/ui/$1',
// @alias-end
  },
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'index.ts',
    '\\.config\\.ts',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!(?:jest-)?react-native' +
      '|@react-native(-community)?' +
      '|expo(nent)?' +
      '|@expo(nent)?/.*' +
      '|react-native-gesture-handler' +
      '|react-native-reanimated' +
      '|react-native-worklets' +
      '|react-native-svg' +
      '|react-native-safe-area-context' +
      '|@unimodules/.*' +
      '|unimodules' +
      '|expo-modules-core' +
      '|expo-constants' +
      '|expo-file-system' +
      '|expo-asset' +
      '|@babel/runtime' +
      '|@react-native-async-storage/async-storage)/',
  ],
  

  fakeTimers: {
    enableGlobally: false, // false = opt-in per test via jest.useFakeTimers()
    // true zou timer-afhankelijke async tests globaal breken
  },

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