import { parseRawCsv } from '@utils/csvHelper';
import { CSVProcessor, CSVKeys } from '@domain/services/CSVProcessor';

export const CSVAdapter = {
  /**
   * De Adapter is alleen verantwoordelijk voor het 'vinden' van de data
   */
  mapToInternalModel: (rawCsv: string) => {
    const processor = new CSVProcessor();
    const rawRows = parseRawCsv(rawCsv) ?? [];

    return rawRows.map((row) => {
      const keys = Object.keys(row ?? {});

      // Helper om undefined resultaten van .find() expliciet om te zetten naar een string
      // Dit lost de "Unexpected nullable string value" waarschuwingen op.
      const findKey = (pattern: RegExp): string => {
        const found = keys.find((k) => pattern.test(k));
        return found !== undefined ? found : '';
      };

      const detectedKeys: CSVKeys = {
        amount: findKey(/bedrag|amount|transactie/i),
        // Fix: ook mutation moet een string zijn, geen undefined
        mutation: findKey(/Af.?Bij|Mutatie|tegenrekening/i),
        description: findKey(/Naam|Omschrijving|Mededeling|Beschrijving/i),
        date: findKey(/Datum|Boekdatum|date/i)
      };

      // 2. Delegeer alle berekeningen en transformaties naar de Processor
      return processor.processRow(row, detectedKeys);
    });
  },

  // Alias voor compatibiliteit met bestaande code
  processCsvData: (rawCsv: string) => {
    return CSVAdapter.mapToInternalModel(rawCsv);
  },
};