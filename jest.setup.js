import * as React from 'react';
import '@testing-library/jest-native/extend-expect';

// Bestaande mocks...
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.TouchableOpacity = ({ children, onPress, testID }) => (
    <RN.View onPress={onPress} testID={testID} accessible={true}>
      {children}
    </RN.View>
  );
  return RN;
});
