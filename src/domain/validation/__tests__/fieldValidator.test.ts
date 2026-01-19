import { it, expect, describe } from 'vitest';
import { validateField, validateDobNL } from '../fieldValidator';

describe('FieldValidator (Phoenix Audit)', () => {
  it('moet Zod-fouten teruggeven voor ongeldige numerieke invoer', () => {
    // We testen 'aantalMensen' via het pad 'data.setup.aantalMensen'
    // Dit pad moet overeenkomen met je FormStateSchema structuur
    const errors = validateField('data.setup.aantalMensen', -1);
    expect(errors.length).toBeGreaterThan(0);
  });

  it('moet de NL datum-validatie correct uitvoeren', () => {
    expect(validateDobNL('01-01-1990')).toBeNull();
    expect(validateDobNL('32-13-2024')).not.toBeNull(); // Onmogelijk
  });

  it('moet de cross-field "lengthEqualsTo" regel handhaven', () => {
    const mockState = {
      data: { setup: { aantalMensen: 3 } }
    };
    const members = [{ name: 'Jan' }]; // Slechts 1 lid, terwijl 3 verwacht
    const errors = validateField('data.household.members', members, mockState);
    expect(errors).toContain('Aantal leden (1) moet gelijk zijn aan totaal aantal (3).');
  });
});