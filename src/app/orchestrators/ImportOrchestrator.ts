
/**
 * @file_intent Converteert een CSV-string naar lokaal bruikbare transactie-objecten.
 * @repo_architecture Mobile Industry (MI) - Data Ingestion Layer.
 * @term_definition PII (Personally Identifiable Information) = Persoonlijke data die uit beschrijvingen wordt gefilterd.
 * @contract Stateless Transformer. Deze klasse is enkel verantwoordelijk voor het parsen, opschonen en verrijken van CSV-data voor lokaal gebruik. Het heeft geen kennis van andere orchestrators of externe processen zoals 'research'.
 * @ai_instruction De logica hier is een directe verplaatsing van de logica uit de originele ResearchOrchestrator.
 */

import type { FinancialIncomeSummary, CsvItem } from '@core/types/research';
import { dataProcessor, type ResearchSetupData } from '@domain/finance/StatementIntakePipeline';
import { csvAdapter } from '@adapters/csv/csvAdapter'; // Gebruikt de bestaande adapter
import { Logger } from '@adapters/audit/AuditLoggerAdapter'; // Gebruikt de bestaande logger

// Een specifiek, lokaal resultaat-type.
export interface LocalImportResult {
  status: 'success' | 'empty' | 'error';
  transactions: CsvItem[];
  count: number;
  summary: FinancialIncomeSummary;
  hasMissingCosts: boolean;
  errorMessage?: string;
}

const EMPTY_SUMMARY: FinancialIncomeSummary = {
  source: 'none',
  finalIncome: 0,
  isDiscrepancy: false,
};

/**
 * IMPORT ORCHESTRATOR (Refactored & Corrected)
 * VERANTWOORDELIJKHEID: Pure CSV Parser & Transformer.
 * Converteert CSV naar een `LocalImportResult` door bestaande logica te hergebruiken.
 */
export class ImportOrchestrator {
  constructor() {}

  public processCsvImport(params: {
    csvText: string;
    setupData: Record<string, unknown> | null;
  }): LocalImportResult {
    try {
      // Stap 1: Parse de CSV met de bestaande adapter.
      // Deze logica is direct overgenomen uit ResearchOrchestrator.processCsvTransactions
      const parsedTransactions = this.parseAndEnrichCsv(params.csvText);

      if (parsedTransactions.length === 0) {
        return {
          status: 'empty',
          transactions: [],
          count: 0,
          summary: this.calculateSummary([], params.setupData), // Lege summary voor de zekerheid
          hasMissingCosts: false,
        };
      }
      
      // Stap 2: Bereken de summary en hasMissingCosts, zoals ook in de originele flow gebeurde.
      const summary = this.calculateSummary(parsedTransactions, params.setupData);
      const hasMissingCosts = this.detectMissingHousingCosts(parsedTransactions, params.setupData);

      // Stap 3: Retourneer het lokale resultaat.
      return {
        status: 'success',
        transactions: parsedTransactions,
        count: parsedTransactions.length,
        summary,
        hasMissingCosts,
      };
    } catch (e) {
      return this.mapError(e);
    }
  }

  // Deze methode is de verplaatste logica uit ResearchOrchestrator.processCsvTransactions
  private parseAndEnrichCsv(rawCsv: string): CsvItem[] {
    if (rawCsv.length === 0 || rawCsv.trim() === '') {
      return [];
    }

    try {
      const rawMapped = csvAdapter.mapToInternalModel(rawCsv);
      const mapped = (rawMapped ?? []) as CsvItem[];

      return mapped.map((item) => {
        const rawDate = item.date ?? '';
        const date = rawDate.length > 0 ? rawDate : new Date().toISOString();
        
        const rawDesc = item.description ?? '';
        const description = dataProcessor.stripPII(
          rawDesc.length > 0 ? rawDesc : 'Geen omschrijving'
        );
        
        return {
          ...item,
          date,
          description,
          category: dataProcessor.categorize(description),
        };
      }).filter((tx) => tx.amount !== 0);
    } catch (e) {
      Logger.error('csv Mapping failed in ImportOrchestrator', e);
      // Gooi de error door zodat de 'try/catch' in processCsvImport hem kan afvangen.
      throw e;
    }
  }

  private calculateSummary(
    transactions: CsvItem[],
    setup: Record<string, unknown> | null,
  ): FinancialIncomeSummary {
    const result = dataProcessor.reconcileWithSetup(
      transactions,
      setup !== null ? setup : {},
    );

    return {
      finalIncome: result.finalIncome,
      source: String(result.source) as 'csv' | 'Setup' | 'none',
      isDiscrepancy: result.isDiscrepancy,
    };
  }
  
  // Deze methode is overgenomen uit de originele ResearchOrchestrator
  private detectMissingHousingCosts(
    transactions: CsvItem[],
    setup: Record<string, unknown> | null,
  ): boolean {
    // Aanname dat de setup een boolean 'housingIncluded' kan bevatten.
    // Dit is consistent met de logica in ResearchOrchestrator.
    const housingIncluded = (setup as ResearchSetupData)?.housingIncluded; 
    return transactions.some(
      (t) => t.category === 'Wonen' && housingIncluded !== true,
    );
  }

  private mapError(e: unknown): LocalImportResult {
    // Gebruikt de bestaande logger, geen console.error
    Logger.error(
      '[ImportOrchestrator] Critical Failure in csv-parsing pipeline:',
      e,
    );
    return {
      status: 'error',
      transactions: [],
      count: 0,
      errorMessage: e instanceof Error ? e.message : 'Fout bij verwerken van CSV',
      summary: EMPTY_SUMMARY,
      hasMissingCosts: false,
    };
  }
}
