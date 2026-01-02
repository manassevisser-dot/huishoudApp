// src/logic/finance.ts

const multipliers = {
  month: 1,
  quarter: 1/3,   // Gevaarlijk: 0.3333333333333333
  year: 1/12,
  week: 4.333333333333333, // 52 / 12
  '4wk': 1.0833333333333333, // 13 / 12
} as const;

/**
 * Berekent het maandbedrag in centen.
 * Gebruikt Math.round om direct terug te keren naar een integer (cent).
 */
const toMonthly = (amountCents: number, frequency?: string): number => {
  const freq = (frequency || 'month') as keyof typeof multipliers;
  const factor = multipliers[freq] ?? 1;
  
  // Eerst vermenigvuldigen, dan afronden naar de dichtstbijzijnde cent.
  // Dit voorkomt dat 0.33333... door de hele state blijft zweven.
  return Math.round(amountCents * factor);
};

export const computePhoenixSummary = (financeData: any) => {
  const incomeItems = financeData?.income?.items ?? [];
  const expenseItems = financeData?.expenses?.items ?? [];

  // Gebruik de centrale toMonthly logica
  const totalIncomeCents = incomeItems.reduce((acc: number, item: any) => {
    const val = Number(item?.amount ?? item?.amountCents ?? 0);
    return acc + toMonthly(val, item?.frequency);
  }, 0);

  const totalExpensesCents = expenseItems.reduce((acc: number, item: any) => {
    const val = Number(item?.amount ?? item?.amountCents ?? 0);
    return acc + toMonthly(val, item?.frequency);
  }, 0);

  return {
    totalIncomeCents,
    totalExpensesCents,
    netCents: totalIncomeCents - totalExpensesCents,
  };
};