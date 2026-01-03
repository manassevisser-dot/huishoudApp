import { toCents } from '@utils/numbers';

describe('GM-001: Euro NumericParser Baseline', () => {
  const scenarios = [
    { input: '1.250,50', expected: 125050 },
    { input: '50,00', expected: 5000 },
    { input: '1.000', expected: 100000 },
    { input: '10.000,99', expected: 1000099 },
  ];

  scenarios.forEach(({ input, expected }) => {
    it(`moet "${input}" parsen naar ${expected} centen`, () => {
      expect(toCents(input)).toBe(expected);
    });
  });
});

describe('GM-002: Sanitisatie Check', () => {
  it('moet omgaan met spaties en vreemde tekens', () => {
    expect(toCents(' € 1.250,50 ')).toBe(125050);
  });
});


describe('GM-003: Edge cases & US/NL mix', () => {
  it('US punt-decimaal zonder komma', () => {
    expect(toCents('1250.50')).toBe(125050);
  });

  it('US duizendtal + decimaal (gemixte invoer)', () => {
    // Komma aanwezig => NL-pad: punten weg, komma naar punt
    expect(toCents('1,250.50')).toBe(125050);
  });

  it('Meerdere punten zonder komma (hou alleen laatste als decimaal)', () => {
    expect(toCents('1.234.567.89')).toBe(123456789);
  });

  it('Alleen duizendtallen zonder decimaal', () => {
    expect(toCents('12.345')).toBe(1234500);
  });

  it('Ruwe input met letters/valutasymbolen', () => {
    expect(toCents('EUR 12 345,00')).toBe(1234500);
  });

  it('Numbers direct (afronden naar centen)', () => {
    expect(toCents(12.345)).toBe(1235);
  });

  it('Null/undefined geeft 0', () => {
    expect(toCents(undefined)).toBe(0);
    expect(toCents(null)).toBe(0);
  });
});
