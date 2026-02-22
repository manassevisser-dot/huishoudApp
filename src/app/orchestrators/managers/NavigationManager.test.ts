// src/app/orchestrators/managers/NavigationManager.test.ts
import { NavigationManager } from './NavigationManager';

describe('NavigationManager', () => {
  let manager: NavigationManager;

  beforeEach(() => {
    manager = new NavigationManager();
  });

  describe('getFirstScreenId', () => {
    it('moet de eerste stap van de wizard retourneren', () => {
      expect(manager.getFirstScreenId()).toBe('1setupHousehold');
    });
  });

  describe('getNextStep', () => {
    it('moet de volgende stap retourneren als we midden in de wizard zijn', () => {
      const next = manager.getNextStep('1setupHousehold');
      expect(next).toBe('2detailsHousehold');
    });

    it('moet de volgende stap retourneren voor de stap voor de laatste', () => {
      const next = manager.getNextStep('3incomeDetails');
      expect(next).toBe('4fixedExpenses');
    });

    it('moet null retourneren als we al bij de laatste stap zijn', () => {
      const next = manager.getNextStep('4fixedExpenses');
      expect(next).toBeNull();
    });

    it('moet null retourneren voor een onbekende pagina (zoals DASHBOARD)', () => {
      const next = manager.getNextStep('DASHBOARD');
      expect(next).toBeNull();
    });
  });

  describe('getPreviousStep', () => {
    it('moet de vorige stap retourneren binnen de wizard', () => {
      const prev = manager.getPreviousStep('2detailsHousehold');
      expect(prev).toBe('1setupHousehold');
    });

    it('moet naar het DASHBOARD navigeren als we op de eerste stap van de wizard zijn', () => {
      const prev = manager.getPreviousStep('1setupHousehold');
      expect(prev).toBe(manager.DASHBOARD);
    });

    it('moet null retourneren voor een onbekende pagina', () => {
      const prev = manager.getPreviousStep('UNKNOWN_SCREEN');
      expect(prev).toBeNull();
    });
  });

  describe('isLastStep', () => {
    it('moet true retourneren voor de laatste stap', () => {
      expect(manager.isLastStep('4fixedExpenses')).toBe(true);
    });

    it('moet false retourneren voor een stap die niet de laatste is', () => {
      expect(manager.isLastStep('1setupHousehold')).toBe(false);
    });

    it('moet false retourneren voor een onbekende pagina', () => {
      expect(manager.isLastStep('DASHBOARD')).toBe(false);
    });
  });
});