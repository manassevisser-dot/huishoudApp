
/**
 * @file_intent Converteert een CSV-string naar lokaal bruikbare transactie-objecten.
 * @repo_architecture Mobile Industry (MI) - Data Ingestion Layer.
 * @term_definition PII (Personally Identifiable Information) = Persoonlijke data die uit beschrijvingen wordt gefilterd.
 * @contract Stateless Transformer. Deze klasse is enkel verantwoordelijk voor het parsen, opschonen en verrijken van CSV-data voor lokaal gebruik. Het heeft geen kennis van andere orchestrators of externe processen zoals 'research'.
 * @ai_instruction De logica hier is een directe verplaatsing van de logica uit de originele ResearchOrchestrator.
 */

import type { 
  FinancialIncomeSummary, 
  CsvItem as ImportCsvItem,
} from '@core/types/research';
import { dataProcessor, type ResearchSetupData } from '@domain/finance/StatementIntakePipeline';
import { 
  csvAdapter,
  type CsvItem as AdapterCsvItem,
} from '@adapters/csv/csvAdapter';
import { Logger } from '@adapters/audit/AuditLoggerAdapter';
import { toCents } from '@domain/helpers/numbers';

/* -------------------------------------------------------------------------- */
/*                               MODULE CONSTANTS                              */
/* -------------------------------------------------------------------------- */

type ImportFlag = 'missing_date' | 'missing_description' | 'fallback_category';

const IMPORT_FALLBACK_DESCRIPTION = 'Geen omschrijving';
const IMPORT_FALLBACK_CATEGORY = 'Overig';
const IMPORT_SCHEMA_VERSION = 'csv-v1';
const IMPORT_COLUMN_MAP_VERSION = 'v1';


type ImportSetupData = Readonly<
  Pick<ResearchSetupData, 'maandelijksInkomen' | 'housingIncluded'>
>;

// Magic number replacements
const DIGEST_RADIX_HEX = 16;
const DIGEST_ID_SLICE = 16;
const DIGEST_FIELD_SLICE = 12;
const HASH_SHIFT = 5;
const DIGEST_PAD_LENGTH = 8;
const DIGEST_REPEAT_COUNT = 4;

/* -------------------------------------------------------------------------- */
/*                               RESULT INTERFACE                              */
/* -------------------------------------------------------------------------- */

export interface LocalImportResult {
  status: 'success' | 'empty' | 'error';
  transactions: ImportCsvItem[];
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

/* -------------------------------------------------------------------------- */
/*                           IMPORT ORCHESTRATOR CLASS                         */
/* -------------------------------------------------------------------------- */
interface ImportedTransactionBuildParams {
  row: AdapterCsvItem;
  index: number;
  importedAtIso: string;
  normalizedDate: string;
  sanitizedDescription: string;
  category: string;
  flags: ReadonlyArray<ImportFlag>;
  rawDigest: string;
}


export class ImportOrchestrator {
  constructor() {}

  public processCsvImport(params: {
    csvText: string;
    setupData: ImportSetupData | null;
  }): LocalImportResult {
    try {
      const parsedTransactions = this.parseAndEnrichCsv(params.csvText);

      if (parsedTransactions.length === 0) {
        return {
          status: 'empty',
          transactions: [],
          count: 0,
          summary: this.calculateSummary([], params.setupData),
          hasMissingCosts: false,
        };
      }

      const summary = this.calculateSummary(parsedTransactions, params.setupData);
      const hasMissingCosts = this.detectMissingHousingCosts(parsedTransactions, params.setupData);

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

  /* -------------------------------------------------------------------------- */
  /*                        CSV PARSING & ENRICHMENT                            */
  /* -------------------------------------------------------------------------- */

  private parseAndEnrichCsv(rawCsv: string): ImportCsvItem[] {
    if (rawCsv.trim().length === 0) {
      return [];
    }

    try {
      
      const mapped: AdapterCsvItem[] = csvAdapter.mapToInternalModel(rawCsv) ?? [];
      const importedAtIso = new Date().toISOString();

      return mapped
        .map((row, index) => this.mapCsvToImportedTransaction(row, index, importedAtIso))
        .filter((tx): tx is ImportCsvItem => tx !== null);
    } catch (e) {
      Logger.error('csv Mapping failed in ImportOrchestrator', e);
      throw e;
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                               SUMMARY LOGIC                                */
  /* -------------------------------------------------------------------------- */

  private calculateSummary(
    transactions: ImportCsvItem[],
    setup: ImportSetupData | null,
  ): FinancialIncomeSummary {
    const result = dataProcessor.reconcileWithSetup(
      transactions,
      setup ?? {},
    );

    return {
      finalIncome: result.finalIncome,
      source: String(result.source) as 'csv' | 'Setup' | 'none',
      isDiscrepancy: result.isDiscrepancy,
    };
  }

  private detectMissingHousingCosts(
    transactions: ImportCsvItem[],
    setup: ImportSetupData | null,
  ): boolean {
    const housingIncluded = (setup as ResearchSetupData)?.housingIncluded;
    return transactions.some(
      (t) => t.category === 'Wonen' && housingIncluded !== true,
    );
  }

  private mapError(e: unknown): LocalImportResult {
    Logger.error('[ImportOrchestrator] Critical Failure in csv-parsing pipeline:', e);

    return {
      status: 'error',
      transactions: [],
      count: 0,
      errorMessage: e instanceof Error ? e.message : 'Fout bij verwerken van CSV',
      summary: EMPTY_SUMMARY,
      hasMissingCosts: false,
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                          IMPORT MAPPING HELPERS                            */
  /* -------------------------------------------------------------------------- */
private mapCsvToImportedTransaction(
  row: AdapterCsvItem,
  index: number,
  importedAtIso: string,
): ImportCsvItem | null {
  if (!this.isValidAmount(row.amount)) {
    return null;
  }

  const flags: ImportFlag[] = [];

  const sanitizedDescription = this.resolveDescription(row.description, flags);
  const normalizedDate = this.normalizeImportedDate(row.date ?? '', importedAtIso, flags);
  const category = this.resolveCategory(sanitizedDescription, flags);

  const canonical = `${normalizedDate}|${row.amount}|${sanitizedDescription}`;
  const rawDigest = this.generateImportDigest(canonical);

  return this.buildImportedTransaction({
  row,
  index,
  importedAtIso,
  normalizedDate,
  sanitizedDescription,
  category,
  flags: Object.freeze([...flags]),
  rawDigest,
});

}

  /* ------------------------------- Sub-helpers ------------------------------ */

private buildImportedTransaction(params: ImportedTransactionBuildParams): ImportCsvItem {
  const {
    row,
    index,
    importedAtIso,
    normalizedDate,
    sanitizedDescription,
    category,
    flags,
    rawDigest,
  } = params;

  return {
    id: `csv_${rawDigest.slice(0, DIGEST_ID_SLICE)}`,
    fieldId: `csv_tx_${rawDigest.slice(0, DIGEST_FIELD_SLICE)}_${index}`,
    amount: row.amount,
    amountCents: toCents(row.amount),
    date: normalizedDate,
    description: sanitizedDescription,
    category,
    isIgnored: false,
    original: {
      rawDigest,
      schemaVersion: IMPORT_SCHEMA_VERSION,
      importedAt: importedAtIso,
      columnMapVersion: IMPORT_COLUMN_MAP_VERSION,
      flags,
    },
  };
}

  private isValidAmount(amount: number | undefined): boolean {
    return Number.isFinite(amount) && amount !== 0;
  }

  private resolveDescription(raw: string | undefined, flags: ImportFlag[]): string {
    const trimmed = typeof raw === 'string' ? raw.trim() : '';

    if (trimmed.length === 0) {
      flags.push('missing_description');
    }

    return dataProcessor.stripPII(
      trimmed.length > 0 ? trimmed : IMPORT_FALLBACK_DESCRIPTION,
    );
  }

  private resolveCategory(description: string, flags: ImportFlag[]): string {
    const candidate = dataProcessor.categorize(description).trim();

    if (candidate.length === 0) {
      flags.push('fallback_category');
      return IMPORT_FALLBACK_CATEGORY;
    }

    return candidate;
  }

  private normalizeImportedDate(
    rawDate: string,
    importedAtIso: string,
    flags: ImportFlag[],
  ): string {
    const trimmed = rawDate.trim();

    if (trimmed.length === 0) {
      flags.push('missing_date');
      return this.toDateOnly(importedAtIso);
    }

    const parsed = new Date(trimmed);
    if (Number.isNaN(parsed.getTime())) {
      flags.push('missing_date');
      return this.toDateOnly(importedAtIso);
    }

    return parsed.toISOString().split('T')[0];
  }

  private toDateOnly(isoLike: string): string {
    const parsed = new Date(isoLike);
    if (Number.isNaN(parsed.getTime())) {
      return new Date().toISOString().split('T')[0];
    }
    return parsed.toISOString().split('T')[0];
  }

  private generateImportDigest(input: string): string {
    let hash = 0;

    for (let i = 0; i < input.length; i += 1) {
      hash = (hash << HASH_SHIFT) - hash + input.charCodeAt(i);
      hash |= 0;
    }

    const unsigned = hash >>> 0;

    return unsigned
      .toString(DIGEST_RADIX_HEX)
      .padStart(DIGEST_PAD_LENGTH, '0')
      .repeat(DIGEST_REPEAT_COUNT);
  }
}
