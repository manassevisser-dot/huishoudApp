import * as React from 'react';
import { useMemo } from 'react';
import { View, ScrollView, RefreshControl, Text } from 'react-native';
import { useAppStyles } from '@styles/useAppStyles';
import { useForm } from '@app/context/FormContext';
import { selectFinancialSummaryVM } from '@selectors/financialSelectors';
import { FinancialSummary } from '@components/FinancialSummary';

// Props interface (WAI-006B-A)
interface DashboardProps {
  onAddTransaction?: () => void;
  onLogout?: () => void;
  onOpenOptions?: () => void;
  onOpenUndo?: () => void;
}

export const DashboardScreen: React.FC<DashboardProps> = () => {
  const { styles } = useAppStyles();
  const { state, refreshData, isRefreshing } = useForm() as any;

  // ADR-01: Memoize de selector voor performance
  const financialData = useMemo(() => {
    return selectFinancialSummaryVM(state);
  }, [state]);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={refreshData}
          accessibilityLabel="Vernieuw financiële gegevens"
        />
      }
    >
      <View style={styles.pageContainer}>
        {/* WAI-009: Pagina titel met de juiste rollen */}
        <Text style={styles.pageTitle} accessibilityRole="header" accessibilityLiveRegion="polite">
          Dashboard
        </Text>

        <FinancialSummary data={financialData} />

        {/* Ruimte voor extra widgets */}
      </View>
    </ScrollView>
  );
};

export default DashboardScreen;
