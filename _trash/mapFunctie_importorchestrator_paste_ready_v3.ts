/**
 * Paste-ready v3 voor ImportOrchestrator.
 *
 * Benodigde imports in ImportOrchestrator.ts:
 * - import type { CsvItem } from '@core/types/research';
 * - import { toCents } from '@domain/helpers/numbers';
 * - import { dataProcessor } from '@domain/finance/StatementIntakePipeline';
 *
 * Gebruik in parse-flow:
 * const importedAtIso = new Date().toISOString();
 * return mapped
 *   .map((row, index) => this.mapCsvToImportedTransaction(row, index, importedAtIso))
 *   .filter((tx): tx is CsvItem => tx !== null);
 */

private mapCsvToImportedTransaction(
  row: CsvItem,
  index: number,
  importedAtIso: string,
): CsvItem | null {
  // Amount is required and must be finite; 0-transacties worden gedropt.
  if (!Number.isFinite(row.amount) || row.amount === 0) {
    return null;
  }

  const flags: ImportFlag[] = [];

  const rawDescription = typeof row.description === 'string' ? row.description.trim() : '';
  if (rawDescription.length === 0) {
    flags.push('missing_description');
  }

  // PII gebeurt centraal hier in de ACL-map.
  const sanitizedDescription = dataProcessor.stripPII(
    rawDescription.length > 0 ? rawDescription : IMPORT_FALLBACK_DESCRIPTION,
  );

  const rawDate = typeof row.date === 'string' ? row.date.trim() : '';
  const normalizedDate = this.normalizeImportedDate(rawDate, importedAtIso, flags);

  const categoryCandidate = dataProcessor.categorize(sanitizedDescription).trim();
  const category = categoryCandidate.length > 0 ? categoryCandidate : IMPORT_FALLBACK_CATEGORY;
  if (categoryCandidate.length === 0) {
    flags.push('fallback_category');
  }

  // Veilig "original": geen ruwe row, alleen digest + minimale auditmeta.
  const canonical = `${normalizedDate}|${row.amount}|${sanitizedDescription}`;
  const rawDigest = this.generateImportDigest(canonical);

  const frozenFlags: ReadonlyArray<ImportFlag> = Object.freeze([...flags]);

  return {
    id: `csv_${rawDigest.slice(0, 16)}`,
    fieldId: `csv_tx_${rawDigest.slice(0, 12)}_${index}`,
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
      flags: frozenFlags,
    },
  };
}

private normalizeImportedDate(
  rawDate: string,
  importedAtIso: string,
  flags: ImportFlag[],
): string {
  if (rawDate.length === 0) {
    flags.push('missing_date');
    return this.toDateOnly(importedAtIso);
  }

  const parsed = new Date(rawDate);
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
  // Lightweight deterministic hash (vervangbaar door crypto SHA-256 als gewenst).
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  const unsigned = hash >>> 0;
  return unsigned.toString(16).padStart(8, '0').repeat(4);
}

// Plaats deze constants op class-level (private static/readonly) of module-level.
type ImportFlag = 'missing_date' | 'missing_description' | 'fallback_category';

const IMPORT_FALLBACK_DESCRIPTION = 'Geen omschrijving';
const IMPORT_FALLBACK_CATEGORY = 'Overig';
const IMPORT_SCHEMA_VERSION = 'csv-v1';
const IMPORT_COLUMN_MAP_VERSION = 'v1';
