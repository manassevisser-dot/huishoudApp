import { dataProcessor } from '@domain/finance/StatementIntakePipeline';

export type ImportFlag =
  | 'missing_date'
  | 'missing_description'
  | 'fallback_category';

export interface ImportedTransactionMeta {
  rawDigest: string;
  schemaVersion: 'csv-v1';
  importedAt: string;
  columnMapVersion: 'v1';
  flags: ReadonlyArray<ImportFlag>;
}

export interface ImportedTransaction {
  id: string;
  fieldId: string;
  amount: number;
  date: string;
  description: string;
  category: string;
  source: 'csv';
  importMeta: ImportedTransactionMeta;
}

// Sluit aan op huidige csv-adapter outputshape.
export interface CsvItemLike {
  amount: number;
  description: string;
  date: string;
}

const FALLBACK_DESCRIPTION = 'Geen omschrijving';
const FALLBACK_CATEGORY = 'Overig';
const SCHEMA_VERSION = 'csv-v1' as const;
const COLUMN_MAP_VERSION = 'v1' as const;

const toDateOnly = (isoLike: string): string => {
  const parsed = new Date(isoLike);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString().split('T')[0];
  }
  return parsed.toISOString().split('T')[0];
};

const normalizeDate = (
  rawDate: string,
  importedAtIso: string,
  flags: ImportFlag[],
): string => {
  const trimmed = rawDate.trim();
  if (trimmed.length === 0) {
    flags.push('missing_date');
    return toDateOnly(importedAtIso);
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    flags.push('missing_date');
    return toDateOnly(importedAtIso);
  }

  return parsed.toISOString().split('T')[0];
};

export class CsvAclMapper {
  /**
   * ImportOrchestrator-achtige variant:
   * - zelfde kernsignatuur als beoogde private methode
   * - expliciete boundary-map naar intern model
   */
  public mapCsvToImportedTransaction(
    row: CsvItemLike,
    index: number,
    importedAtIso: string,
  ): ImportedTransaction | null {
    if (!Number.isFinite(row.amount) || row.amount === 0) {
      return null;
    }

    const flags: ImportFlag[] = [];

    const rawDescription = row.description.trim();
    if (rawDescription.length === 0) {
      flags.push('missing_description');
    }

    const sanitizedDescription = dataProcessor.stripPII(
      rawDescription.length > 0 ? rawDescription : FALLBACK_DESCRIPTION,
    );

    const normalizedDate = normalizeDate(row.date, importedAtIso, flags);

    const categoryCandidate = dataProcessor.categorize(sanitizedDescription).trim();
    const category = categoryCandidate.length > 0 ? categoryCandidate : FALLBACK_CATEGORY;
    if (categoryCandidate.length === 0) {
      flags.push('fallback_category');
    }

    // Original data veilig wegstoppen: alleen canonical digest, nooit het ruwe row-object.
    const canonical = `${normalizedDate}|${row.amount}|${sanitizedDescription}`;
    const rawDigest = this.generateDigest(canonical);

    return {
      id: `csv_${rawDigest.slice(0, 16)}`,
      fieldId: `csv_tx_${rawDigest.slice(0, 12)}_${index}`,
      amount: row.amount,
      date: normalizedDate,
      description: sanitizedDescription,
      category,
      source: 'csv',
      importMeta: {
        rawDigest,
        schemaVersion: SCHEMA_VERSION,
        importedAt: importedAtIso,
        columnMapVersion: COLUMN_MAP_VERSION,
        // Runtime immutable voor extra ACL-hardening.
        flags: Object.freeze([...flags]),
      },
    };
  }

  /**
   * Placeholder voor echte digest implementatie.
   * In productie vervangen door crypto-hash (bijv. sha256) voor stabiele dedupe/audit.
   */
  private generateDigest(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i += 1) {
      hash = (hash << 5) - hash + input.charCodeAt(i);
      hash |= 0;
    }
    const unsigned = hash >>> 0;
    return unsigned.toString(16).padStart(8, '0').repeat(4);
  }
}
