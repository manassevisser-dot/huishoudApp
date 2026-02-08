import type { FormState } from '@core/types/core';

/**
 * Selecteert de financiële samenvatting die al door de Orchestrator 
 * is voorbereid en geformatteerd.
 * * ✅ Geen imports van @kernel of @domain (Integrity Guard blij)
 * ✅ Geen berekeningen (Pure selector)
 */
export const selectFinancialSummaryVM = (state: FormState) => {
  return state.viewModels?.financialSummary ?? {
    totalIncomeDisplay: '€ 0,00',
    totalExpensesDisplay: '€ 0,00',
    netDisplay: '€ 0,00',
  };
};