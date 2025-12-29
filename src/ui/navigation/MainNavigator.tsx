import * as React from 'react';
import { View, Text } from 'react-native';
import { useAppStyles } from '../styles/useAppStyles';

interface Props {
  onSignup?: () => void;
  onSignin?: () => void;
}

const MainNavigator: React.FC<Props> = () => {
  const { styles } = useAppStyles();
  
  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>Dashboard (Hoofdmenu)</Text>
    </View>
  );
};

export default MainNavigator;