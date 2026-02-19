import { mapFinanceToUndoResults } from './financeRules';
import { FinanceState, FinanceItem, UndoResult  } from '@core/types/research';

describe('financeRules debug', () => {
  it('moet FinanceState correct mappen naar UndoResult array', () => {    
    const mockFinance: Partial<FinanceState> = {
      income: {
        items: [{ id: 'inc-1', amountCents: 1000, category: 'work' } as FinanceItem]
      },
      expenses: {
        items: [{ id: 'exp-1', amountCents: 500, category: 'living' } as FinanceItem]
      }
    };
    const results: UndoResult[] = mapFinanceToUndoResults(mockFinance as FinanceState);
    // Assertions
    expect(results).toHaveLength(2);
    expect(results[0].amount).toBe(1000); 
    expect(results[1].amount).toBe(-500);
  });
});