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