import { toCents } from '@domain/helpers/numbers';

export type SetupData = {
  maandelijksInkomen?: number; // in euro (wordt naar centen geconverteerd)
  housingIncluded?: boolean;
};

export type CsvItem = {
  amount: number; // in CENTEN (van csvService)
  description: string;
  date: string;
  original: Record<string, unknown>;
  category?: string;
};

export const dataProcessor = {
  // A. Strip IBAN (PII-vrij maken)
  stripPII: (description: string): string => {
    const ibanRegex = /\b[A-Z]{2}\d{2}[A-Z0-9]{4}\d{7,}\b/gi;
    return description.replace(ibanRegex, 'NL** [REDACTED]');
  },

  // B. Categoriseren (uitgebreid + veilig)
  categorize: (description: string): string => {
    const desc = description.toLowerCase();

    if (desc.includes('huur') || desc.includes('hypotheek') || desc.includes('woon'))
      return 'Wonen';

    if (
      desc.includes('zorg') ||
      desc.includes('zilveren') ||
      desc.includes('vgz') ||
      desc.includes('cz')
    )
      return 'Zorgverzekering';

    if (
      desc.includes('supermarkt') ||
      desc.includes('ah ') ||
      desc.includes('jumbo') ||
      desc.includes('lidl')
    )
      return 'Boodschappen';

    if (desc.includes('salaris') || desc.includes('loon') || desc.includes('stipendium'))
      return 'Inkomen';

    return 'Overig';
  },

  // C. Inkomens- & Lasten-vergelijking (type-safe + diff + NaN-proof)
  reconcileWithSetup: (csvData: CsvItem[], setupData: SetupData) => {
    const THRESHOLD_CENTS = 5000; // €50

    const csvIncome = csvData
      .filter((d) => dataProcessor.categorize(d.description) === 'Inkomen')
      .reduce((acc, curr) => acc + (Number.isFinite(curr.amount) ? curr.amount : 0), 0);

    const setupIncomeCents = toCents(setupData.maandelijksInkomen ?? 0);

    const finalIncome = csvIncome > 0 ? csvIncome : setupIncomeCents;
    const source = csvIncome > 0 ? 'CSV' : 'Setup';

    const diff = csvIncome - setupIncomeCents;

    const isDiscrepancy = csvIncome > 0 && Math.abs(diff) > THRESHOLD_CENTS;

    return { finalIncome, source, isDiscrepancy, diff };
  },
};
