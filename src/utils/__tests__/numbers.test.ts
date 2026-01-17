import { toCents, formatCentsToDutch, formatCurrency, formatDutchValue } from '@domain/helpers/numbers';

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
});

describe('GM-004: De Laatste Loodjes naar 100%', () => {
  it('moet 0 retourneren bij totaal corrupte tekst (isNaN check)', () => {
    expect(toCents('geen-cijfers-hier')).toBe(0);
  });

  it('moet 0.XXX niet als duizendtal behandelen (left !== 0 check)', () => {
    expect(toCents('0.500')).toBe(50);
  });

  it('moet omgaan met ongeldige getallen in formatters', () => {
    expect(formatCentsToDutch(NaN)).toBe('0,00');
    expect(formatCentsToDutch(Infinity)).toBe('0,00');
  });

  it('moet negatieve getallen correct omzetten naar centen met behoud van teken', () => {
    expect(toCents(-10.5)).toBe(-1050); // Voorheen verwachtte dit 1050
    expect(toCents('-25,00')).toBe(-2500); // Voorheen verwachtte dit 2500
  });

  it('Numbers direct (afronden naar centen)', () => {
    expect(toCents(12.345)).toBe(1235);
  });

  it('Null/undefined geeft 0', () => {
    expect(toCents(undefined)).toBe(0);
    expect(toCents(null)).toBe(0);
  });
});

describe('GM-005: Volledige Functie Dekking (Regel 9 & 91)', () => {
  it('moet formatDutchValue correct opschonen (Regel 9)', () => {
    // Arrange & Act
    const result = formatDutchValue(' € -1.250,50 abc ');
    // Assert: Verwacht alleen cijfers, komma en punt (geen spaties, letters of min-teken)
    expect(result).toBe('1.250,50');
  });

  it('moet formatCurrency correct formatteren met symbool (Regel 91)', () => {
    // Act
    const result = formatCurrency(125050);
    // Assert: Check op Euro symbool en NL opmaak
    expect(result).toContain('€');
    expect(result).toContain('1.250,50');
  });

  it('moet formatCurrency omgaan met 0 of undefined', () => {
    expect(formatCurrency(0)).toContain('0,00');
    // @ts-ignore
    expect(formatCurrency(null)).toContain('0,00');
  });
});

describe('GM-006: Snapshot Stabiliteit', () => {
  it('moet een consistente output genereren voor diverse bedragen', () => {
    // Arrange
    const testBedragen = [
      125050,
      1000,
      0,
      -5000, // Test ook de absolute conversie in de snapshot
    ];

    // Act
    const resultaten = testBedragen.map((cents) => ({
      input: cents,
      dutch: formatCentsToDutch(cents),
      currency: formatCurrency(cents),
    }));

    // Assert [cite: 16, 18]
    expect(resultaten).toMatchSnapshot();
  });
});
