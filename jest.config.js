module.exports = {
  preset: 'react-native', // Gebruik de basis RN preset ipv Expo om 'Winter' te omzeilen
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@state/(.*)$': '<rootDir>/src/state/$1',
    '^@ui/(.*)$': '<rootDir>/src/ui/$1',
    '^@app/(.*)$': '<rootDir>/src/app/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@assets/(.*)$': '<rootDir>/assets/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|@react-navigation)/)',
  ],
};
