import 'react-native-gesture-handler/jestSetup';

// 1. Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// 2. Mock Platform
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: (objs) => objs.ios,
}));

// 3. Mock Native Animated Helper (met fallback)
try {
  jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
} catch (e) {}

// 4. GLOBAL Animated Mock
jest.mock('react-native/Libraries/Animated/Animated', () => {
  const ActualAnimated = jest.requireActual('react-native/Libraries/Animated/Animated');
  return {
    ...ActualAnimated,
    Value: jest.fn(() => ({
      setValue: jest.fn(),
      setOffset: jest.fn(),
      interpolate: jest.fn(() => 0),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      removeAllListeners: jest.fn(),
      stopAnimation: jest.fn(),
      resetAnimation: jest.fn(),
      _value: 0,
    })),
    timing: () => ({
      start: (callback) => callback && callback({ finished: true }),
    }),
    spring: () => ({
      start: (callback) => callback && callback({ finished: true }),
    }),
    decay: () => ({
      start: (callback) => callback && callback({ finished: true }),
    }),
    event: jest.fn(),
  };
});

// 5. GLOBAL React Native Mock (De cruciale fix voor flatten)
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  
  // Fix TouchableOpacity
  RN.TouchableOpacity = ({ children, onPress, accessibilityLabel, testID }) => (
    <RN.View 
      onPress={onPress} 
      accessibilityLabel={accessibilityLabel} 
      testID={testID}
      accessible={true}
    >
      {children}
    </RN.View>
  );

  // Fix StyleSheet.flatten (Cruciaal voor RTL)
  RN.StyleSheet = {
    ...RN.StyleSheet,
    flatten: (style) => (Array.isArray(style) ? Object.assign({}, ...style) : style),
    create: (obj) => obj,
  };

  return RN;
});
