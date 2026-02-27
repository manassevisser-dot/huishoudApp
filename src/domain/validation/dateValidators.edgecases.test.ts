import { isDigitsDatePlausible, isValidDateStr, isFutureDate } from '@domain/validation/dateValidators';

describe('dateValidators - edge cases', () => {
  test('faalt voor niet-DD-MM-YYYY patronen', () => {
    expect(isDigitsDatePlausible('2024-12-31')).toBe(false);
    expect(isDigitsDatePlausible('31/12/2024')).toBe(false);
    expect(isDigitsDatePlausible('12-3-2024')).toBe(false);
    expect(isDigitsDatePlausible('')).toBe(false);
  });

  test('accepteert correcte DD-MM-YYYY patronen (kalender nog los)', () => {
    expect(isDigitsDatePlausible('01-01-2024')).toBe(true);
    expect(isDigitsDatePlausible('29-02-2024')).toBe(true); // schrikkeljaar patroon OK
  });

  test('faalt voor onmogelijke kalendercombinaties met correct patroon', () => {
    // Pattern klopt, maar kalender is onmogelijk (door-check is elders):
    expect(isDigitsDatePlausible('31-11-2024')).toBe(false); // nov heeft 30 dagen
    expect(isDigitsDatePlausible('30-02-2024')).toBe(false); // feb 2024 -> 29 dagen
  });
});


describe('isValidDateStr', () => {
  test('accepteert geldige datums', () => {
    expect(isValidDateStr('2024-01-01')).toBe(true);
    expect(isValidDateStr('2024-02-29')).toBe(true); // schrikkeljaar
  });

  test('verwerpt ongeldige datums', () => {
    expect(isValidDateStr('2024-13-01')).toBe(false); // ongeldige maand
    expect(isValidDateStr('2024-02-30')).toBe(false); // ongeldige dag
    expect(isValidDateStr('not-a-date')).toBe(false);
  });
});

describe('isFutureDate', () => {
  test('detecteert toekomstige datums', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);
    const futureIso = futureDate.toISOString().split('T')[0];
    expect(isFutureDate(futureIso)).toBe(true);
  });

  test('verwerpt verleden/huidige datums', () => {
    expect(isFutureDate('2000-01-01')).toBe(false);
    expect(isFutureDate(new Date().toISOString().split('T')[0])).toBe(false);
  });
});