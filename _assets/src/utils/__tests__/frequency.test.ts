import { convertToMonthlyCents, getMonthlyFactor } from '../frequency';

describe('WAI-004-D: Frequency & Normalisatie Tests', () => {
  test('getMonthlyFactor geeft de juiste ratio voor alle types', () => {
    expect(getMonthlyFactor('month')).toBe(1);
    expect(getMonthlyFactor('year')).toBe(1 / 12);
    expect(getMonthlyFactor('quarter')).toBe(1 / 3);
    // 52 weken / 12 maanden = 4.333...
    expect(getMonthlyFactor('week')).toBeCloseTo(4.3333, 4);
  });

  describe('convertToMonthlyCents (Integer validatie)', () => {
    test('Week naar Maand: €100/wk wordt €433,33/pm', () => {
      // 10000 cent * (52/12) = 43333,333... -> afronden naar 43333
      expect(convertToMonthlyCents(10000, 'week')).toBe(43333);
    });

    test('4-Weken naar Maand: €1000 per 4wk wordt €1083,33/pm', () => {
      // 100000 cent * (13/12) = 108333,333... -> 108333
      expect(convertToMonthlyCents(100000, '4wk')).toBe(108333);
    });

    test('Kwartaal naar Maand: €300/kw wordt €100/pm', () => {
      expect(convertToMonthlyCents(30000, 'quarter')).toBe(10000);
    });

    test('Jaar naar Maand: €12.000/jr wordt €1.000/pm', () => {
      expect(convertToMonthlyCents(1200000, 'year')).toBe(100000);
    });

    test('Default/Onbekend: geeft originele bedrag terug (factor 1)', () => {
      expect(convertToMonthlyCents(5000, 'onbekend')).toBe(5000);
    });
  });
});
