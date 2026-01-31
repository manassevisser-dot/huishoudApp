/**
 * TEST: Structured Outcome (CU-P1-05)
 * Contract: validateStep retourneert true bij valide stap, { errors: { fieldId: string } } bij fouten.
 */
import { validateStep } from '../stepValidator';

describe('Structured Outcome - Step Validation', () => {
  it('moet true retourneren bij volledig valide stap', () => {
    const stepData = { aantalMensen: 3, autoCount: 'Een' };
    const result = validateStep(stepData);
    expect(result).toBe(true);
  });

  it('moet { errors } retourneren bij enkele fout', () => {
    const stepData = { aantalMensen: 99 }; // buiten range
    const result = validateStep(stepData);
    
    // Union narrowing: check result is not true
    if (result === true) {
      fail('Expected validation errors but got true');
    }
    
    // TypeScript knows result is { errors: ... } here
    expect(result.errors).toHaveProperty('aantalMensen');
    expect(typeof result.errors.aantalMensen).toBe('string');
  });

  it('moet { errors } retourneren bij meerdere fouten', () => {
    const stepData = { aantalMensen: null, autoCount: 'Onbekend' };
    const result = validateStep(stepData);
    
    // Union narrowing: check result is not true
    if (result === true) {
      fail('Expected validation errors but got true');
    }
    
    // TypeScript knows result is { errors: ... } here
    expect(result.errors).toBeDefined();
    expect(Object.keys(result.errors)).toHaveLength(2);
    expect(typeof result.errors.aantalMensen).toBe('string');
    expect(typeof result.errors.autoCount).toBe('string');
  });
});
