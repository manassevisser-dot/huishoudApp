// src/app/orchestrators/interfaces/IBusinessOrchestrator.ts
/**
 * Contract voor de BusinessOrchestrator: berekent afgeleide ViewModels uit ruwe `FormState`.
 *
 * @module app/orchestrators/interfaces
 * @see {@link ./README.md | Interfaces — Details}
 */
import type { FormState } from '@core/types/core';

export interface FinancialSummaryVM {
    totalIncomeDisplay: string;
    totalExpensesDisplay: string;
    netDisplay: string;
  }
  
  export interface IBusinessOrchestrator {
    /**
     * Vertaalt `FormState` naar een presentatie-model met geformatteerde financiële totalen.
     *
     * @param state - Huidige `FormState`
     * @returns `FinancialSummaryVM` met `totalIncomeDisplay`, `totalExpensesDisplay` en `netDisplay`
     */
    prepareFinancialViewModel(state: FormState): FinancialSummaryVM;
  }