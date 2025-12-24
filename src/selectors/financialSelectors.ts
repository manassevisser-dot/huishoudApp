import { FormState } from '@shared-types/form';
import { computeSummary } from '@logic/finance';
import { formatCurrency } from '@utils/numbers';

export interface FinancialSummaryVM {
  totals: {
    totalIncomeEUR: string;
    totalExpensesEUR: string;
    netEUR: string;
  };
}

export function selectFinancialSummaryVM(state: FormState): FinancialSummaryVM {
  // Pak de items arrays uit de sub-secties C7 en C10
  const incomeItems = state.C7?.items || [];
  const expenseItems = state.C10?.items || [];

  const { totalIncome, totalExpenses, netto: net } = computeSummary(incomeItems, expenseItems);

  return {
    totals: {
      totalIncomeEUR: formatCurrency(totalIncome),
      totalExpensesEUR: formatCurrency(totalExpenses),
      netEUR: formatCurrency(net),
    },
  };
}