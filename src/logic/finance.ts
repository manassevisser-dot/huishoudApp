// Zorg dat hij zowel de array als het object-met-items snapt
export const computeSummary = (incomeInput: any, expenseInput: any) => {
  const income = Array.isArray(incomeInput) ? incomeInput : (incomeInput?.items || []);
  const expenses = Array.isArray(expenseInput) ? expenseInput : (expenseInput?.items || []);
  
  const totalIncome = income.reduce((sum: number, item: any) => sum + (item.amount || 0), 0);
  const totalExpenses = expenses.reduce((sum: number, item: any) => sum + (item.amount || 0), 0);
  
  return {
    totalIncome,
    totalExpenses,
    netto: totalIncome - totalExpenses
  };
};

