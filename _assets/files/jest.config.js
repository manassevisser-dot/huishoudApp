
/**
 * PHOENIX JEST CONFIG (Sanitized v1.0)
 * ADR-12 Audit-ready
 */
module.exports = {
  preset: 'react-native',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.js'],

  /* @aliases-start */
moduleNameMapper: {
  '^\@domain/(.*)$': '<rootDir>/src/domain/$1',
  '^\@state/(.*)$': '<rootDir>/src/state/$1',
  '^\@ui/(.*)$': '<rootDir>/src/ui/$1',
  '^\@styles/(.*)$': '<rootDir>/src/ui/styles/$1',
  '^\@app/(.*)$': '<rootDir>/src/app/$1',
  '^\@utils/(.*)$': '<rootDir>/src/utils/$1',
  '^\@services/(.*)$': '<rootDir>/src/services/$1',
  '^\@assets/(.*)$': '<rootDir>/assets/$1',
  '^\@logic/(.*)$': '<rootDir>/src/logic/$1',
  '^\@config/(.*)$': '<rootDir>/src/config/$1',
  '^\@context/(.*)$': '<rootDir>/src/app/context/$1',
  '^\@selectors/(.*)$': '<rootDir>/src/selectors/$1',
  '^\@shared-types/(.*)$': '<rootDir>/src/shared-types/$1',
  '^\@components/(.*)$': '<rootDir>/src/ui/components/$1',
},
/* @aliases-end */

  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|@react-native-community)',
  ],
};
