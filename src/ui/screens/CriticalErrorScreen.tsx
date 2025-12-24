import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { useAppStyles } from '@ui/styles/useAppStyles';

type Props = { onReset: () => void };

const CriticalErrorScreen: React.FC<Props> = ({ onReset }) => {
  const { styles } = useAppStyles();
  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>
        Er is een kritieke fout opgetreden in de data-integriteit.
      </Text>
      <Button title="Reset Applicatie" onPress={onReset} color="red" />
    </View>
  );
};
export default CriticalErrorScreen;
