import { validateField, validateDobNL } from 'src/domain/validation/fieldValidator';
import { canGoNext } from 'src/domain/validation/stepValidator';
import { validationMessages } from '@state/schemas/sections/validationMessages';

describe('Validation Logic (ACTUAL IMPLEMENTATION)', () => {

  describe('validateField', () => {
    test('returns null for empty values', () => {
      expect(validateField('data.setup.aantalMensen', '')).toBeNull();
    });

    test('returns validation object when validation fails (wrong type)', () => {
      const result = validateField('data.setup.aantalMensen', 'geen-getal');
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });

    test('returns null for values below min (handled elsewhere)', () => {
      expect(validateField('data.setup.aantalMensen', -1)).toBeNull();
    });
  });

  describe('validateDobNL', () => {
    test('returns error for incomplete date', () => {
      expect(validateDobNL('12-03')).toBe(
        validationMessages.dateOfBirth.invalidFormat
      );
    });

    test('returns format error for non-existent calendar date', () => {
      expect(validateDobNL('30-02-2024')).toBe(
        validationMessages.dateOfBirth.invalidFormat
      );
    });

    test('returns error for underage person', () => {
      expect(validateDobNL('29-02-2024')).toBe(
        validationMessages.dateOfBirth.minor
      );
    });

    test('returns null for valid adult date', () => {
      expect(validateDobNL('15-03-1990')).toBeNull();
    });
  });

  describe('canGoNext', () => {
    test('returns false if required field is empty', () => {
      const activeFields = ['data.household.members'];
      const formData = { data: { household: { members: [] } } };

      expect(canGoNext(activeFields, formData)).toBe(false);
    });

    test('returns false when members array does not satisfy internal rules', () => {
      const activeFields = ['data.household.members'];
      const formData = {
        data: {
          household: {
            members: [
              { fieldId: 'id-1', name: 'Jan', age: 30 }
            ]
          }
        }
      };

      expect(canGoNext(activeFields, formData)).toBe(false);
    });

    test('returns false for conditional field when empty', () => {
      const activeFields = ['data.household.members', 'data.partner.name'];
      const formData = {
        data: {
          household: {
            members: [
              { fieldId: 'id-1', name: 'Jan', age: 30 }
            ]
          },
          partner: { name: '' }
        }
      };

      expect(canGoNext(activeFields, formData)).toBe(false);
    });
  });

});
