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
    
console.log('DEBUG STATE:', JSON.stringify(state, null, 2));
console.log('TOTALS:', summary.totals);

    expect(summary.totals.totalIncomeEUR).toMatch(/€[\s\u00A0]?2\.000,00/);
    expect(summary.totals.totalExpensesEUR).toMatch(/€[\s\u00A0]?500,00/);
    expect(summary.totals.netEUR).toMatch(/€[\s\u00A0]?1\.500,00/);
  });

  it('geeft nul-waarden bij lege state', () => {
    const state = makePhoenixState({ data: {} as any });
    const summary = selectFinancialSummaryVM(state);

    expect(summary.totals.totalIncomeEUR).toMatch(/€[\s\u00A0]?0,00/);
  });
});
