// src/adapters/csv/csvAdapter.ts
/**
 * Vertaalt een ruwe CSV-string naar het interne domeinmodel (CsvItem[]).
 *
 * @module adapters/csv
 * @see {@link ./README.md | CSV Adapter - Details}
 */
import { parseRawCsv } from '@utils/csvHelper';
import { csvProcessor } from '@domain/services/csvProcessor';
import type { csvKeys } from '@domain/services/csvProcessor';

/**
 * Representeert één rij uit een CSV-bestand, vertaald naar het domeinmodel.
 */
export interface CsvItem {
  /** Het bedrag in euro's (float). Conversie naar centen gebeurt later. */
  amountEuros: number;
  /** De omschrijving van de transactie. */
  description: string;
  /** De datum van de transactie (ISO-string). */
  date: string;
  /** Het originele, onbewerkte rij-object uit de CSV. */
  original: Record<string, string>;
}

export const csvAdapter = {
  /**
   * Vertaalt een ruwe CSV-string naar een array van CsvItems.
   *
   * @param rawCsv - De CSV-data als een enkele string.
   * @returns Een array van CsvItem-objecten.
   *
   * @example
   * const csvData = "Datum,Bedrag\n2023-01-01,10.50";
   * const items = csvAdapter.mapToInternalModel(csvData);
   * console.log(items[0].amountEuros); // 10.5
   */
  mapToInternalModel: (rawCsv: string): CsvItem[] => {
    const processor = new csvProcessor();
    const rawRows = (parseRawCsv(rawCsv) ?? []) as Record<string, string>[];

    return rawRows.map((row): CsvItem => {
      const keys = Object.keys(row ?? {});

      // Helper om de juiste kolomkop te vinden op basis van een regex-patroon.
      const findKey = (pattern: RegExp): string => {
        const found = keys.find((k) => pattern.test(k));
        return found ?? '';
      };

      // Detecteert de meest waarschijnlijke kolomkoppen voor essentiële velden.
      const detectedKeys: csvKeys = {
        amount: findKey(/bedrag|amount/i),
        mutation: findKey(/Af.?Bij|Mutatie|tegenrekening/i),
        description: findKey(/Naam|Omschrijving|Mededeling|Beschrijving/i),
        date: findKey(/Datum|Boekdatum|date/i),
      };

      return processor.processRow(row, detectedKeys) as CsvItem;
    });
  },

  /**
   * Alias voor `mapToInternalModel` voor compatibiliteit met oudere code.
   *
   * @param rawCsv - De CSV-data als een enkele string.
   * @returns Een array van CsvItem-objecten.
   * @deprecated Gebruik `mapToInternalModel` direct.
   */
  processCsvData: (rawCsv: string): CsvItem[] => {
    return csvAdapter.mapToInternalModel(rawCsv);
  },
};
