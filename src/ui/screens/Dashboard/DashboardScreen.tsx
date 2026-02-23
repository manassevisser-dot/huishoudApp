/**
 * @file DashboardScreen.tsx
 * @description This file contains the DashboardScreen component, which is the main screen of the application.
 * It displays the Phoenix Dashboard and provides navigation to other screens.
 * @requires react
 * @requires react-native
 */
import * as React from 'react';
import { View, Text } from 'react-native';

interface Props {
  onGoToSetup: () => void;
  onGoToOptions: () => void;
}
export const DashboardScreen: React.FC<Props> = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Phoenix Dashboard - Master Mode Active</Text>
    </View>
  );
};

export default DashboardScreen;