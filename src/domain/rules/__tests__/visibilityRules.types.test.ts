import { evaluateVisibilityCondition, Condition } from '../visibilityRules';

// Mock ValueProvider helper
const createMockProvider = (data: Record<string, unknown>) => ({
  getValue: (fieldId: string) => data[fieldId],
});

describe('Type Safety', () => {

  it('moet numerieke waarden valideren met isNumeric guard', async () => {
    // Arrange
    const provider = createMockProvider({ 
      ageString: '18',      // String number
      ageNumber: 18,        // Real number
      invalidAge: 'abc'     // Invalid number
    });

    const condition: Condition = { 
      field: 'ageString', 
      operator: 'gt', 
      value: 10 
    };

    // Act & Assert 1: String "18" > 10 zou true moeten zijn (coercion via isNumeric)
    const resultString = evaluateVisibilityCondition(condition, provider);
    expect(resultString).toBe(true);

    // Act & Assert 2: Number 18 > 10 zou true moeten zijn
    const resultNumber = evaluateVisibilityCondition({ ...condition, field: 'ageNumber' }, provider);
    expect(resultNumber).toBe(true);

    // Act & Assert 3: "abc" is geen nummer -> fail closed
    const resultInvalid = evaluateVisibilityCondition({ ...condition, field: 'invalidAge' }, provider);
    expect(resultInvalid).toBe(false);
  });

});