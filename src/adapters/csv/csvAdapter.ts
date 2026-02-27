// src/adapters/csv/csvAdapter.ts
/**
 * @file_intent Vertaalt ruwe csv-string data naar het interne domeinmodel van de applicatie.
 * @repo_architecture Mobile Industry (MI) - Adapter Layer (Infrastructure).
 * @term_definition detectedKeys = Mapping van csv-kolomnamen naar domein-begrippen (amount, date, etc.).
 * @contract Verantwoordelijk voor I/O transformatie en kolomdetectie. Delegeert de feitelijke business-logica voor data-verwerking aan de csvProcessor.
 * @ai_instruction Gebruikt regex-patronen voor flexibele kolomdetectie. Garandeert non-nullable string outputs voor de processor om type-errors te voorkomen.
 */
import { parseRawCsv } from '@utils/csvHelper';
import { csvProcessor } from '@domain/services/csvProcessor';
import type { csvKeys } from '@domain/services/csvProcessor'; 

export interface CsvItem {
  /** Bedrag in euros (float). toCents() gebeurt in ImportOrchestrator. */
  amountEuros: number;
  description: string;
  date: string;
  original: Record<string, string>;
}

export const csvAdapter = {
  /**
   * Vertaalt ruwe csv-string naar een array van CsvItems.
   */
  mapToInternalModel: (rawCsv: string): CsvItem[] => {
    const processor = new csvProcessor();
    
    // Stap 1: Cast naar Record<string, string>[] om unsafe assignments te voorkomen
    const rawRows = (parseRawCsv(rawCsv) ?? []) as Record<string, string>[];

    // Stap 2: Geef expliciet het return type CsvItem op voor de map-functie
    return rawRows.map((row): CsvItem => {
      const keys = Object.keys(row ?? {});

      const findKey = (pattern: RegExp): string => {
        const found = keys.find((k) => pattern.test(k));
        return found !== undefined ? found : '';
      };

      const detectedKeys: csvKeys = {
        // 'transactie' verwijderd: matcht 'Transactiesoort' (ABN AMRO) vóór 'Bedrag' → amount = 0
        amount: findKey(/bedrag|amount/i),
        mutation: findKey(/Af.?Bij|Mutatie|tegenrekening/i),
        description: findKey(/Naam|Omschrijving|Mededeling|Beschrijving/i),
        date: findKey(/Datum|Boekdatum|date/i)
      };

      // Stap 3: Cast de aanroep naar CsvItem om 'unresolved type' errors te killen
      return processor.processRow(row, detectedKeys) as CsvItem;
    });
  },

  /**
   * Alias voor compatibiliteit.
   */
  processCsvData: (rawCsv: string): CsvItem[] => {
    return csvAdapter.mapToInternalModel(rawCsv);
  },
};