import { ResearchOrchestrator } from '@app/orchestrators/ResearchOrchestrator.WIP';
import { Member } from '@core/types/core';
import { CsvItem } from '@core/types/research';

export interface ImportResult {
  transactions: CsvItem[];
  summary: {
    source: string;
    finalIncome: number;
    isDiscrepancy: boolean;
  };
  hasMissingCosts: boolean;
  researchData: unknown; // We gebruiken even unknown omdat de research-output breed is
}

export class ImportOrchestrator {
  /**
   * Transformeert ruwe import naar bruikbare resultaten.
   * Regel: Ontvangt de research-instantie van de Master.
   */
  public static processCsvImport(
    research: ResearchOrchestrator, // De instantie van de Master
    params: {
      csvText: string;
      members: Member[];
      setupData: Record<string, unknown> | null;
    }
  ): ImportResult {
    // FIX: Aanroep op de INSTANTIE (research), niet op de Klasse
    const rawResult = research.processAllData(
      params.members,
      params.csvText,
      params.setupData
    );
    
    const finance = rawResult.local.finance;
    
    return {
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