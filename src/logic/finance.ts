// src/logic/finance.ts

export const computeSummary = (c7: any, c10: any) => {
  // Verdedig tegen 'undefined' of objecten zonder 'items' array
  const incomeItems = Array.isArray(c7?.items) ? c7.items : [];
  const expenseItems = Array.isArray(c10?.items) ? c10.items : [];

  const totalIncome = incomeItems.reduce((acc: number, item: any) => {
    return acc + (Number(item.amount) || 0);
  }, 0);

  const totalExpenses = expenseItems.reduce((acc: number, item: any) => {
    return acc + (Number(item.amount) || 0);
  }, 0);

  return {
    totalIncome,
    totalExpenses,
    netto: totalIncome - totalExpenses,
  };
};
