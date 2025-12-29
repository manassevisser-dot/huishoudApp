import { computePhoenixSummary } from '@logic/finance';
import { toCents } from '@utils/numbers';
import { FormState } from '../shared-types/form';

export function selectFinancialSummaryVM(state: FormState) {
  // Bereken het financiële overzicht vanuit de state
  const summary = computePhoenixSummary(state);

  return {
    totals: {
      totalIncomeEUR: toCents(summary.totalIncomeCents),
      totalExpensesEUR: toCents(summary.totalExpensesCents),
      netEUR: toCents(summary.netCents),
    },
  };
}
