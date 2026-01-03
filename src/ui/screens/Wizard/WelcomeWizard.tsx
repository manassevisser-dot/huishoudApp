import * as React from 'react';
import { View, Text } from 'react-native';
import { useAppStyles } from '@ui/styles/useAppStyles';

const WelcomeWizard: React.FC<any> = () => {
  const { styles } = useAppStyles();
  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Welkom bij de nieuwe Cashflow Wizard.</Text>
    </View>
  );
};
export default WelcomeWizard;
