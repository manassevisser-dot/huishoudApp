/**
 * Tests voor mapFinanceToUndoResults (kernel mapping).
 *
 * We mocken @core/types/research om:
 *  - CONTRACT_VERSION deterministisch te maken,
 *  - minimale types te leveren (alleen de velden die de mapper gebruikt),
 *  - dependency op externe typebundels te vermijden.
 */

import { jest } from '@jest/globals';

// 1) Mock het research-types module met een minimale, maar compatibele shape
jest.mock('@core/types/research', () => {
  // Minimale interfaces/typen + constante die de mapper nodig heeft
  return {
    CONTRACT_VERSION: 'v9.9.9',
    // NB: Types bestaan alleen voor TS; op runtime gebruiken we de shape.
    // We exporteren ze als lege functies/constructors om import te laten werken in TS/Jest.
    // Voor runtime checks is alleen de data-shape relevant.
  };
});

// 2) Nu pas de mapper importeren, zodat hij de mock gebruikt
import { mapFinanceToUndoResults } from './financeRules';

// 3) Voor TypeScript: definieer lokale testtypes die overeenkomen met wat de mapper leest
type FinanceItem = {
  id: string;
  amountCents: number;
  // overige velden mogen bestaan, maar zijn voor deze tests irrelevant
  category?: string;
  amount?: number;
  value?: number;
};

type FinanceState = {
  income: { items: FinanceItem[] };
  expenses: { items: FinanceItem[] };
};

type UndoResult = {
  id: string;
  amount: number;
  currency: 'EUR';
  reason: 'income' | 'expense';
  timestamp: string;
  schemaVersion: string;
};

describe('mapFinanceToUndoResults (kernel mapping)', () => {
  // Maak timestamps deterministisch
  const FIXED_DATE_ISO = '2025-01-02T12:34:56.000Z';

  beforeAll(() => {
    jest.useFakeTimers({ now: new Date(FIXED_DATE_ISO) });
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('mapt income als positief bedrag en expenses als negatief bedrag; set currency/reason/schema/timestamp', () => {
    // Arrange
    const state: FinanceState = {
      income: {
        items: [
          { id: 'inc-1', amountCents: 1000, category: 'work' },
          { id: 'inc-2', amountCents: 250, category: 'other' },
        ],
      },
      expenses: {
        items: [
          { id: 'exp-1', amountCents: 500, category: 'living' },
          { id: 'exp-2', amountCents: 99, category: 'misc' },
        ],
      },
    };

    // Act
    const results = mapFinanceToUndoResults(state) as UndoResult[];

    // Assert – lengte & volgorde
    expect(results).toHaveLength(4);
    expect(results.map(r => r.id)).toEqual(['inc-1', 'inc-2', 'exp-1', 'exp-2']);

    // Assert – income entries
    expect(results[0]).toMatchObject({
      id: 'inc-1',
      amount: 1000, // positief
      currency: 'EUR',
      reason: 'income',
      schemaVersion: 'v9.9.9',
      timestamp: FIXED_DATE_ISO,
    });
    expect(results[1]).toMatchObject({
      id: 'inc-2',
      amount: 250,
      currency: 'EUR',
      reason: 'income',
      schemaVersion: 'v9.9.9',
      timestamp: FIXED_DATE_ISO,
    });

    // Assert – expense entries
    expect(results[2]).toMatchObject({
      id: 'exp-1',
      amount: -500, // negatief
      currency: 'EUR',
      reason: 'expense',
      schemaVersion: 'v9.9.9',
      timestamp: FIXED_DATE_ISO,
    });
    expect(results[3]).toMatchObject({
      id: 'exp-2',
      amount: -99,
      currency: 'EUR',
      reason: 'expense',
      schemaVersion: 'v9.9.9',
      timestamp: FIXED_DATE_ISO,
    });
  });

  it('behoudt item-volgorde (income-items in volgorde, daarna expenses in volgorde)', () => {
    const state: FinanceState = {
      income: {
        items: [
          { id: 'inc-A', amountCents: 1 },
          { id: 'inc-B', amountCents: 2 },
          { id: 'inc-C', amountCents: 3 },
        ],
      },
      expenses: {
        items: [
          { id: 'exp-X', amountCents: 4 },
          { id: 'exp-Y', amountCents: 5 },
        ],
      },
    };

    const results = mapFinanceToUndoResults(state) as UndoResult[];
    expect(results.map(r => r.id)).toEqual(['inc-A', 'inc-B', 'inc-C', 'exp-X', 'exp-Y']);
  });

  it('levert een lege array wanneer beide secties leeg zijn', () => {
    const state: FinanceState = { income: { items: [] }, expenses: { items: [] } };
    const results = mapFinanceToUndoResults(state);
    expect(results).toEqual([]);
  });

  it('prioriteert amountCents boven amount/value als die velden onverhoopt ook bestaan', () => {
    const state: FinanceState = {
      income: {
        items: [
          { id: 'inc-1', amountCents: 123, amount: 999, value: 777 },
        ],
      },
      expenses: {
        items: [
          { id: 'exp-1', amountCents: 10, amount: 999, value: 777 },
        ],
      },
    };

    const results = mapFinanceToUndoResults(state) as UndoResult[];
    // ondanks andere velden, moet amountCents bepalend zijn
    expect(results[0]).toMatchObject({ id: 'inc-1', amount: 123, reason: 'income' });
    expect(results[1]).toMatchObject({ id: 'exp-1', amount: -10, reason: 'expense' });
  });

  it('timestamp is ISO en gelijk aan de fake timer waarde (deterministisch)', () => {
    const state: FinanceState = {
      income: { items: [{ id: 'inc-1', amountCents: 1 }] },
      expenses: { items: [] },
    };
    const [first] = mapFinanceToUndoResults(state) as UndoResult[];
    // validatie: exact onze fixed ISO
    expect(first.timestamp).toBe('2025-01-02T12:34:56.000Z');
    // simpele ISO check
    expect(() => new Date(first.timestamp).toISOString()).not.toThrow();
  });
});
