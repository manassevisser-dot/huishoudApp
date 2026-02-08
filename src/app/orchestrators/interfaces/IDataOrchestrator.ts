// src/app/orchestrators/interfaces/IDataOrchestrator.ts

import type { FormState } from '@core/types/core';

export type ImportResult = {
  transactions: unknown[];
  summary: { isDiscrepancy: boolean; [k: string]: unknown };
  hasMissingCosts?: boolean;
  researchData?: unknown;
};

export interface IDataOrchestrator {
  processCsvImport(params: {
    csvText: string;
    state: FormState;
  }): ImportResult;
}
