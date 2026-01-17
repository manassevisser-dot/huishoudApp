import { evaluateRules } from '@domain/rules/evaluateDomainRules';

describe('evaluateRules', () => {
  test('should return a valid rule result object', () => {
    const mockData = { test: 'data' };
    const result = evaluateRules(mockData);

    // Check of de structuur klopt
    expect(result).toHaveProperty('entityId');
    expect(result).toHaveProperty('timestamp');
    expect(result).toHaveProperty('isValid', true);

    // Check of entityId een string is (gezien de random generatie)
    expect(typeof result.entityId).toBe('string');
    expect(result.entityId.length).toBeGreaterThan(0);

    // Check of timestamp recent is
    expect(result.timestamp).toBeLessThanOrEqual(Date.now());
  });

  test('should generate different IDs on subsequent calls', () => {
    const res1 = evaluateRules({});
    const res2 = evaluateRules({});
    expect(res1.entityId).not.toBe(res2.entityId);
  });
});
