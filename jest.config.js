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
    'node_modules/(?!(react-native|@react-native|expo|expo-.*|@expo|expo-modules-core|react-navigation|@react-navigation|@react-native-community|@testing-library)/)',
  ],

  clearMocks: true,
  restoreMocks: true,

  collectCoverage: true, // Zet coverage standaard aan
  coverageDirectory: "<rootDir>/coverage",
  coverageReporters: ["html", "text", "text-summary"], // HTML voor de browser, text voor de terminal
  
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/**/__tests__/**",
    "!src/types/**",
    "!**/node_modules/**",
  ],

  // Optioneel: zet drempels (thresholds) zodat je tests falen als de dekking zakt
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },

};
