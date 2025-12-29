import { computePhoenixSummary } from '../logic/finance';
import { toCents } from '../utils/numbers';
import { FormState } from '../shared-types/form';
import { Logger } from '../services/logger';

export function selectFinancialSummaryVM(state: FormState) {
  const summary = computePhoenixSummary(state);
  Logger.info('Financial VM generated');

  return {
    totals: {
      totalIncomeEUR: toCents(summary.totalIncomeCents),
      totalExpensesEUR: toCents(summary.totalExpensesCents),
      netEUR: toCents(summary.netCents),
    },
  };
}