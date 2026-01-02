// src/logic/__tests__/finance.test.ts
import { computePhoenixSummary } from '../finance';

describe('Finance Logic — Maandelijkse Aggregatie', () => {
  it('moet kwartaalbedragen correct naar maanden omrekenen (afgerond op cent)', () => {
    const mockData = {
      income: { items: [{ amount: 10000, frequency: 'quarter' }] }, // €100 / 3 = €33.33
      expenses: { items: [] }
    };
    const result = computePhoenixSummary(mockData);
    expect(result.totalIncomeCents).toBe(3333); // Exacte cent-validatie
  });

  it('moet netto resultaat correct berekenen bij diverse frequenties', () => {
    const mockData = {
      income: { items: [{ amount: 10000, frequency: 'month' }] },     // +10000
      expenses: { items: [{ amount: 2500, frequency: 'week' }] }      // -10833 (2500 * 4.333...)
    };
    const result = computePhoenixSummary(mockData);
    expect(result.netCents).toBe(-833); 
  });
});