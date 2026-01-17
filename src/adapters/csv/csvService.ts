import { parseRawCsv } from '@utils/csvHelper';
import { toCents } from '@domain/helpers/numbers';

export type CsvRow = Record<string, string>;

const normalizeAmount = (raw: string | undefined): number => {
  if (!raw) return 0;

  let value = raw.replace(/\s+/g, '').replace(/€/g, '').replace(/,/g, '.');

  // Remove thousands separators like 1.234.56 -> 1234.56
  value = value.replace(/(\d+)\.(?=\d{3}\b)/g, '$1');

  const num = Number(value);

  return Number.isFinite(num) ? toCents(num) : 0;
};

export const csvService = {
  mapToInternalModel: (rawCsv: string) => {
    const rawRows: CsvRow[] = parseRawCsv(rawCsv) ?? [];

    return rawRows.map((row) => {
      const keys = Object.keys(row ?? {});

      const amountKey = keys.find((k) => /bedrag|amount|transactie/i.test(k));
      const mutationKey = keys.find((k) => /Af.?Bij|Mutatie|tegenrekening/i.test(k));
      const descKey = keys.find((k) => /Naam|Omschrijving|Mededeling|Beschrijving/i.test(k));
      const dateKey = keys.find((k) => /Datum|Boekdatum|date/i.test(k));

      let rawAmount = amountKey ? row[amountKey] : '0';

      const mutationValue =
        mutationKey && typeof row[mutationKey] === 'string' ? row[mutationKey].toLowerCase() : '';

      const isDebit =
        mutationValue.includes('af') ||
        mutationValue.includes('debit') ||
        mutationValue === '-' ||
        mutationValue === 'd';

      if (isDebit && !rawAmount?.startsWith('-')) {
        rawAmount = `-${rawAmount}`;
      }

      const amount = normalizeAmount(rawAmount);

      const description =
        typeof row[descKey ?? ''] === 'string' ? row[descKey as string] : 'Geen omschrijving';

      const date = typeof row[dateKey ?? ''] === 'string' ? row[dateKey as string] : '1970-01-01';

      return {
        amount, // CENTEN, NaN-safe
        description,
        date,
        original: row ?? {},
      };
    });
  },

  processCsvData: (rawCsv: string) => {
    return csvService.mapToInternalModel(rawCsv);
  },
};
