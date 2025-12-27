import * as React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useAppStyles } from '@ui/styles/useAppStyles';

const SplashScreen: React.FC = () => {
  const { styles, colors } = useAppStyles();
  return (
    <View style={styles.container}>
      <ActivityIndicator color={colors.primary} />
      <Text style={styles.pageTitle}>Phoenix wordt geladen...</Text>
    </View>
  );
};
export default SplashScreen;
