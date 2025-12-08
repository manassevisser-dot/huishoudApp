import * as React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styles from '../../styles/AppStyles';
import { useFormContext } from '../../context/FormContext';
import { calculateFinancialSummary } from '../../utils/finance';
import { formatCurrency } from '../../utils/numbers';

const DashboardScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { state } = useFormContext();
  const summary = React.useMemo(
    () => calculateFinancialSummary(state.C7, state.C10),
    [state.C7, state.C10]
  );
  
  const isPositive = summary.cashflowNetto >= 0;

  return (
    <View style={styles.pageContainer}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 120 + insets.bottom },
        ]}>
        <View style={styles.dashboardCard}>
          <Text style={styles.dashboardLabel}>Netto Cashflow (Maand)</Text>
          <Text
            style={[
              styles.dashboardKPI,
              { color: isPositive ? '#34C759' : '#FF3B30' },
            ]}>
            {formatCurrency(summary.cashflowNetto)}
          </Text>
          <Text style={styles.dashboardMessage}>
            {isPositive
              ? 'Gefeliciteerd! Uw inkomsten dekken momenteel uw vaste lasten.'
              : 'Let op: Uw vaste lasten overschrijden momenteel uw berekende maandelijkse inkomsten.'}
          </Text>
        </View>
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Maandelijkse Inkomsten (C7)</Text>
            <Text style={[styles.summaryValue, { color: '#34C759' }]}>
              {formatCurrency(summary.inkomenTotaalMaand)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Maandelijkse Vaste Lasten (C10)
            </Text>
            <Text style={[styles.summaryValue, { color: '#FF3B30' }]}>
              {formatCurrency(summary.lastenTotaalVast)}
            </Text>
          </View>
          <View style={styles.summaryRowTotal}>
            <Text style={styles.summaryLabelBold}>Netto Cashflow</Text>
            <Text
              style={[
                styles.summaryValueBold,
                { color: isPositive ? '#34C759' : '#FF3B30' },
              ]}>
              {formatCurrency(summary.cashflowNetto)}
            </Text>
          </View>
        </View>
        <Text style={styles.pageTitle}>Overzicht</Text>
        <Text style={styles.summaryDetail}>
          Dit overzicht is gebaseerd op de ingevulde velden op de pagina's
          'Inkomsten' (C7) en 'Vaste Lasten' (C10).
        </Text>
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;
