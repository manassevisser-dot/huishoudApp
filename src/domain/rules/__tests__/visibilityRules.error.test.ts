import { evaluateVisibilityCondition, Condition } from '../visibilityRules';

// Mock ValueProvider helper
const createMockProvider = (data: Record<string, unknown> = {}) => ({
  getValue: (fieldId: string) => data[fieldId],
});

describe('Error Handling', () => {

  it('moet false retourneren bij onbekend veld', async () => {
    // Arrange
    const provider = createMockProvider({ knownField: 'exists' });
    const condition: Condition = { 
      field: 'unknownField', 
      operator: 'eq', 
      value: 'anything' 
    };

    // Act
    const result = evaluateVisibilityCondition(condition, provider);

    // Assert
    // Fail-closed: als veld niet bestaat (undefined), is vergelijking false
    expect(result).toBe(false);
  });

  it('moet false retourneren bij missend veld in state', async () => {
    // Arrange
    const provider = createMockProvider({}); // Lege state
    const condition: Condition = { 
      field: 'requiredField', 
      operator: 'truthy' 
    };

    // Act
    const result = evaluateVisibilityCondition(condition, provider);

    // Assert
    expect(result).toBe(false);
  });

});