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

export type ImportResult = {
  // Transacties zijn in de kern records van velden
  transactions: CsvItem[];
  // De summary bevat boolean status + extra data velden
  summary: { isDiscrepancy: boolean; [k: string]: unknown };
  hasMissingCosts?: boolean;
  // ResearchData blijft vaak een ruw object, maar we maken het een Record voor type-safety
  researchData?: Record<string, unknown>;
  
};

export interface IDataOrchestrator {
  processCsvImport(params: {
    csvText: string;
    state: FormState;
  }): ImportResult;
}
