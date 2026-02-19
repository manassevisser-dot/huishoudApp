import * as React from 'react';
import { View, Text, ColorValue } from 'react-native';
import { useAppStyles, AppStyles } from '@ui/styles/useAppStyles';
/**
 * TODO: Replace logic in SectionRegistry AND sections.tsx for DashBoardScreen
 */
interface FinancialSummaryData {
  totalIncomeDisplay: string;
  totalExpensesDisplay: string;
  netDisplay: string;
}

interface SummaryRowProps {
  label: string;
  value: string;
  valueColor: ColorValue; // Verplicht maken voorkomt boolean-fouten
  styles: AppStyles;
}

const SummaryRow: React.FC<SummaryRowProps> = ({ label, value, valueColor, styles }) => (
  <View style={styles.summaryRow}>
    <Text style={styles.summaryLabel}>{label}</Text>
    <Text style={[styles.summaryValue, { color: valueColor, fontWeight: '700' }]}>
      {value}
    </Text>
  </View>
);

export const FinancialSummary: React.FC<{ data: FinancialSummaryData }> = ({ data }) => {
  const { styles, colors, Tokens } = useAppStyles();

  return (
    <View style={styles.summaryDetail}>
      <Text style={styles.screenTitle}>Financieel Overzicht</Text>

      <SummaryRow label="Totaal Inkomsten:" value={data.totalIncomeDisplay} valueColor={colors.success} styles={styles} />
      <SummaryRow label="Totaal Uitgaven:" value={data.totalExpensesDisplay} valueColor={colors.error} styles={styles} />

      <View style={styles.summaryRowTotal}>
        <Text style={styles.summaryLabelBold}>Netto resultaat:</Text>
        <Text style={styles.summaryValueBold}>{data.netDisplay}</Text>
      </View>

      <View style={{ height: Tokens.Space.md }} />
    </View>
  );
};