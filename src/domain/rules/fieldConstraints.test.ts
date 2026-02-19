// src/domain/rules/fieldConstraints.test.ts

import { getConstraint } from './fieldConstraints';

describe('Field Constraints Registry', () => {
  it('bevat een constraint voor aantalMensen met correcte grenzen', () => {
    const constraint = getConstraint('aantalMensen');
    expect(constraint).toBeDefined();
    expect(constraint?.type).toBe('number');
    if (constraint?.type === 'number') {
      expect(constraint.min).toBe(1);
      expect(constraint.max).toBe(10);
      expect(constraint.required).toBe(true);
    }
  });

  it('bevat een constraint voor autoCount met enum-waarden', () => {
    const constraint = getConstraint('autoCount');
    expect(constraint).toBeDefined();
    expect(constraint?.type).toBe('enum');
    if (constraint?.type === 'enum') {
      expect(constraint.values).toContain('Geen');
      expect(constraint.values).toContain('Een');
      expect(constraint.values).toContain('Twee');
      expect(constraint.required).toBe(true);
    }
  });

  it('stript member-prefixen bij opzoeken', () => {
    const constraint = getConstraint('mem_0_aantalMensen');
    expect(constraint).toEqual(getConstraint('aantalMensen'));
  });

  it('retourneert undefined voor onbekend veld', () => {
    const constraint = getConstraint('onbestaandVeld');
    expect(constraint).toBeUndefined();
  });
});