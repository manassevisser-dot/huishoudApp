import { FormState } from '../shared-types/form';

export const computePhoenixSummary = (state: any) => {
  const income = state.income?.items || [];
  const expenses = state.expenses?.items || [];

  const totalIncomeCents = income.reduce((sum: number, i: any) => sum + (Number(i.amountCents) || 0), 0);
  const totalExpensesCents = expenses.reduce((sum: number, e: any) => sum + (Number(e.amountCents) || 0), 0);

  return {
    totalIncomeCents,
    totalExpensesCents,
    netCents: totalIncomeCents - totalExpensesCents
  };
};