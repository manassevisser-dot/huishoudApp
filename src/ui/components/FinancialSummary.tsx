import * as React from 'react';
import { View, Text } from 'react-native';
import { useAppStyles } from '@ui/styles/useAppStyles';

// We verwachten nu kant-en-klare strings van de selector/orchestrator
interface FinancialSummaryData {
  totalIncomeDisplay: string;
  totalExpensesDisplay: string;
  netDisplay: string;
}

interface Props {
  data: FinancialSummaryData;
}

export const FinancialSummary: React.FC<Props> = ({ data }) => {
  const { styles, colors, Tokens } = useAppStyles();

  return (
    <View style={styles.summaryDetail}>
      <Text style={styles.pageTitle}>Financieel Overzicht</Text>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Totaal Inkomsten:</Text>
        <Text style={[styles.summaryValue, { color: colors.success, fontWeight: '700' }]}>
          {data.totalIncomeDisplay}
        </Text>
      </View>

      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Totaal Uitgaven:</Text>
        <Text style={[styles.summaryValue, { color: colors.error, fontWeight: '700' }]}>
          {data.totalExpensesDisplay}
        </Text>
      </View>

      <View style={styles.summaryRowTotal}>
        <Text style={styles.summaryLabelBold}>Netto resultaat:</Text>
        <Text style={styles.summaryValueBold}>{data.netDisplay}</Text>
      </View>

      <View style={{ height: Tokens.Space.md }} />
    </View>
  );
};