// src/logic/__tests__/finance.test.ts
import { computeSummary } from '../finance';

describe('WAI-004C Finance Integratie', () => {
  it('berekent netto correct: 100,00 inkomsten - 40,00 uitgaven = 6000 cent', () => {
    // FIX: Pak de arrays in een object met 'items' key, zoals Phoenix het verwacht
    const incomeState = { items: [{ amount: 10000 }] };
    const expenseState = { items: [{ amount: 4000 }] };

    const s = computeSummary(incomeState, expenseState);

    expect(s.totalIncome).toBe(10000);
    expect(s.totalExpenses).toBe(4000);
    expect(s.netto).toBe(6000); // Let op: check of je 'net' of 'netto' gebruikt in finance.ts
  });
});
