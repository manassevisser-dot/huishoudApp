// src/utils/__tests__/frequency.test.ts
import { convertToMonthlyCents, getMonthlyFactor } from '@domain/helpers/frequency';

describe('WAI-004-D: Frequency & Normalisatie Tests', () => {
  test('getMonthlyFactor ratio’s', () => {
    expect(getMonthlyFactor('month')).toBe(1);
    expect(getMonthlyFactor('year')).toBe(1 / 12);
    expect(getMonthlyFactor('quarter')).toBe(1 / 3);
    expect(getMonthlyFactor('week')).toBeCloseTo(52 / 12, 5);
    expect(getMonthlyFactor('4wk')).toBeCloseTo(13 / 12, 5);
    expect(getMonthlyFactor('unknown')).toBe(1); // extra
  });

  describe('convertToMonthlyCents (integers)', () => {
    test('Week → Maand: €100/wk → €433,33/pm', () => {
      expect(convertToMonthlyCents(10000, 'week')).toBe(43333);
    });
    test('4wk → Maand: €1000/4wk → €1083,33/pm', () => {
      expect(convertToMonthlyCents(100000, '4wk')).toBe(108333);
    });
    test('Quarter → Maand: €300/kw → €100/pm', () => {
      expect(convertToMonthlyCents(30000, 'quarter')).toBe(10000);
    });
    test('Year → Month: €12.000/jr → €1.000/pm', () => {
      expect(convertToMonthlyCents(1200000, 'year')).toBe(100000);
    });
    test('Onbekend → factor 1', () => {
      expect(convertToMonthlyCents(5000, 'unknown')).toBe(5000);
    });
  });

  describe('Phoenix state integratie (data.finance)', () => {
    const state = {
      data: {
        setup: {},
        household: { members: [] },
        finance: {
          income: {
            items: [
              { id: 'i-week', amountCents: 10000, frequency: 'week' },
              { id: 'i-4wk', amountCents: 100000, frequency: '4wk' },
            ],
          },
          expenses: { items: [] },
        },
      },
    };

    const toMonthly = (item: { amountCents: number; frequency?: string }) =>
      convertToMonthlyCents(item.amountCents, item.frequency);

    test('Income items → monthlyexpenses (ct)', () => {
      const items = state.data.finance.income.items;
      expect(toMonthly(items[0])).toBe(43333);
      expect(toMonthly(items[1])).toBe(108333);
    });

    test('Aggregatie → som', () => {
      const items = state.data.finance.income.items;
      const total = items.map(toMonthly).reduce((a, b) => a + b, 0);
      expect(total).toBe(151666);
    });
  });
});
describe('WAI-004-E: Frequency Error Handling & Guards', () => {
  test('moet crashen bij niet-eindige getallen (Guard check)', () => {
    // Dekt de !Number.isFinite(cents) check
    expect(() => convertToMonthlyCents(Infinity, 'month')).toThrow(
      'Invalid cents: not a finite number',
    );
    expect(() => convertToMonthlyCents(NaN, 'month')).toThrow('Invalid cents: not a finite number');
  });

  test('moet omgaan met 0 centen', () => {
    expect(convertToMonthlyCents(0, 'year')).toBe(0);
  });

  test('moet omgaan met ontbrekende frequentie (undefined fallback)', () => {
    // Dekt de default case via getMonthlyFactor(undefined)
    expect(convertToMonthlyCents(1000)).toBe(1000);
  });

  test('moet negatieve bedragen ook correct omrekenen (indien toegestaan)', () => {
    // Handig voor correctie-posten in de finance data
    expect(convertToMonthlyCents(-1200, 'year')).toBe(-100);
  });
});
describe('WAI-004-S: Frequency Snapshots', () => {
  test('moet alle standaardfrequenties consistent omrekenen', () => {
    const testValues = [1000, 50000, 120000];
    const frequencies = ['week', '4wk', 'month', 'quarter', 'year'];

    const results = frequencies.map((f) => ({
      frequency: f,
      results: testValues.map((v) => ({
        input: v,
        monthly: convertToMonthlyCents(v, f),
      })),
    }));

    expect(results).toMatchSnapshot();
  });
});
