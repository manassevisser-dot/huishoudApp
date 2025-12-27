import React, { useMemo } from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { useAppStyles } from '@ui/styles/useAppStyles';
import { useFormContext } from '@a../a../a../a../a../a../a../a../a../a../a../a../a../a../a../app/context/FormContext';
import { selectFinancialSummaryVM } from '@selectors/financialSelectors';
import { FinancialSummary } from '@ui/components/FinancialSummary';

// Voeg de props toe die de Navigator verwacht (WAI-006B-A)
interface DashboardProps {
  onAddTransaction?: () => void;
  onLogout?: () => void;
  onOpenOptions?: () => void;
  onOpenUndo?: () => void;
}

export const DashboardScreen: React.FC<DashboardProps> = () => {
  const { styles } = useAppStyles();
  const { state, refreshData, isRefreshing } = useFormContext();

  const financialData = useMemo(() => {
    return selectFinancialSummaryVM(state);
  }, [state]);

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refreshData} />}
    >
      <View style={styles.pageContainer}>
        <FinancialSummary data={financialData} />
      </View>
    </ScrollView>
  );
};

export default DashboardScreen;
