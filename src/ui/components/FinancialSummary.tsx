import * as React from 'react';
import { View, Text } from 'react-native';
import { useAppStyles } from '@ui/styles/useAppStyles';
import { formatCurrency } from '@app/orchestrators/types'; // Gebruik je nieuwe financiële grondwet

// Definieer een interface voor de data die de selector levert
interface FinancialSummaryData {
  totalIncomeCents: number;
  totalExpensesCents: number;
  netCents: number;
}

interface Props {
  data: FinancialSummaryData;
}

export const FinancialSummary: React.FC<Props> = ({ data }) => {
  const { styles, colors, Tokens } = useAppStyles();

  // We gebruiken de data direct uit de lades, omgezet naar Euro's voor display
  const incomeDisplay = formatCurrency(data.totalIncomeCents);
  const expensesDisplay = formatCurrency(data.totalExpensesCents);
  const netDisplay = formatCurrency(data.netCents);

  return (
    <View style={styles.summaryDetail}>
      <Text style={styles.pageTitle}>Financieel Overzicht</Text>

      {/* Totaal Inkomsten */}
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Totaal Inkomsten:</Text>
        <Text style={[styles.summaryValue, { color: colors.success, fontWeight: '700' }]}>
          {incomeDisplay}
        </Text>
      </View>

      {/* Totaal Uitgaven */}
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Totaal Uitgaven:</Text>
        <Text style={[styles.summaryValue, { color: colors.error, fontWeight: '700' }]}>
          {expensesDisplay}
        </Text>
      </View>

      {/* Netto resultaat */}
      <View style={styles.summaryRowTotal}>
        <Text style={styles.summaryLabelBold}>Netto resultaat:</Text>
        <Text style={styles.summaryValueBold}>{netDisplay}</Text>
      </View>

      <View style={{ height: Tokens.Space.md }} />
    </View>
  );
};
