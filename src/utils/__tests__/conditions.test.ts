import { evaluateConditions } from '../conditions';

describe('evaluateConditions', () => {
  const mockState = {
    SETUP: {
      hasPartner: 'yes',
      age: 30,
    },
    household: {
      children: 2,
    },
    directField: 'hello',
  } as any;

  test('should return true if no condition or state is provided', () => {
    expect(evaluateConditions(null, mockState)).toBe(true);
    expect(evaluateConditions({ fieldId: 'test' }, null as any)).toBe(true);
  });

  test('should find values in different buckets (root, SETUP, household)', () => {
    expect(
      evaluateConditions({ fieldId: 'directField', operator: 'eq', value: 'hello' }, mockState),
    ).toBe(true);
    expect(
      evaluateConditions({ fieldId: 'hasPartner', operator: 'eq', value: 'yes' }, mockState),
    ).toBe(true);
    expect(evaluateConditions({ fieldId: 'children', operator: 'eq', value: 2 }, mockState)).toBe(
      true,
    );
  });

  test('should return false if value is not found in any bucket', () => {
    expect(
      evaluateConditions({ fieldId: 'nonExistent', operator: 'eq', value: 'test' }, mockState),
    ).toBe(false);
  });

  test('should evaluate "eq" (equal) operator', () => {
    const cond = { fieldId: 'age', operator: 'eq', value: 30 };
    expect(evaluateConditions(cond, mockState)).toBe(true);
    expect(evaluateConditions({ ...cond, value: 31 }, mockState)).toBe(false);
  });

  test('should evaluate "neq" (not equal) operator', () => {
    const cond = { fieldId: 'age', operator: 'neq', value: 31 };
    expect(evaluateConditions(cond, mockState)).toBe(true);
  });

  test('should evaluate "gt" (greater than) operator', () => {
    const cond = { fieldId: 'age', operator: 'gt', value: 25 };
    expect(evaluateConditions(cond, mockState)).toBe(true);
    expect(evaluateConditions({ ...cond, value: 35 }, mockState)).toBe(false);
  });

  test('should evaluate "lt" (less than) operator', () => {
    const cond = { fieldId: 'age', operator: 'lt', value: 35 };
    expect(evaluateConditions(cond, mockState)).toBe(true);
    expect(evaluateConditions({ ...cond, value: 25 }, mockState)).toBe(false);
  });

  test('should return true for unknown operators (default case)', () => {
    const cond = { fieldId: 'age', operator: 'unknown', value: 30 };
    expect(evaluateConditions(cond, mockState)).toBe(true);
  });
});
