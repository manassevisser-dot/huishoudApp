import { validateField, validateDobNL } from '@domain/validation/fieldValidator';

describe('validation.ts logic', () => {
  describe('validateField', () => {
    // We gebruiken 'as any' om TypeScript waarschuwingen te negeren
    // en de logica van de functie te testen.
    const mockField = {
      type: 'number',
      required: true,
      validation: { min: 5, max: 10 },
    } as any;
// Voeg deze toe aan de describe('validateField') block
it('should fallback to 0 when state path is missing for lengthEqualsTo', () => {
  const field = { 
    validation: { lengthEqualsTo: 'page.missingField' } 
  };
  // value.length is 1, expected wordt 0 door de fallback
  const result = validateField(field as any, [{}], {}); 
  expect(result).toContain('moet gelijk zijn aan totaal aantal personen (0)');
});

// Voeg deze toe aan de describe('validateDobNL') block
it('should return error for non-existent calendar dates', () => {
  // 31-04-2023 (April heeft maar 30 dagen)
  // Dit passeert isDigitsDatePlausible vaak wel, maar parseDDMMYYYYtoISO niet.
  const result = validateDobNL('31042023');
  expect(result).toBe('Ongeldige datum (bestaat niet in kalender).');
});
    test('should return error if required value is missing', () => {
      expect(validateField(mockField, '', {})).toBe('Dit veld is verplicht.');
      expect(validateField(mockField, null, {})).toBe('Dit veld is verplicht.');
      expect(validateField(mockField, undefined, {})).toBe('Dit veld is verplicht.');
    });

    test('should return error if number is below min', () => {
      expect(validateField(mockField, 4, {})).toContain('minimaal 5');
    });

    test('should return error if number is above max', () => {
      expect(validateField(mockField, 11, {})).toContain('maximaal 10');
    });

    test('should validate postcode correctly', () => {
      const postcodeField = {
        type: 'text',
        validation: { postcode: true },
      } as any;
      expect(validateField(postcodeField, '1234', {})).toBeNull();
      expect(validateField(postcodeField, '123', {})).toBe(
        'Ongeldige postcode (formaat: 4 cijfers, bijv. 1234).',
      );
    });

    test('should validate lengthEqualsTo for arrays', () => {
      const arrayField = {
        type: 'array',
        validation: { lengthEqualsTo: 'setup.total' },
      } as any;
      const state = { setup: { total: 2 } };

      expect(validateField(arrayField, [{ name: 'Jan' }], state)).toContain(
        'gelijk zijn aan totaal aantal personen',
      );
      expect(validateField(arrayField, [{ name: 'Jan' }, { name: 'Piet' }], state)).toBeNull();
    });

    test('should return null if no validation rules match', () => {
      expect(validateField({ type: 'text' } as any, 'vrije tekst', {})).toBeNull();
    });
  });

  describe('validateDobNL', () => {
    test('should return error for incomplete date', () => {
      expect(validateDobNL('01-01')).toBe('Vul een volledige datum in (DD-MM-YYYY).');
    });

    test('should return error for implausible digits', () => {
      expect(validateDobNL('99-99-2024')).toBe('Ongeldige datum (dag/maand/jaar niet plausibel).');
    });

    test('should return error for non-existent calendar date', () => {
      expect(validateDobNL('30-02-2024')).toBe('Ongeldige datum (bestaat niet in kalender).');
    });

    test('should return null for valid date', () => {
      expect(validateDobNL('01-01-1990')).toBeNull();
      expect(validateDobNL('31121999')).toBeNull();
    });
  });
});
