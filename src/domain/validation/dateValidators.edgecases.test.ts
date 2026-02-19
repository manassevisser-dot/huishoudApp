import { isDigitsDatePlausible } from '@domain/validation/dateValidators';

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
    // Pattern klopt, maar kalender is onmogelijk (doorcheck is elders):
    expect(isDigitsDatePlausible('31-11-2024')).toBe(false); // nov heeft 30 dagen
    expect(isDigitsDatePlausible('30-02-2024')).toBe(false); // feb 2024 -> 29 dagen
  });
});