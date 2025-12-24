import * as React from 'react';
import { View, Text } from 'react-native';
import { useAppStyles } from '@ui/styles/useAppStyles';

const MainNavigator: React.FC = () => {
  const { styles } = useAppStyles();
  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Hoofdnavigatie (Dashboard)</Text>
    </View>
  );
};
export default MainNavigator;
