import { parseToCents } from '@utils/numbers';

describe('GM-001: Euro NumericParser Baseline', () => {
  const scenarios = [
    { input: '1.250,50', expected: 125050 },
    { input: '50,00', expected: 5000 },
    { input: '1.000', expected: 100000 },
    { input: '10.000,99', expected: 1000099 },
  ];

  scenarios.forEach(({ input, expected }) => {
    it(`moet "${input}" parsen naar ${expected} centen`, () => {
      expect(parseToCents(input)).toBe(expected);
    });
  });
});

describe('GM-002: Sanitisatie Check', () => {
  it('moet omgaan met spaties en vreemde tekens', () => {
    expect(parseToCents(' € 1.250,50 ')).toBe(125050);
  });
});
