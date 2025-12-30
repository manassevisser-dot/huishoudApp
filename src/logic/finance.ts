
const multipliers = {
  month: 1,
  quarter: 1 / 3,
  year: 1 / 12,
  week: 52 / 12,   // ≈ 4.3333
  '4wk': 13 / 12,  // ≈ 1.0833
} as const;

const toMonthly = (amountCents: number, frequency?: string) => {
  const factor = multipliers[frequency as keyof typeof multipliers] ?? 1;
  // houd centen integer
  return Math.round(amountCents * factor);
};

export const computePhoenixSummary = (financeData: any) => {
  const incomeItems = financeData?.income?.items ?? [];
  const expenseItems = financeData?.expenses?.items ?? [];

  const totalIncomeCents = incomeItems.reduce((acc: number, item: any) => {
    return acc + toMonthly(Number(item?.amountCents ?? 0), item?.frequency);
  }, 0);

  const totalExpensesCents = expenseItems.reduce((acc: number, item: any) => {
    return acc + toMonthly(Number(item?.amountCents ?? 0), item?.frequency);
  }, 0);

  const netCents = totalIncomeCents - totalExpensesCents;

  return { totalIncomeCents, totalExpensesCents, netCents };
};
