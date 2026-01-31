import { validateField } from '../fieldConstraints';

describe('Field Validation (Groen versie)', () => {
  it('Outcome Consistency', () => {
    // ✅ valide numerieke waarde
    const result1 = validateField('aantalMensen', 5);
    expect(result1).toEqual({ isValid: true });

    // ✅ numerieke range overschreden
    const result2 = validateField('aantalMensen', 15);
    expect(result2).toEqual({ isValid: false, error: 'Waarde mag maximaal 10 zijn.' });

    // ✅ null/undefined bij verplicht veld geeft fout
    const result3 = validateField('aantalMensen', null);
    expect(result3).toEqual({ isValid: false, error: 'Dit veld is verplicht.' });

    const result4 = validateField('autoCount', undefined);
    expect(result4).toEqual({ isValid: false, error: 'Dit veld is verplicht.' });

    // ✅ niet-numeriek maar optioneel veld (verplichtheid niet aanwezig)
    const result5 = validateField('onbestaandVeld', 'abc');
    expect(result5).toEqual({ isValid: true }); // onbekend veld → altijd geldig
  });
});
