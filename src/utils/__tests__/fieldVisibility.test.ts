import { evaluateVisibleIf } from '../fieldVisibility';

describe('evaluateVisibleIf (Bridge Integration)', () => {
  // We maken een mock die de 'getValue' methode van de provider simuleert
  // of simpelweg de data structuur geeft die de huidige provider begrijpt.
  const mockState = {
    data: {
      // De provider zoekt vaak in deze buckets:
      SETUP: { hasPartner: 'yes', age: 30 },
      household: { children: 2 },
      directField: 'hello'
    }
  } as any;

  test('should return true if no condition is provided', () => {
    expect(evaluateVisibleIf(undefined, mockState)).toBe(true);
  });

  test('should find values in different buckets', () => {
    // Test directField (root van data)
    expect(
      evaluateVisibleIf({ field: 'directField', operator: 'eq', value: 'hello' } as any, mockState),
    ).toBe(true);
    
    // Test SETUP bucket
    expect(
      evaluateVisibleIf({ field: 'hasPartner', operator: 'eq', value: 'yes' } as any, mockState),
    ).toBe(true);
    
    // Test household bucket
    expect(
      evaluateVisibleIf({ field: 'children', operator: 'eq', value: 2 } as any, mockState)
    ).toBe(true);
  });

  test('should evaluate "gt" operator', () => {
    expect(
      evaluateVisibleIf({ field: 'age', operator: 'gt', value: 25 } as any, mockState)
    ).toBe(true);
    
    expect(
      evaluateVisibleIf({ field: 'age', operator: 'gt', value: 35 } as any, mockState)
    ).toBe(false);
  });
});