// src/app/orchestrators/ImportOrchestrator.ts
/**
 * @file_intent Coördineert de verwerking van externe CSV-data naar interne modellen.
 * @repo_architecture Mobile Industry (MI) - Data Ingestion Layer.
 * @term_definition ResearchProcessor = De interface voor de zware domein-logica (vaak anonieme opslag).
 * @contract Stateless regisseur. Transformeert ruwe input naar een ImportResult. Delegeert PII-filtering en categorisatie aan de StatementIntakePipeline.
 * @ai_instruction Zorg dat de scheiding tussen 'local' (UI) en 'research' data strikt gehandhaafd blijft.
 */

import type { Member } from '@core/types/core';
import type { ImportResult, ResearchProcessor } from './interfaces/IDataOrchestrator';
import type { FinancialIncomeSummary, CsvItem } from '@core/types/research';
import { dataProcessor } from '@domain/finance/StatementIntakePipeline.WIP';

const EMPTY_SUMMARY: FinancialIncomeSummary = {
  source: 'none',
  finalIncome: 0,
  isDiscrepancy: false
};

/**
 * IMPORT ORCHESTRATOR
 * Regisseert de stroom van CSV naar twee bestemmingen:
 * 1. UI (via lokale verwerking voor direct resultaat)
 * 2. ONDERZOEK (via de ResearchProcessor voor geanonimiseerde opslag)
 */
export class ImportOrchestrator {
  constructor() {}

  public processCsvImport(
    research: ResearchProcessor,
    params: { csvText: string; members: Member[]; setupData: Record<string, unknown> | null }
  ): ImportResult {
    try {
      const { local, research: resData } = research.processAllData(
        params.members,
        params.csvText,
        params.setupData
      );

      const enriched = this.enrichTransactions(local.finance.transactions ?? []);
      const summary = this.calculateSummary(enriched, params.setupData);

      if (enriched.length === 0) {
        return this.buildEmptyResult(summary, resData);
      }

      return {
        status: 'success',
        transactions: enriched,
        count: enriched.length,
        summary,
        researchData: resData,
        hasMissingCosts: local.finance.hasMissingCosts ?? false
      };
    } catch (e) {
      return this.mapError(e);
    }
  }

  private enrichTransactions(transactions: CsvItem[]): CsvItem[] {
    return transactions.map(tx => ({
      ...tx,
      category: dataProcessor.categorize(tx.description),
      description: dataProcessor.stripPII(tx.description)
    }));
  }

  private calculateSummary(transactions: CsvItem[], setup: Record<string, unknown> | null): FinancialIncomeSummary {
    const result = dataProcessor.reconcileWithSetup(transactions, setup !== null ? setup : {});
    
    return {
      finalIncome: result.finalIncome,
      source: String(result.source) as 'CSV' | 'Setup' | 'none', // Expliciet type i.p.v. any
      isDiscrepancy: result.isDiscrepancy
    };
  }

  private buildEmptyResult(
    summary: FinancialIncomeSummary, 
    researchData: Record<string, unknown>
  ): ImportResult {
    return {
      status: 'empty',
      transactions: [],
      count: 0,
      summary,
      researchData,
      hasMissingCosts: false
    };
  }

  private mapError(e: unknown): ImportResult {
    console.error('[ImportOrchestrator] Critical Failure in CSV-Research Pipeline:', e);
    return {
      status: 'error',
      transactions: [],
      count: 0,
      errorMessage: e instanceof Error ? e.message : 'Fout in Onderzoeks-verwerking',
      summary: EMPTY_SUMMARY,
      researchData: {},
      hasMissingCosts: false
    };
  }
}