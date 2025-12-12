//====
// src/screens/Dashboard/DashboardScreen.tsx

import * as React from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStyles } from '../../styles/useAppStyles';
const { styles, colors } = useAppStyles();
import { useFormContext } from '../../context/FormContext';
import { calculateFinancialSummary } from '../../utils/finance';
import { formatCurrency } from '../../utils/numbers';
import { TransactionService } from '../../services/transactionService';

type Props = {
  onAddTransaction: () => void;
  onLogout: () => void;
  onOpenOptions: () => void;
  onOpenUndo: () => void;
};

const DashboardScreen: React.FC<Props> = ({ 
  onAddTransaction, 
  onLogout, 
  onOpenOptions, 
  onOpenUndo 
}) => {
  const insets = useSafeAreaInsets();
  const { state } = useFormContext();
  const [variableExpenses, setVariableExpenses] = React.useState(0);
  const [refreshing, setRefreshing] = React.useState(false);

  const summary = React.useMemo(
    () => calculateFinancialSummary(state.C7, state.C10),
    [state.C7, state.C10]
  );
  
  const fetchTransactions = React.useCallback(async () => {
    const data = await TransactionService.fetchSummary();
    setVariableExpenses(data.totalVariableMonth);
    setRefreshing(false);
  }, []);

  React.useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchTransactions();
  }, [fetchTransactions]);
  
  const totalExpenses = summary.lastenTotaalVast + variableExpenses;
  const remainingBudget = summary.inkomenTotaalMaand - totalExpenses;
  const isPositive = remainingBudget >= 0;

  return (
    <View style={styles.pageContainer}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 120 + insets.bottom },
        ]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.pageTitle}>Dashboard</Text>

        {/* NEW P1: Top row with 70/30 split */}
        <View style={{ flexDirection: 'row', marginBottom: 16 }}>
          <TouchableOpacity
            style={[styles.button, { flex: 7, marginRight: 8, marginLeft: 0 }]}
            onPress={onOpenUndo}
          >
            <Text style={styles.buttonText}>Herstel laatste uitgave</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.secondaryButton, { flex: 3, marginRight: 0 }]}
            onPress={onOpenOptions}
          >
            <Text style={styles.secondaryButtonText}>Options</Text>
          </TouchableOpacity>
        </View>

        {/* Financial Overview Card */}
        <View style={styles.dashboardCard}>
          <Text style={styles.dashboardLabel}>Resterend Budget (Deze Maand)</Text>
          <Text
            style={[
              styles.dashboardKPI,
              { color: isPositive ? '#34C759' : '#FF3B30' },
            ]}>
            {formatCurrency(remainingBudget)}
          </Text>
          <Text style={styles.dashboardMessage}>
            {isPositive
              ? 'U blijft binnen uw budget!'
              : 'Let op: Uw uitgaven zijn hoger dan uw inkomsten.'}
          </Text>
        </View>

        {/* Detailed Breakdown */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Inkomen (Maand)</Text>
            <Text style={[styles.summaryValue, { color: '#34C759' }]}>
              {formatCurrency(summary.inkomenTotaalMaand)}
            </Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Vaste Lasten</Text>
            <Text style={[styles.summaryValue, { color: '#FF3B30' }]}>
              {formatCurrency(summary.lastenTotaalVast)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Variabele Uitgaven (Dit moment)</Text>
            <Text style={[styles.summaryValue, { color: '#FF3B30', fontWeight: 'bold' }]}>
              {formatCurrency(variableExpenses)}
            </Text>
          </View>

          <View style={styles.summaryRowTotal}>
            <Text style={styles.summaryLabelBold}>Totaal Uitgaven</Text>
            <Text style={styles.summaryValueBold}>
              {formatCurrency(totalExpenses)}
            </Text>
          </View>
        </View>

        <Text style={styles.summaryDetail}>
          Gebruik de "+ Nieuwe Uitgave" knop om uw dagelijkse boodschappen en andere variabele kosten toe te voegen.
        </Text>
      </ScrollView>
      
      {/* NEW P1: Footer with Uitloggen + Nieuwe Uitgave */}
      <View style={[styles.buttonContainer, { bottom: insets.bottom, paddingBottom: Math.max(20, insets.bottom + 8) }]}>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={onLogout}
        >
          <Text style={styles.secondaryButtonText}>Uitloggen</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.button}
          onPress={onAddTransaction}
        >
          <Text style={styles.buttonText}>+ Nieuwe Uitgave</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DashboardScreen;