import { createSelector } from 'reselect';
import { FormState } from '@shared-types/form';
import { computePhoenixSummary } from '@kernel/finance';
import { formatCurrency } from '@utils/index'; // of correct pad naar jouw helper

// Veilige selector die nooit crasht
const selectFinanceData = (state: FormState) =>
  state?.data?.finance || { income: { items: [] }, expenses: { items: [] } };

export const selectFinancialSummary = createSelector([selectFinanceData], (finance) => {
  // We roepen de kernel aan. De kernel is nu slim genoeg om het object te parsen.
  return computePhoenixSummary(finance);
});

export const selectFinancialSummaryVM = createSelector([selectFinancialSummary], (summary) => ({
  totalIncomeCents: summary.totalIncomeCents,
  totalExpensesCents: summary.totalExpensesCents,
  netCents: summary.netCents,
  totals: {
    totalIncomeEUR: formatCurrency(summary.totalIncomeCents),
    totalExpensesEUR: formatCurrency(summary.totalExpensesCents),
    netEUR: formatCurrency(summary.netCents),
  },
}));
