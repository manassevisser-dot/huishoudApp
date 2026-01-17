import * as React from 'react';
import { View, ScrollView } from 'react-native';
import { MoneyField } from '@components/fields/MoneyField';
import { useAppStyles } from '@styles/useAppStyles';

// We gebruiken relatieve paden om alias-conflicten te vermijden
export const DailyInputScreen: React.FC = () => {
  const { styles } = useAppStyles();

  return (
    <ScrollView style={styles.container}>
      <View style={{ padding: 20 }}>
        <MoneyField 
          label="Bedrag" 
          // MoneyField verwacht 'amount' ipv 'value' op basis van je error
          amount={0} 
          onAmountChange={(_val) => { /* logged via orchestrator */ }} 
        />
      </View>
    </ScrollView>
  );
};

export default DailyInputScreen;