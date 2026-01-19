import { toCents } from '../helpers/numbers'; // Aangepast naar jouw mappenstructuur

export interface CSVKeys {
  date: string;
  amount: string;
  description: string;
  mutation?: string; // Voor Af/Bij kolommen
}

export class CSVProcessor {
  /**
   * Transformeert een ruwe rij naar het interne domein-model.
   * Dit is de "Single Source of Truth" voor hoe we bankdata interpreteren.
   */
  public processRow(row: Record<string, string>, keys: CSVKeys) {
    const rawAmount = row[keys.amount] || '0';
    const mutationValue = keys.mutation ? (row[keys.mutation] || '').toLowerCase() : '';
    
    // 1. Business Rule: Bepaal of het een afschrijving (debit) is
    // We behouden de flexibele 'includes' logica van de originele baseline
    const isDebit = 
      mutationValue.includes('af') || 
      mutationValue.includes('debit') || 
      mutationValue === '-' || 
      mutationValue === 'd';

    // 2. Voorbereiden van de raw string (teken toevoegen indien nodig)
    let processedAmountStr = rawAmount;
    if (isDebit && !processedAmountStr.startsWith('-')) {
      processedAmountStr = `-${processedAmountStr}`;
    }

    // 3. Invariant: Altijd omzetten naar centen (integer) en NaN-safe
    const amountInCents = this.normalizeToCents(processedAmountStr);

    // 4. Mapping naar domein-model
    return {
      amount: amountInCents,
      description: row[keys.description] || 'Geen omschrijving',
      date: row[keys.date] || '1970-01-01',
      original: row, // Bewaar bron voor audit-doeleinden
    };
  }

  /**
   * PRIVATE HELPER: De robuuste normalisatie-logica
   */
  private normalizeToCents(raw: string | undefined): number {
    if (!raw) return 0;

    // Opschonen: spaties en valuta-tekens weg
    let value = raw.replace(/\s+/g, '').replace(/€/g, '').replace(/,/g, '.');

    // DE KRITIEKE REGEX: Verwijder alleen punten die als duizendtal-separator dienen (bijv. 1.234.56 -> 1234.56)
    // Dit voorkomt dat we de echte decimale punt per ongeluk slopen.
    value = value.replace(/(\d+)\.(?=\d{3}\b)/g, '$1');

    const num = Number(value);

    // Invariant check: als het geen geldig getal is, dwingen we 0 af (NaN-protection)
    return Number.isFinite(num) ? toCents(num) : 0;
  }
}