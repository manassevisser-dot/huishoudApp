// src/app/orchestrators/interfaces/IDataOrchestrator.ts

import type { FormState, Member } from '@core/types/core';
import type { CsvItem, FinancialIncomeSummary } from '@core/types/research';

/**
 * Centraal contract voor de processor die de ruwe data omzet.
 * Wordt gebruikt door zowel de DataManager als de ImportOrchestrator.
 */
export interface ResearchProcessor {
  processAllData(
    members: Member[],
    csvText: string,
    setupData: Record<string, unknown> | null
  ): {
    local: {
      finance: {
        transactions: CsvItem[];
        summary: FinancialIncomeSummary;
        hasMissingCosts: boolean;
      };
    };
    research: Record<string, unknown>;
  };
}

// --- Nieuwe, correcte ImportResult-definitie ---
type ImportSuccess = {
  status: 'success';
  transactions: CsvItem[];
  count: number;
  summary: FinancialIncomeSummary;
  hasMissingCosts?: boolean;
  researchData?: Record<string, unknown>;
};

type ImportEmpty = {
  status: 'empty';
  transactions: [];
  count: 0;
  summary: FinancialIncomeSummary;
  hasMissingCosts?: boolean;
  researchData?: Record<string, unknown>; // optioneel, maar consistent
};

type ImportError = {
  status: 'error';
  transactions: [];
  count: 0;
  errorMessage: string;
  summary: FinancialIncomeSummary;
  hasMissingCosts?: boolean;
  researchData?: Record<string, unknown>;
};


export type ImportResult = ImportSuccess | ImportEmpty | ImportError;

export type ImportStatusValue = 'success' | 'empty' | 'error';

export interface IDataOrchestrator {
  processCsvImport(params: {
    csvText: string;
    state: FormState;
  }): ImportResult;
}