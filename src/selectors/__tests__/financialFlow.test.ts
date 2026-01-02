import { selectFinancialSummaryVM } from '../financialSelectors';
import { makePhoenixState } from '@test-utils/index';

describe('FinancialFlow Selectors', () => {
  it('haalt de juiste totalen op in EUR formaat', () => {
    const state = makePhoenixState({
      data: {
        finance: {
          income: { items: [{ amountCents: 200000, frequency: 'month' }] },
          expenses: { items: [{ amountCents: 50000, frequency: 'month' }] },
        }
      }
    });

    const summary = selectFinancialSummaryVM(state);

    // FIX: Match de structuur van selectFinancialSummaryVM
    // We gaan ervan uit dat toCents(200000) -> 2000 wordt
    expect(summary.totals.totalIncomeEUR).toMatch(/€\s?2\.000,00/);
    expect(summary.totals.totalExpensesEUR).toMatch(/€\s?500,00/);
    expect(summary.totals.netEUR).toMatch(/€\s?1\.500,00/);
  });

  it('geeft nul-waarden bij lege state', () => {
    const state = makePhoenixState({ data: {} as any });
    const summary = selectFinancialSummaryVM(state);

// Je testte op .toBe(0), maar hij ontvangt een string "€ 0,00"
expect(summary.totals.totalIncomeEUR).toMatch(/€\s?0,00/);
  });
});