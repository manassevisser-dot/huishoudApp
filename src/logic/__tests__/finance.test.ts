import { computePhoenixSummary } from '@logic/finance';
import { makePhoenixState } from '@test-utils/state';

describe('Finance Integratie', () => {
  it('berekent netto correct uit de finance tak', () => {
    const state = makePhoenixState({
      data: {
        finance: {
          income: { items: [{ amountCents: 10000, frequency: 'month' }] },
          expenses: { items: [{ amountCents: 4000, frequency: 'month' }] },
        }
      }
    });

    // FIX: We geven state.data.finance door omdat de functie 
    // direct zoekt naar .income en .expenses
    const summary = computePhoenixSummary(state.data.finance);

    expect(summary.totalIncomeCents).toBe(10000);
    expect(summary.netCents).toBe(6000);
  });


  it('aggregatie met maandnormalisatie', () => {
    const state = makePhoenixState({
      data: {
        finance: {
          income: {
            items: [
              { id: 'q-300', amountCents: 30000, frequency: 'quarter' }, // 10000 p/m
              { id: 'y-12000', amountCents: 1200000, frequency: 'year' }, // 100000 p/m
            ],
          },
          expenses: { items: [] },
        },
      },
    });

    const summary = computePhoenixSummary(state.data.finance);
    
    expect(summary.totalIncomeCents).toBe(110000);
    expect(summary.netCents).toBe(110000);
  });

  it('lege items geeft overal 0', () => {
    const summary = computePhoenixSummary({ 
      income: { items: [] }, 
      expenses: { items: [] } 
    });
    
    expect(summary.totalIncomeCents).toBe(0);
    expect(summary.netCents).toBe(0);
  });
});