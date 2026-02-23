// src/app/orchestrators/ImportOrchestrator.ts
/**
 * @file_intent Converteert een CSV-string naar ACL-cleaned ParsedCsvTransaction objecten.
 * @repo_architecture Mobile Industry (MI) - Data Ingestion Layer (ACL Boundary).
 * @term_definition
 *   ACL (Anti-Corruption Layer) = De gecontroleerde grens tussen ruwe bankdata en het domeinmodel.
 *   PII (Personally Identifiable Information) = Persoonlijke data die uit beschrijvingen wordt gefilterd.
 * @contract
 *   processCsvImport(csvText: string): CsvParseResult
 *   Stateless transformer. Geen setupData, geen reconciliatie, geen business-logica.
 *   Parse → strip PII → normaliseer datum → categoriseer → retourneer ParsedCsvTransaction[].
 * @ai_instruction
 *   setupData is VOLLEDIG verwijderd — CSV-data is géén wizard-setup-data.
 *   summary en hasMissingCosts zijn VERWIJDERD — horen in CsvAnalysisService (Fase 6).
 *   Return type is CsvParseResult (discriminated union: success | empty | error).
 *   De analyse (reconcile vs setup) gebeurt in CsvAnalysisService, niet hier.
 * @changes [Fase 3+8] processCsvImport({ csvText, setupData }) → processCsvImport(csvText: string).
 *   LocalImportResult verwijderd. Return type is nu CsvParseResult uit csvUpload.types.ts.
 *   calculateSummary() verwijderd — hoort in CsvAnalysisService.
 *   detectMissingHousingCosts() verwijderd — hoort in CsvAnalysisService.
 */

import type { CsvParseResult, ParsedCsvTransaction } from '@app/orchestrators/types/csvUpload.types';
import { dataProcessor } from '@domain/finance/StatementIntakePipeline';
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

// Magic number replacements
const DIGEST_RADIX_HEX = 16;
const DIGEST_ID_SLICE = 16;
const DIGEST_FIELD_SLICE = 12;
const HASH_SHIFT = 5;
const DIGEST_PAD_LENGTH = 8;
const DIGEST_REPEAT_COUNT = 4;

/* -------------------------------------------------------------------------- */
/*                           BUILD PARAMS TYPE                                 */
/* -------------------------------------------------------------------------- */

interface TransactionBuildParams {
  row: AdapterCsvItem;
  index: number;
  importedAtIso: string;
  normalizedDate: string;
  sanitizedDescription: string;
  category: string;
  flags: ReadonlyArray<ImportFlag>;
  rawDigest: string;
}

/* -------------------------------------------------------------------------- */
/*                           IMPORT ORCHESTRATOR CLASS                         */
/* -------------------------------------------------------------------------- */

export class ImportOrchestrator {
  /**
   * Converteert ruwe CSV-tekst naar ACL-cleaned transacties.
   *
   * @param csvText - Ruwe CSV-tekst van de gebruiker (UTF-8).
   * @returns CsvParseResult — success met ParsedCsvTransaction[], empty of error.
   */
  public processCsvImport(csvText: string): CsvParseResult {
    try {
      const transactions = this.parseAndEnrichCsv(csvText);

      if (transactions.length === 0) {
        return {
          status: 'empty',
          message: 'Geen verwerkte transacties gevonden in het CSV-bestand.',
        };
      }

      return {
        status: 'success',
        transactions,
        metadata: {
          parsedCount: transactions.length,
          skippedCount: 0, // TODO: bijhouden in parseAndEnrichCsv
        },
      };
    } catch (e: unknown) {
      Logger.error('[ImportOrchestrator] Critical failure in CSV-parsing pipeline:', e);
      return {
        status: 'error',
        errorMessage: e instanceof Error ? e.message : 'Fout bij verwerken van CSV',
        technicalDetails: {
          errorCode: 'PARSING_ERROR',
          originalError: e,
        },
      };
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                        CSV PARSING & ENRICHMENT                            */
  /* -------------------------------------------------------------------------- */

  private parseAndEnrichCsv(rawCsv: string): ParsedCsvTransaction[] {
    if (rawCsv.trim().length === 0) {
      return [];
    }

    const mapped: AdapterCsvItem[] = csvAdapter.mapToInternalModel(rawCsv) ?? [];
    const importedAtIso = new Date().toISOString();

    return mapped
      .map((row, index) => this.mapToParsedTransaction(row, index, importedAtIso))
      .filter((tx): tx is ParsedCsvTransaction => tx !== null);
  }

  /* -------------------------------------------------------------------------- */
  /*                          TRANSACTION MAPPING                               */
  /* -------------------------------------------------------------------------- */

  private mapToParsedTransaction(
    row: AdapterCsvItem,
    index: number,
    importedAtIso: string,
  ): ParsedCsvTransaction | null {
    if (!this.isValidAmount(row.amountEuros)) {
      return null;
    }

    const flags: ImportFlag[] = [];

    const sanitizedDescription = this.resolveDescription(row.description, flags);
    const normalizedDate = this.normalizeDate(row.date ?? '', importedAtIso, flags);
    const category = this.resolveCategory(sanitizedDescription, flags);

    const canonical = `${normalizedDate}|${row.amountEuros}|${sanitizedDescription}`;
    const rawDigest = this.generateDigest(canonical);

    return this.buildTransaction({
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

  private buildTransaction(params: TransactionBuildParams): ParsedCsvTransaction {
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
      amount: row.amountEuros,
      amountCents: toCents(row.amountEuros),
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

  /* -------------------------------------------------------------------------- */
  /*                               HELPERS                                      */
  /* -------------------------------------------------------------------------- */

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

  private normalizeDate(
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

  private generateDigest(input: string): string {
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
