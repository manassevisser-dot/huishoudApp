
// src/test-utils/jest.setup.ts
import '@testing-library/jest-native/extend-expect';

try {
  require('react-native-gesture-handler/jestSetup');
} catch { /* noop */ }

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native-safe-area-context', () => {
  const actual = jest.requireActual('react-native-safe-area-context');
  return {
    ...actual,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
    SafeAreaProvider: ({ children }: any) => children,
  };
});

// Optioneel; alleen houden als je touchables wil normaliseren voor RTL:
jest.mock('react-native/Libraries/Components/Touchable/TouchableOpacity', () => {
  const React = require('react');
  const { Pressable, View } = require('react-native');
  return ({ onPress, children, testID }: any) =>
    React.createElement(
      Pressable,
      { onPress, testID, accessibilityRole: 'button' },
      children ?? React.createElement(View)
    );
});

// Optioneel: voorspelbare timers
beforeAll(() => {
  jest.useFakeTimers();
});
afterAll(() => {
  jest.useRealTimers();
});
