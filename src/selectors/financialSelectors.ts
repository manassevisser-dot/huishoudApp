import { computePhoenixSummary } from '@logic/finance';
import { formatCurrency } from '@utils/numbers'; 
import { FormState } from '@shared-types/form';
import Logger from '@services/logger';

export function selectFinancialSummaryVM(state: FormState) {
  // 1. Directe en type-safe extractie
  // Omdat FormState nu 'finance' als vaste key heeft, snapt TS dit direct.
  const financeData = state.data.finance;
  
  // 2. De rekenkern (Logic laag)
  const summary = computePhoenixSummary(financeData);
  
  Logger.info?.('Financial VM generated');

  // 3. De ViewModel (VM) 
  return {
    // Ruwe data (integers/centen volgens ADR-03)
    totalIncomeCents: summary.totalIncomeCents,
    totalExpensesCents: summary.totalExpensesCents,
    netCents: summary.netCents,
    
    // Geformatteerde strings voor de UI
    totals: {
      totalIncomeEUR: formatCurrency(summary.totalIncomeCents),
      totalExpensesEUR: formatCurrency(summary.totalExpensesCents),
      netEUR: formatCurrency(summary.netCents),
    },
  };
}