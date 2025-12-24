// Vernietig de 'Winter' runtime globals voor Jest
global.__ExpoImportMetaRegistry = {
  getValue: () => ({}),
};

// Mock de basis RN modules
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

// Bestaande imports/mocks behouden...
import '@testing-library/jest-native/extend-expect';

// Extra shield tegen Expo Winter/Import Meta errors
if (typeof global.import === 'undefined') {
  global.import = { meta: { env: {} } };
}

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);
