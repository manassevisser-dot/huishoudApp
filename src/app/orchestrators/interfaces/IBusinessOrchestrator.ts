// src/app/orchestrators/interfaces/IBusinessOrchestrator.ts
import type { FormState } from '@core/types/core';

export interface FinancialSummaryVM {
    totalIncomeDisplay: string;
    totalExpensesDisplay: string;
    netDisplay: string;
  }
  
  export interface IBusinessOrchestrator {
    prepareFinancialViewModel(state: FormState): FinancialSummaryVM;
  }