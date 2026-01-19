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
      // 1. Zoek de juiste kolommen (Heuristiek blijft in de adapter)
      const keys = Object.keys(row ?? {});
      
      const detectedKeys: CSVKeys = {
        amount: keys.find((k) => /bedrag|amount|transactie/i.test(k)) || '',
        mutation: keys.find((k) => /Af.?Bij|Mutatie|tegenrekening/i.test(k)),
        description: keys.find((k) => /Naam|Omschrijving|Mededeling|Beschrijving/i.test(k)) || '',
        date: keys.find((k) => /Datum|Boekdatum|date/i.test(k)) || ''
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