/**
 * @file_intent Unit tests voor ValidationManager — de laag die veldvalidatie uitvoert
 *   op basis van FIELD_CONSTRAINTS_REGISTRY en validateAtBoundary.
 *
 * Wat hier getest wordt:
 *   - validateFields()   : aggregeert fouten over een pre-resolved fieldId/value-map
 *   - validateField()    : required-check via constraint + Zod boundary validator
 *   - shouldValidateAtBoundary(): live-validatie whitelist
 *
 * Wat NIET hier getest wordt:
 *   - De registry-keten (ScreenRegistry → SectionRegistry → EntryRegistry)
 *     → dat is de verantwoordelijkheid van ValidationOrchestrator
 *   - UI_SECTIONS (niet meer gebruikt door ValidationManager)
 */

import { ValidationManager } from './ValidationManager';

// ── Mocks ──────────────────────────────────────────────────────────

jest.mock('@adapters/validation/validateAtBoundary', () => ({
  validateAtBoundary: jest.fn(),
}));

jest.mock('@domain/rules/fieldConstraints', () => ({
  getConstraint: jest.fn(),
}));

import { validateAtBoundary } from '@adapters/validation/validateAtBoundary';
import { getConstraint } from '@domain/rules/fieldConstraints';

const mockBoundary  = validateAtBoundary as jest.Mock;
const mockConstraint = getConstraint as jest.Mock;

// ── Helpers ────────────────────────────────────────────────────────

/** Constraint die een veld verplicht maakt */
const requiredConstraint = (message?: string) => ({
  type: 'string' as const,
  required: true,
  ...(message !== undefined ? { message } : {}),
});

/** Constraint zonder required-flag */
const optionalConstraint = () => ({ type: 'string' as const, required: false });

// ══════════════════════════════════════════════════════════════════
// TESTS
// ══════════════════════════════════════════════════════════════════

describe('ValidationManager', () => {
  let mgr: ValidationManager;

  beforeEach(() => {
    jest.clearAllMocks();
    // Standaard: geen constraint bekend → veld is optioneel
    mockConstraint.mockReturnValue(undefined);
    // Standaard: boundary-validator keurt alles goed
    mockBoundary.mockReturnValue({ success: true });
    mgr = new ValidationManager();
  });

  // ──────────────────────────────────────────────────────────────
  // validateFields()
  // ──────────────────────────────────────────────────────────────
  describe('validateFields', () => {
    it('verzamelt fouten voor verplichte velden die leeg zijn', () => {
      mockConstraint.mockImplementation((fieldId: string) =>
        fieldId === 'postcode' ? requiredConstraint('Voer een geldige postcode in (bijv. 1234AB)') : undefined
      );

      const result = mgr.validateFields(
        ['postcode', 'email'],
        { postcode: '', email: 'foo@bar.com' },
      );

      expect(result.isValid).toBe(false);
      expect(result.errorFields).toEqual(['postcode']);
      expect(result.errors['postcode']?.message).toBe('Voer een geldige postcode in (bijv. 1234AB)');
    });

    it('retourneert isValid=true als alle velden geldig zijn', () => {
      mockConstraint.mockReturnValue(requiredConstraint());

      const result = mgr.validateFields(
        ['postcode', 'woningType'],
        { postcode: '1234AB', woningType: 'Huur' },
      );

      expect(result.isValid).toBe(true);
      expect(result.errorFields).toEqual([]);
      expect(result.errors).toEqual({});
    });

    it('retourneert isValid=true bij lege fieldIds-array', () => {
      const result = mgr.validateFields([], {});

      expect(result.isValid).toBe(true);
      expect(result.errorFields).toEqual([]);
    });

    it('slaat boundary-validatie over voor optionele lege velden', () => {
      mockConstraint.mockReturnValue(optionalConstraint());

      const result = mgr.validateFields(
        ['beschrijving'],
        { beschrijving: '' },
      );

      expect(result.isValid).toBe(true);
      expect(mockBoundary).not.toHaveBeenCalled();
    });

    it('roept boundary-validatie aan voor niet-lege velden', () => {
      mockConstraint.mockReturnValue(requiredConstraint());
      mockBoundary.mockReturnValue({ success: false, error: 'Ongeldig formaat' });

      const result = mgr.validateFields(
        ['postcode'],
        { postcode: 'INVALID' },
      );

      expect(mockBoundary).toHaveBeenCalledWith('postcode', 'INVALID');
      expect(result.isValid).toBe(false);
      expect(result.errors['postcode']?.message).toBe('Ongeldig formaat');
    });
  });

  // ──────────────────────────────────────────────────────────────
  // validateField()
  // ──────────────────────────────────────────────────────────────
  describe('validateField', () => {
    describe('required veld', () => {
      beforeEach(() => {
        mockConstraint.mockReturnValue(requiredConstraint());
      });

      it('retourneert fout bij null, undefined of lege string', () => {
        expect(mgr.validateField('postcode', null)).toBe('Dit veld is verplicht');
        expect(mgr.validateField('postcode', undefined)).toBe('Dit veld is verplicht');
        expect(mgr.validateField('postcode', '')).toBe('Dit veld is verplicht');
      });

      it('gebruikt het custom message uit de constraint', () => {
        mockConstraint.mockReturnValue(
          requiredConstraint('Voer een geldige postcode in (bijv. 1234AB)')
        );

        expect(mgr.validateField('postcode', '')).toBe(
          'Voer een geldige postcode in (bijv. 1234AB)'
        );
      });
    });

    describe('optioneel veld', () => {
      beforeEach(() => {
        mockConstraint.mockReturnValue(optionalConstraint());
      });

      it('retourneert null bij lege waarde (geen blokkering)', () => {
        expect(mgr.validateField('beschrijving', null)).toBeNull();
        expect(mgr.validateField('beschrijving', undefined)).toBeNull();
        expect(mgr.validateField('beschrijving', '')).toBeNull();
      });

      it('slaat boundary-validatie over bij lege waarde', () => {
        mgr.validateField('beschrijving', '');
        expect(mockBoundary).not.toHaveBeenCalled();
      });
    });

    describe('onbekend veld (geen constraint)', () => {
      it('retourneert null bij lege waarde — fail-open voor onbekende velden', () => {
        mockConstraint.mockReturnValue(undefined);
        expect(mgr.validateField('onbekendVeld', '')).toBeNull();
      });
    });

    describe('boundary-validatie', () => {
      it('roept validateAtBoundary aan voor ingevulde velden en retourneert null bij success', () => {
        mockConstraint.mockReturnValue(requiredConstraint());
        mockBoundary.mockReturnValue({ success: true });

        const msg = mgr.validateField('postcode', '1234AB');

        expect(mockBoundary).toHaveBeenCalledWith('postcode', '1234AB');
        expect(msg).toBeNull();
      });

      it('retourneert het foutbericht als boundary faalt', () => {
        mockConstraint.mockReturnValue(requiredConstraint());
        mockBoundary.mockReturnValue({ success: false, error: 'Ongeldig formaat' });

        const msg = mgr.validateField('postcode', 'FOUT');
        expect(msg).toBe('Ongeldig formaat');
      });
    });
  });

  // ──────────────────────────────────────────────────────────────
  // shouldValidateAtBoundary()
  // ──────────────────────────────────────────────────────────────
  describe('shouldValidateAtBoundary', () => {
    it('retourneert true voor velden op de live-validatie whitelist', () => {
      expect(mgr.shouldValidateAtBoundary('email')).toBe(true);
      expect(mgr.shouldValidateAtBoundary('password')).toBe(true);
      expect(mgr.shouldValidateAtBoundary('amountCents')).toBe(true);
      expect(mgr.shouldValidateAtBoundary('postcode')).toBe(true);
    });

    it('retourneert false voor velden buiten de whitelist', () => {
      expect(mgr.shouldValidateAtBoundary('beschrijving')).toBe(false);
      expect(mgr.shouldValidateAtBoundary('aantalMensen')).toBe(false);
    });
  });
});
