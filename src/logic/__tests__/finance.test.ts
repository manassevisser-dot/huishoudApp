import { computeSummary } from '../finance';

describe('WAI-004C Finance Integratie', () => {
  it('berekent netto correct: 100,00 inkomsten - 40,00 uitgaven = 6000 cent', () => {
    const s = computeSummary([{ amount: '100,00' }], [{ amount: '40,00' }]);
    expect(s.totalIncome).toBe(10000);
    expect(s.totalExpenses).toBe(4000);
    expect(s.net).toBe(6000);
  });
});
