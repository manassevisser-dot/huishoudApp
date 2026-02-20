/**
 * @file_intent Pure transformatie-logica voor financiële data-presentatie.
 * @repo_architecture Mobile Industry (MI) - Business/Presentation Layer.
 * @term_definition PhoenixSummary = De berekende totalen (in centen) uit de domain rules.
 * @contract Stateless. Zet ruwe centen-waarden om naar gelokaliseerde display-strings (ViewModel).
 * @ai_instruction Bevat GEEN business rules (die zitten in @domain/rules). Bevat GEEN state-mutaties.
 */
import { toCents } from '../helpers/numbers';

export interface CSVKeys {
  date: string;
  amount: string;
  description: string;
  mutation?: string;
}

export class CSVProcessor {
  public processRow(row: Record<string, string>, keys: CSVKeys) {
    const rawAmount = row[keys.amount] ?? '0';
    
    // 1. Richting bepalen (Extractie verlaagt complexity)
    const isDebit = this.determineIfDebit(row, keys);

    // 2. Bedrag voorbereiden
    let amountStr = rawAmount;
    if (isDebit && !amountStr.startsWith('-')) {
      amountStr = `-${amountStr}`;
    }

    // 3. Mapping naar domein-model met expliciete checks voor de linter
    return {
      amount: this.normalizeToCents(amountStr),
      description: row[keys.description] ?? 'Geen omschrijving',
      date: row[keys.date] ?? '1970-01-01',
      original: row,
    };
  }

  /**
   * Helper om de linter blij te maken met strikte checks en lagere complexiteit.
   */
  private determineIfDebit(row: Record<string, string>, keys: CSVKeys): boolean {
    if (keys.mutation === undefined || keys.mutation === '') {
      return false;
    }

    const value = (row[keys.mutation] ?? '').toLowerCase();
    if (value === '') {
      return false;
    }

    return (
      value.includes('af') ||
      value.includes('debit') ||
      value === '-' ||
      value === 'd'
    );
  }

  private normalizeToCents(raw: string | undefined | null): number {
    // Strikte check voor null/undefined/empty om linter te pleasen
    if (raw === undefined || raw === null || raw === '') {
      return 0;
    }

    let value = raw.replace(/\s+/g, '').replace(/€/g, '').replace(/,/g, '.');

    // Verwijder duizendtal-punten
    value = value.replace(/(\d+)\.(?=\d{3}\b)/g, '$1');

    const num = Number(value);
    return Number.isFinite(num) ? toCents(num) : 0;
  }
}