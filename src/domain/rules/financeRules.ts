import {
  FinanceState,
  FinanceItem,
  CONTRACT_VERSION,
} from '@core/types/research';

interface UndoResult {
  id: string;
  amount: number;
  currency: 'EUR';
  reason: string;
  timestamp: string;
  schemaVersion: string;
}

/**
 * Zet één FinanceItem om naar een UndoResult
 */
const mapItemToUndoResult = (item: FinanceItem, kind: 'income' | 'expense'): UndoResult => ({
  id: item.id,
  amount: kind === 'expense' ? -item.amountCents : item.amountCents,
  currency: 'EUR',
  reason: kind,
  timestamp: new Date().toISOString(),
  schemaVersion: CONTRACT_VERSION,
});

/**
 * Map de volledige FinanceState naar een array voor de kernel
 */
export const mapFinanceToUndoResults = (finance: FinanceState): UndoResult[] => [
  ...finance.income.items.map((i) => mapItemToUndoResult(i, 'income')),
  ...finance.expenses.items.map((i) => mapItemToUndoResult(i, 'expense')),
];
