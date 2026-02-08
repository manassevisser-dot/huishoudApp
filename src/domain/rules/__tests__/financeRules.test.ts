import { mapFinanceToUndoResults } from '../financeRules';
import { FinanceState, FinanceItem, UndoResult  } from '@core/types/research';

describe('financeRules debug', () => {
  it('moet FinanceState correct mappen naar UndoResult array', () => {
    console.log('--- DEBUG START ---');
    
    const mockFinance: Partial<FinanceState> = {
      income: {
        items: [{ id: 'inc-1', amountCents: 1000, category: 'work' } as FinanceItem]
      },
      expenses: {
        items: [{ id: 'exp-1', amountCents: 500, category: 'living' } as FinanceItem]
      }
    };

    console.log('Mock Data aangemaakt. Items in income:', mockFinance.income?.items.length);
    console.log('Aanroepen van mapFinanceToUndoResults...');

    const results: UndoResult[] = mapFinanceToUndoResults(mockFinance as FinanceState);

    console.log('Mapper resultaat lengte:', results.length);
    console.log('Eerste item (income):', JSON.stringify(results[0], null, 2));
    console.log('Tweede item (expense):', JSON.stringify(results[1], null, 2));

    // Assertions
    expect(results).toHaveLength(2);
    expect(results[0].amount).toBe(1000); 
    expect(results[1].amount).toBe(-500);

    console.log('--- DEBUG EINDE (Test geslaagd) ---');
  });
});