import 'react-native-gesture-handler/jestSetup';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: (objs: any) => objs.ios,
}));

try {
  jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
} catch {}

// Polyfill voor jouw specifieke omgeving
if (typeof global.structuredClone !== 'function') {
  global.structuredClone = (obj: any) => {
    if (obj === undefined) return undefined;
    return JSON.parse(JSON.stringify(obj));
  };
}

// Mock voor de constanten als ze ergens ontbreken tijdens test-load
jest.mock('@domain/constants/datakeys', () => ({
  DATA_KEYS: {
    SETUP: 'setup',
    HOUSEHOLD: 'household',
    FINANCE: 'finance'
  }
}), { virtual: true });