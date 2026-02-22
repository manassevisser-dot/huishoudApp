// src/app/orchestrators/managers/NavigationManager.test.ts
import { NavigationManager } from './NavigationManager';

describe('NavigationManager', () => {
  let manager: NavigationManager;

  beforeEach(() => {
    manager = new NavigationManager();
  });

  describe('getFirstScreenId', () => {
    it('moet de eerste stap van de wizard retourneren', () => {
      expect(manager.getFirstScreenId()).toBe('WIZARD_SETUP_HOUSEHOLD');
    });
  });

  describe('getNextStep', () => {
    it('moet de volgende stap retourneren als we midden in de wizard zijn', () => {
      const next = manager.getNextStep('WIZARD_SETUP_HOUSEHOLD');
      expect(next).toBe('WIZARD_DETAILS_HOUSEHOLD');
    });

    it('moet de volgende stap retourneren voor de stap voor de laatste', () => {
      const next = manager.getNextStep('WIZARD_INCOME_DETAILS');
      expect(next).toBe('WIZARD_FIXED_EXPENSES');
    });

    it('moet null retourneren als we al bij de laatste stap zijn', () => {
      const next = manager.getNextStep('WIZARD_FIXED_EXPENSES');
      expect(next).toBeNull();
    });

    it('moet null retourneren voor een onbekende pagina (zoals DASHBOARD)', () => {
      const next = manager.getNextStep('DASHBOARD');
      expect(next).toBeNull();
    });
  });

  describe('getPreviousStep', () => {
    it('moet de vorige stap retourneren binnen de wizard', () => {
      const prev = manager.getPreviousStep('WIZARD_DETAILS_HOUSEHOLD');
      expect(prev).toBe('WIZARD_SETUP_HOUSEHOLD');
    });

    it('moet naar het DASHBOARD navigeren als we op de eerste stap van de wizard zijn', () => {
      const prev = manager.getPreviousStep('WIZARD_SETUP_HOUSEHOLD');
      expect(prev).toBe(manager.DASHBOARD);
    });

    it('moet null retourneren voor een onbekende pagina', () => {
      const prev = manager.getPreviousStep('UNKNOWN_SCREEN');
      expect(prev).toBeNull();
    });
  });

  describe('isLastStep', () => {
    it('moet true retourneren voor de laatste stap', () => {
      expect(manager.isLastStep('WIZARD_FIXED_EXPENSES')).toBe(true);
    });

    it('moet false retourneren voor een stap die niet de laatste is', () => {
      expect(manager.isLastStep('WIZARD_SETUP_HOUSEHOLD')).toBe(false);
    });

    it('moet false retourneren voor een onbekende pagina', () => {
      expect(manager.isLastStep('DASHBOARD')).toBe(false);
    });
  });
});
