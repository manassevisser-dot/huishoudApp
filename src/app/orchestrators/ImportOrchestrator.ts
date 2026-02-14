// src/app/orchestrators/ImportOrchestrator.ts

import type { Member } from '@core/types/core';
import type { ImportResult } from './interfaces/IDataOrchestrator';
import type { ResearchProcessor } from '@app/orchestrators/interfaces/IDataOrchestrator';


export class ImportOrchestrator {
  /**
   * Verwerkt de csv-import via de geïnjecteerde research-processor.
   */
  public static processCsvImport(
    research: ResearchProcessor,
    params: {
      csvText: string;
      members: Member[];
      setupData: Record<string, unknown> | null;
    }
  ): ImportResult {
    const rawResult = research.processAllData(
      params.members,
      params.csvText,
      params.setupData
    );

    const { finance } = rawResult.local;

    return {
      // We mappen naar de Record structuur die ImportResult verwacht
      transactions: finance.transactions,
      summary: {
        source: finance.summary.source,
        finalIncome: finance.summary.finalIncome,
        isDiscrepancy: finance.summary.isDiscrepancy
      },
      hasMissingCosts: finance.hasMissingCosts,
      researchData: rawResult.research
    };
  }
}