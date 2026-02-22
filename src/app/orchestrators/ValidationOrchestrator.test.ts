// src/app/orchestrators/ValidationOrchestrator.test.ts
/**
 * @file_intent Unit tests voor de ValidationOrchestrator – Stateless validatie-wrapper.
 * @contract Test delegatie aan ValidationManager en de validateAtBoundary logica.
 */

jest.mock('@domain/constants/datakeys', () => ({
  DATA_KEYS: { SETUP: 'setup', HOUSEHOLD: 'household', FINANCE: 'finance', META: 'meta' },
  SUB_KEYS: { MEMBERS: 'members', INCOME: 'income', EXPENSES: 'expenses', ITEMS: 'items' },
}));

jest.mock('@domain/constants/uiSections', () => ({
  UI_SECTIONS: {
    '1setupHousehold': {
      fields: ['aantalMensen', 'aantalVolwassen', 'woningType'],
    },
    'leegSectie': {
      fields: [],
    },
  },
}));

jest.mock('@adapters/validation/validateAtBoundary', () => ({
  validateAtBoundary: jest.fn(() => ({ success: true, error: null })),
}));

import { ValidationOrchestrator } from './ValidationOrchestrator';
import { validateAtBoundary } from '@adapters/validation/validateAtBoundary';

const mockValidateAtBoundary = validateAtBoundary as jest.Mock;
const makeFso = () => ({} as any);

describe('ValidationOrchestrator', () => {

  describe('validateSection', () => {
    it('retourneert isValid true als alle velden geldig zijn', () => {
      const orchestrator = new ValidationOrchestrator(makeFso());
      const result = orchestrator.validateSection('1setupHousehold', {
        aantalMensen: 2,
        aantalVolwassen: 2,
        woningType: 'Koop',
      });

      expect(result.isValid).toBe(true);
      expect(result.errorFields).toHaveLength(0);
    });

    it('retourneert isValid false als een veld ontbreekt', () => {
      const orchestrator = new ValidationOrchestrator(makeFso());
      const result = orchestrator.validateSection('1setupHousehold', {
        aantalMensen: 2,
        // aantalVolwassen ontbreekt
        woningType: 'Koop',
      });

      expect(result.isValid).toBe(false);
      expect(result.errorFields).toContain('aantalVolwassen');
    });

    it('retourneert isValid false als een veld null is', () => {
      const orchestrator = new ValidationOrchestrator(makeFso());
      const result = orchestrator.validateSection('1setupHousehold', {
        aantalMensen: null,
        aantalVolwassen: 1,
        woningType: 'Koop',
      });

      expect(result.isValid).toBe(false);
      expect(result.errorFields).toContain('aantalMensen');
    });

    it('retourneert isValid true voor een lege sectie zonder velden', () => {
      const orchestrator = new ValidationOrchestrator(makeFso());
      const result = orchestrator.validateSection('leegSectie', {});

      expect(result.isValid).toBe(true);
    });

    it('retourneert isValid true voor een onbekende sectie', () => {
      const orchestrator = new ValidationOrchestrator(makeFso());
      const result = orchestrator.validateSection('ONBEKEND', {});

      expect(result.isValid).toBe(true);
    });

    it('bevat errors object met message en severity per fout veld', () => {
      const orchestrator = new ValidationOrchestrator(makeFso());
      const result = orchestrator.validateSection('1setupHousehold', {
        aantalMensen: '',
        aantalVolwassen: 1,
        woningType: 'Koop',
      });

      expect(result.errors['aantalMensen']).toBeDefined();
      expect(result.errors['aantalMensen'].message).toBe('Dit veld is verplicht');
      expect(result.errors['aantalMensen'].severity).toBe('error');
    });
  });

  describe('validateField', () => {
    it('retourneert foutmelding als waarde undefined is', () => {
      const orchestrator = new ValidationOrchestrator(makeFso());
      const result = orchestrator.validateField('aantalMensen', undefined);
      expect(result).toBe('Dit veld is verplicht');
    });

    it('retourneert foutmelding als waarde null is', () => {
      const orchestrator = new ValidationOrchestrator(makeFso());
      const result = orchestrator.validateField('aantalMensen', null);
      expect(result).toBe('Dit veld is verplicht');
    });

    it('retourneert foutmelding als waarde lege string is', () => {
      const orchestrator = new ValidationOrchestrator(makeFso());
      const result = orchestrator.validateField('aantalMensen', '');
      expect(result).toBe('Dit veld is verplicht');
    });

    it('retourneert null als waarde geldig is en boundary validatie slaagt', () => {
      mockValidateAtBoundary.mockReturnValue({ success: true, error: null });
      const orchestrator = new ValidationOrchestrator(makeFso());
      const result = orchestrator.validateField('aantalMensen', 2);
      expect(result).toBeNull();
    });

    it('retourneert boundary error als Zod validatie faalt', () => {
      mockValidateAtBoundary.mockReturnValue({ success: false, error: 'Ongeldige waarde' });
      const orchestrator = new ValidationOrchestrator(makeFso());
      const result = orchestrator.validateField('aantalMensen', -1);
      expect(result).toBe('Ongeldige waarde');
    });
  });

  describe('validateAtBoundary', () => {
    it('retourneert null als veld geen live validatie heeft', () => {
      const orchestrator = new ValidationOrchestrator(makeFso());
      const result = orchestrator.validateAtBoundary('aantalMensen', 2);
      expect(result).toBeNull();
    });

    it('valideert live voor email veld', () => {
      mockValidateAtBoundary.mockReturnValue({ success: false, error: 'Ongeldig e-mailadres' });
      const orchestrator = new ValidationOrchestrator(makeFso());
      const result = orchestrator.validateAtBoundary('email', 'geen-email');
      expect(result).toBe('Ongeldig e-mailadres');
    });

    it('valideert live voor amountCents veld', () => {
      mockValidateAtBoundary.mockReturnValue({ success: true, error: null });
      const orchestrator = new ValidationOrchestrator(makeFso());
      const result = orchestrator.validateAtBoundary('amountCents', 1000);
      expect(result).toBeNull();
    });

    it('retourneert null als live validatie slaagt voor password', () => {
      mockValidateAtBoundary.mockReturnValue({ success: true, error: null });
      const orchestrator = new ValidationOrchestrator(makeFso());
      const result = orchestrator.validateAtBoundary('password', 'SterkWachtwoord123');
      expect(result).toBeNull();
    });
  });

});
