import React from 'react';
import { View, Text } from 'react-native';
import { useAppStyles } from '@ui/styles/useAppStyles';
import { FinancialSummaryVM } from '../../selectors/financialSelectors';

interface Props {
  data: FinancialSummaryVM;
}

export const FinancialSummary: React.FC<Props> = ({ data }) => {
  const { styles } = useAppStyles();
  const { totals } = data;

  // We gebruiken hier styles die volgens de compiler wél bestaan in je theme
  return (
    <View style={styles.summaryDetail}> 
      <Text style={styles.pageTitle}>Financieel Overzicht</Text>
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }}>
        <Text style={{ fontSize: 16 }}>Totaal Inkomsten:</Text>
        <Text style={{ fontSize: 16, color: 'green', fontWeight: 'bold' }}>{totals.totalIncomeEUR}</Text>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 4 }}>
        <Text style={{ fontSize: 16 }}>Totaal Uitgaven:</Text>
        <Text style={{ fontSize: 16, color: 'red', fontWeight: 'bold' }}>{totals.totalExpensesEUR}</Text>
      </View>

      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginTop: 12, 
        paddingTop: 8, 
        borderTopWidth: 1, 
        borderTopColor: '#ccc' 
      }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Netto resultaat:</Text>
        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{totals.netEUR}</Text>
      </View>
    </View>
  );
};