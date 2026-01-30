import { dataOrchestrator } from '@services/dataOrchestrator';
 // removed unused collectAndDistributeData from '@services/privacyHelpers';
import { Member, CsvItem, } from '@domain/types'; //FinancialIncomeSummary stond er ook bij

export interface ImportResult {
  transactions: CsvItem[];
  summary: {
    source: string;
    finalIncome: number;
    isDiscrepancy: boolean;
  };
  hasMissingCosts: boolean;
  researchPayload: any;
}

export class ImportOrchestrator {
  /**
   * Bridge naar de domein-wasstraat. 
   * Gebruikt destructured import voor collectAndDistributeData conform broncode.
   */
  processCsvImport(params: {
    csvText: string;
    members: Member[];
    setupData: any;
  }): ImportResult {
    const rawResult = dataOrchestrator.processAllData(
      params.members,
      params.csvText,
      params.setupData
    );
    
    // De wasstraat geeft data terug in de buckets 'local' en 'research'
    const finance = rawResult.local.finance;
    
    return {
      transactions: finance.transactions,
      summary: {
        source: finance.summary.source,
        finalIncome: finance.summary.finalIncome,
        isDiscrepancy: finance.summary.isDiscrepancy
      },
      hasMissingCosts: finance.hasMissingCosts,
      researchPayload: rawResult.research
    };
  }
}