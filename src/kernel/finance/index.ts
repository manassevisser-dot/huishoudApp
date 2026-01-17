// src/kernel/finance/index.ts

export interface FinancialTotals {
  totalIncomeCents: number;
  totalExpensesCents: number;
  netCents: number;
}

// Helper om te checken of iets een array is
function isArray(input: any): input is any[] {
  return Array.isArray(input);
}

export const computePhoenixSummary = (data: any): FinancialTotals => {
  let incomeTotal = 0;
  let expenseTotal = 0;

  // Scenario A: Input is een array van UndoResults
  if (isArray(data)) {
    data.forEach(item => {
      // Pas dit aan op basis van hoe jouw UndoResult er echt uitziet
      // Aanname: positief is inkomen, negatief is uitgave (of type veld)
      if (item.amount > 0) incomeTotal += item.amount;
      else expenseTotal += Math.abs(item.amount);
    });
  } 
  // Scenario B: Input is het { income, expenses } object uit de state
  else if (data && typeof data === 'object') {
    // Check income bucket
    if (data.income && isArray(data.income.items)) {
      data.income.items.forEach((item: any) => {
        // ✅ Nu ook amountCents ondersteunen
        incomeTotal += Number(item.amount || item.value || item.amountCents || 0);
      });
    }
    // Check expenses bucket
    if (data.expenses && isArray(data.expenses.items)) {
      data.expenses.items.forEach((item: any) => {
        // ✅ Nu ook amountCents ondersteunen
        expenseTotal += Number(item.amount || item.value || item.amountCents || 0);
      });
    }
  }

  return {
    totalIncomeCents: Math.round(incomeTotal),
    totalExpensesCents: Math.round(expenseTotal),
    netCents: Math.round(incomeTotal - expenseTotal)
  };
};
