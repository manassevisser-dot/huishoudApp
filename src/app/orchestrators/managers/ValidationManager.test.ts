import { ValidationManager } from './ValidationManager';

// Mock validateAtBoundary
jest.mock('@adapters/validation/validateAtBoundary', () => ({
  validateAtBoundary: jest.fn(),
}));

import { validateAtBoundary } from '@adapters/validation/validateAtBoundary';

// Mock UI_SECTIONS
jest.mock('@domain/constants/uiSections', () => ({
  UI_SECTIONS: {
    household: {
      fields: [
        'firstName',
        'email',
        { fieldId: 'age' },
      ],
    },
    emptySection: {
      fields: [],
    },
  },
}));

describe('ValidationManager', () => {
  let mgr: ValidationManager;

  beforeEach(() => {
    jest.clearAllMocks();
    mgr = new ValidationManager();
  });

  // ────────────────────────────────────────────────────────────────
  // validateField()
  // ────────────────────────────────────────────────────────────────
  describe('validateField', () => {
    it('retourneert verplicht-fout als waarde null/undefined/empty is', () => {
      expect(mgr.validateField('firstName', null)).toBe('Dit veld is verplicht');
      expect(mgr.validateField('firstName', undefined)).toBe('Dit veld is verplicht');
      expect(mgr.validateField('firstName', '')).toBe('Dit veld is verplicht');
    });

    it('roept validateAtBoundary aan en retourneert null bij success', () => {
      (validateAtBoundary as jest.Mock).mockReturnValue({ success: true });

      const msg = mgr.validateField('email', 'foo@bar.com');

      expect(validateAtBoundary).toHaveBeenCalledWith('email', 'foo@bar.com');
      expect(msg).toBeNull();
    });

    it('retourneert foutbericht als boundary faalt', () => {
      (validateAtBoundary as jest.Mock).mockReturnValue({
        success: false,
        error: 'Invalid format',
      });

      const msg = mgr.validateField('email', 'not-an-email');
      expect(msg).toBe('Invalid format');
    });
  });

  // ────────────────────────────────────────────────────────────────
  // validateSection()
  // ────────────────────────────────────────────────────────────────
  describe('validateSection', () => {
    it('valideert alle velden uit UI_SECTIONS_MAP en verzamelt fouten', () => {
      (validateAtBoundary as jest.Mock).mockImplementation((_fid, _value) => ({
        success: true,
      }));

      const formData = {
        firstName: '',
        email: 'good@mail.com',
        age: 20,
      };

      const result = mgr.validateSection('household', formData);

      expect(result.isValid).toBe(false);
      expect(result.errorFields).toEqual(['firstName']);
      expect(result.errors.firstName.message).toBe('Dit veld is verplicht');
    });

    it('retourneert geldig resultaat wanneer alle velden ok zijn', () => {
      (validateAtBoundary as jest.Mock).mockReturnValue({ success: true });

      const formData = {
        firstName: 'John',
        email: 'john@mail.com',
        age: 25,
      };

      const result = mgr.validateSection('household', formData);

      expect(result.isValid).toBe(true);
      expect(result.errorFields).toEqual([]);
      expect(result.errors).toEqual({});
    });

    it('werkt ook wanneer sectionId geen velden heeft', () => {
      const result = mgr.validateSection('emptySection', {});
      expect(result.isValid).toBe(true);
      expect(result.errorFields).toEqual([]);
      expect(result.errors).toEqual({});
    });

    it('negeert onbekende sectionId en valideert niets', () => {
      const result = mgr.validateSection('does_not_exist', {});
      expect(result.isValid).toBe(true);
      expect(result.errorFields).toEqual([]);
    });
  });

  // ────────────────────────────────────────────────────────────────
  // shouldValidateAtBoundary()
  // ────────────────────────────────────────────────────────────────
  describe('shouldValidateAtBoundary', () => {
    it('retourneert true voor email/password/amountCents', () => {
      expect(mgr.shouldValidateAtBoundary('email')).toBe(true);
      expect(mgr.shouldValidateAtBoundary('password')).toBe(true);
      expect(mgr.shouldValidateAtBoundary('amountCents')).toBe(true);
    });

    it('retourneert false voor alle andere velden', () => {
      expect(mgr.shouldValidateAtBoundary('unknownField')).toBe(false);
      expect(mgr.shouldValidateAtBoundary('firstName')).toBe(false);
    });
  });
});