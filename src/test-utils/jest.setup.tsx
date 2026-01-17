// src/test-utils/jest.setup.tsx
import '@testing-library/jest-native/extend-expect';

/**
 * React Act Environment configuratie
 * Dit helpt bij het onderdrukken van onnodige act() waarschuwingen in React 18+ omgevingen
 */
// @ts-ignore
global.IS_REACT_ACT_ENVIRONMENT = true;

/**
 * Console Error Filter
 * Verbergt bekende ruis zoals act() waarschuwingen en DOM nesting fouten
 */
const originalError = console.error;
console.error = (...args) => {
  if (/validateDOMNesting|not wrapped in act/.test(args[0])) {
    return;
  }
  originalError.call(console, ...args);
};

// =========================================================
// Mocks
// =========================================================

// Reanimated mock (indien gebruikt)
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// SafeArea mock (zeer belangrijk voor UI tests)
jest.mock('react-native-safe-area-context', () => {
  return {
    SafeAreaProvider: ({ children }: any) => children,
    SafeAreaView: ({ children }: any) => children,
    useSafeAreaInsets: () => ({ top: 0, left: 0, right: 0, bottom: 0 }),
  };
});

// AsyncStorage mock
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
