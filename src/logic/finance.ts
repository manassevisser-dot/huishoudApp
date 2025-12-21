// WAI-004C — Finance kernel (contextuele tekenlogica; minor units)
// -------------------------------------------------------
import { parseToCents } from '../utils/numbers';

export type IncomeItem = {
  id: string;
  amount: number; /* cents, altijd positief */
};

export type ExpenseItem = {
  id: string;
  amount: number; /* cents, altijd positief */
};

/** * Compat-loader: normaliseert oude waarden naar positieve centen.
 * Gebruikt Math.abs voor numbers om de non-negative policy te waarborgen.
 */
export function normalizeToCents(value: unknown): number {
  if (typeof value === 'number') {
    const abs = Math.abs(value);
    // Heuriek: als het geen integer is, behandel als euro's -> centen
    if (!Number.isInteger(value)) return Math.round(abs * 100);
    // Als het een klein getal is (geen 0), waarschijnlijk ook euro's
    if (abs < 100 && abs !== 0) return Math.round(abs * 100);
    return Math.round(abs); // Reeds centen
  }
  if (typeof value === 'string') {
    // De parser uit WAI-004A negeert al minus-tekens
    return parseToCents(value);
  }
  return 0;
}

/** Inkomsten normaliseren naar centen [cite: 58] */
export function normalizeIncome(items: Array<any>): IncomeItem[] {
  return (items ?? []).map((it) => ({
    id: String(it.id ?? ''),
    amount: normalizeToCents(it.amount ?? it.value ?? 0),
  }));
}

/** Uitgaven normaliseren naar centen [cite: 59] */
export function normalizeExpenses(items: Array<any>): ExpenseItem[] {
  return (items ?? []).map((it) => ({
    id: String(it.id ?? ''),
    amount: normalizeToCents(it.amount ?? it.value ?? 0),
  }));
}

export function sumIncomeCents(items: IncomeItem[]): number {
  return items.reduce((acc, it) => acc + (it.amount || 0), 0);
}

export function sumExpensesCents(items: ExpenseItem[]): number {
  return items.reduce((acc, it) => acc + (it.amount || 0), 0);
}

/** * De kern-formule: tekenlogica is contextueel[cite: 62].
 * Netto = som van inkomsten (pos) minus som van uitgaven (pos).
 */
export function computeNetCents(income: IncomeItem[], expenses: ExpenseItem[]): number {
  return sumIncomeCents(income) - sumExpensesCents(expenses);
}

/** Totaaloverzicht voor de UI [cite: 63, 64] */
export function computeSummary(incomeRaw: Array<any>, expenseRaw: Array<any>) {
  const income = normalizeIncome(incomeRaw);
  const expenses = normalizeExpenses(expenseRaw);

  return {
    totalIncome: sumIncomeCents(income),
    totalExpenses: sumExpensesCents(expenses),
    net: computeNetCents(income, expenses),
  };
}
