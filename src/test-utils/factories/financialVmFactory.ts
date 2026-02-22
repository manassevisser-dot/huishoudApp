// src/test-utils/factories/financialVmFactory.ts
import type { FinancialSummaryVM } from '@app/orchestrators/interfaces/IBusinessOrchestrator';

export const createFinancialSummaryVM = (partial: Partial<FinancialSummaryVM> = {}): FinancialSummaryVM => {
  return {
    totalIncomeDisplay: '€0,00',
    totalExpensesDisplay: '€0,00',
    netDisplay: '€0,00',
    ...partial,
  };
};