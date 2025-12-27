import React from 'react';
import { View, Text } from 'react-native';
import { useAppStyles } from '@ui/styles/useAppStyles'; // ← orchestrator (CU-008.6)
import { FinancialSummaryVM } from '@selectors/financialSelectors';

interface Props {
  data: FinancialSummaryVM;
}

export const FinancialSummary: React.FC<Props> = ({ data }) => {
  const { styles, colors, Tokens } = useAppStyles();
  const { totals } = data;

  return (
    <View style={styles.summaryDetail}>
      <Text style={styles.pageTitle}>Financieel Overzicht</Text>

      {/* Totaal Inkomsten */}
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Totaal Inkomsten:</Text>
        <Text
          style={{
            ...styles.summaryValue,
            color: colors.success, // semantisch i.p.v. 'green'
            fontWeight: '700',
          }}
        >
          {totals.totalIncomeEUR}
        </Text>
      </View>

      {/* Totaal Uitgaven */}
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Totaal Uitgaven:</Text>
        <Text
          style={{
            ...styles.summaryValue,
            color: colors.error, // semantisch i.p.v. 'red'
            fontWeight: '700',
          }}
        >
          {totals.totalExpensesEUR}
        </Text>
      </View>

      {/* Netto resultaat: gebruik summaryRowTotal (heeft top-border met border → borderSubtle/ border) */}
      <View style={styles.summaryRowTotal}>
        <Text style={styles.summaryLabelBold}>Netto resultaat:</Text>
        <Text style={styles.summaryValueBold}>{totals.netEUR}</Text>
      </View>

      {/* (optioneel) Kleine spacer met Tokens.Space i.p.v. magic numbers */}
      <View style={{ height: Tokens.Space.md }} />
    </View>
  );
};
