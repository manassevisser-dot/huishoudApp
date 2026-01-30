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
