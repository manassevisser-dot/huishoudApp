// jest.setup.js - Phoenix Golden Baseline (Resilient Final)
import React from 'react';

// 1. Virtuele Mock voor Gesture Handler
jest.mock('react-native-gesture-handler', () => ({
  Swipeable: ({ children }) => children,
  DrawerLayout: ({ children }) => children,
  State: {},
  PanGestureHandler: ({ children }) => children,
  GestureHandlerRootView: ({ children }) => children,
  Directions: {},
}), { virtual: true });

// 2. Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// 3. De "Ultimate" React Native Global Mock
// Dit lost de "Value is not a constructor" fout op bij TouchableOpacity
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  
  // We overschrijven de Touchables met simpele Views die onPress ondersteunen
  // Dit voorkomt dat de interne Animated.Value constructor wordt aangeroepen
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

  return RN;
});

// 4. Platform Safety
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: (objs) => objs.ios,
}));