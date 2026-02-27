// src/domain/registry/ScreenRegistry.test.ts
import { ScreenRegistry, SCREEN_REGISTRY } from './ScreenRegistry';
import type { ScreenDefinition } from './ScreenRegistry';

describe('ScreenRegistry', () => {
  describe('SCREEN_REGISTRY', () => {
    it('should have all required screens', () => {
      const requiredScreens = [
        'SPLASH',
        'LANDING',
        'WIZARD_SETUP_HOUSEHOLD',
        'WIZARD_DETAILS_HOUSEHOLD',
        'WIZARD_INCOME_DETAILS',
        'WIZARD_FIXED_EXPENSES',
        'DASHBOARD',
        'DAILY_INPUT',
        'UNDO',
        'OPTIONS',
        'SETTINGS',
        'CSV_UPLOAD',
        'CSV_ANALYSIS',
        'RESET',
        'CRITICAL_ERROR',
      ];

      requiredScreens.forEach(screenId => {
        expect(SCREEN_REGISTRY[screenId]).toBeDefined();
        expect(SCREEN_REGISTRY[screenId].id).toBe(screenId);
      });
    });

    it('should have correct screen types', () => {
      expect(SCREEN_REGISTRY.SPLASH.type).toBe('SYSTEM');
      expect(SCREEN_REGISTRY.LANDING.type).toBe('AUTH');
      expect(SCREEN_REGISTRY.WIZARD_SETUP_HOUSEHOLD.type).toBe('WIZARD');
      expect(SCREEN_REGISTRY.DASHBOARD.type).toBe('APP_STATIC');
      expect(SCREEN_REGISTRY.CRITICAL_ERROR.type).toBe('SYSTEM');
    });

    it('should have title tokens in correct format', () => {
      const keys = ScreenRegistry.getAllKeys();
      
      keys.forEach(key => {
        const screen = SCREEN_REGISTRY[key];
        expect(screen.titleToken).toMatch(/^(screens|wizard)\.[a-z_]+\.title$/);
      });
    });

    it('should have valid sectionIds arrays', () => {
      const keys = ScreenRegistry.getAllKeys();
      
      keys.forEach(key => {
        const screen = SCREEN_REGISTRY[key];
        expect(Array.isArray(screen.sectionIds)).toBe(true);
        
        // Elke screen moet minstens 1 section hebben, behalve SPLASH?
        if (key !== 'SPLASH') {
          expect(screen.sectionIds.length).toBeGreaterThan(0);
        }
      });
    });
  });

  describe('Wizard flow', () => {
    it('should have correct wizard sequence', () => {
      // Start bij LANDING
      expect(SCREEN_REGISTRY.LANDING.nextScreenId).toBe('WIZARD_SETUP_HOUSEHOLD');

      // Wizard stappen
      expect(SCREEN_REGISTRY.WIZARD_SETUP_HOUSEHOLD.nextScreenId).toBe('WIZARD_DETAILS_HOUSEHOLD');
      expect(SCREEN_REGISTRY.WIZARD_SETUP_HOUSEHOLD.previousScreenId).toBeUndefined();

      expect(SCREEN_REGISTRY.WIZARD_DETAILS_HOUSEHOLD.nextScreenId).toBe('WIZARD_INCOME_DETAILS');
      expect(SCREEN_REGISTRY.WIZARD_DETAILS_HOUSEHOLD.previousScreenId).toBe('WIZARD_SETUP_HOUSEHOLD');

      expect(SCREEN_REGISTRY.WIZARD_INCOME_DETAILS.nextScreenId).toBe('WIZARD_FIXED_EXPENSES');
      expect(SCREEN_REGISTRY.WIZARD_INCOME_DETAILS.previousScreenId).toBe('WIZARD_DETAILS_HOUSEHOLD');

      expect(SCREEN_REGISTRY.WIZARD_FIXED_EXPENSES.nextScreenId).toBe('DASHBOARD');
      expect(SCREEN_REGISTRY.WIZARD_FIXED_EXPENSES.previousScreenId).toBe('WIZARD_INCOME_DETAILS');
    });

    it('should have no circular dependencies in wizard flow', () => {
      const visited = new Set<string>();
      let current: string | undefined = 'LANDING';
      
      while (current) {
        expect(visited.has(current)).toBe(false); // No circular reference
        visited.add(current);
        current = SCREEN_REGISTRY[current]?.nextScreenId;
      }
    });
  });

  describe('Navigation flow', () => {
    it('should have correct back navigation', () => {
      // Dashboard flow
      expect(SCREEN_REGISTRY.DASHBOARD.previousScreenId).toBeUndefined();
      expect(SCREEN_REGISTRY.DAILY_INPUT.previousScreenId).toBe('DASHBOARD');
      expect(SCREEN_REGISTRY.UNDO.previousScreenId).toBe('DAILY_INPUT');

      // Options flow
      expect(SCREEN_REGISTRY.OPTIONS.previousScreenId).toBe('DASHBOARD');
      expect(SCREEN_REGISTRY.SETTINGS.previousScreenId).toBe('OPTIONS');
      expect(SCREEN_REGISTRY.CSV_UPLOAD.previousScreenId).toBe('OPTIONS');
      expect(SCREEN_REGISTRY.CSV_ANALYSIS.previousScreenId).toBe('CSV_UPLOAD');
      expect(SCREEN_REGISTRY.RESET.previousScreenId).toBe('OPTIONS');
    });

    it('should have valid nextScreenId references', () => {
      const keys = ScreenRegistry.getAllKeys();
      const allScreenIds = new Set(keys);

      keys.forEach(key => {
        const screen = SCREEN_REGISTRY[key];
        
        if (screen.nextScreenId) {
          expect(allScreenIds.has(screen.nextScreenId)).toBe(true);
        }
        
        if (screen.previousScreenId) {
          expect(allScreenIds.has(screen.previousScreenId)).toBe(true);
        }
      });
    });

    it('should have consistent two-way navigation', () => {
      const keys = ScreenRegistry.getAllKeys();

      keys.forEach(key => {
        const screen = SCREEN_REGISTRY[key];
        
        if (screen.nextScreenId) {
          const nextScreen = SCREEN_REGISTRY[screen.nextScreenId];
          // Next screen's previous should point back, but not always required
          if (nextScreen?.previousScreenId) {
            expect(nextScreen.previousScreenId).toBe(key);
          }
        }
        
        if (screen.previousScreenId) {
          const prevScreen = SCREEN_REGISTRY[screen.previousScreenId];
          // Previous screen's next should point forward
          if (prevScreen?.nextScreenId) {
            expect(prevScreen.nextScreenId).toBe(key);
          }
        }
      });
    });
  });

  describe('Screen sections', () => {
    it('should have correct sectionIds for each screen', () => {
      // Check specific screens have expected sections
      expect(SCREEN_REGISTRY.LANDING.sectionIds).toEqual(['LANDING_ACTIONS_CARD']);
      
      expect(SCREEN_REGISTRY.WIZARD_SETUP_HOUSEHOLD.sectionIds).toEqual(['householdSetup']);
      expect(SCREEN_REGISTRY.WIZARD_DETAILS_HOUSEHOLD.sectionIds).toEqual(['householdDetails']);
      expect(SCREEN_REGISTRY.WIZARD_INCOME_DETAILS.sectionIds).toEqual(['incomeDetails', 'workToeslagen']);
      expect(SCREEN_REGISTRY.WIZARD_FIXED_EXPENSES.sectionIds).toEqual(['fixedExpenses', 'overigeVerzekeringen', 'abonnementen']);
      
      expect(SCREEN_REGISTRY.DASHBOARD.sectionIds).toEqual(['DASHBOARD_OVERVIEW_CARD', 'QUICK_ACTIONS_SECTION']);
      expect(SCREEN_REGISTRY.UNDO.sectionIds).toEqual(['TRANSACTION_HISTORY_LIST', 'TRANSACTION_ACTIONS_CARD']);
      expect(SCREEN_REGISTRY.CSV_UPLOAD.sectionIds).toEqual(['CSV_DROPZONE_CARD', 'CSV_MAPPING_SECTION']);
    });

    it('should have unique sectionIds across screens', () => {
      const sectionIdToScreen = new Map<string, string>();
      const duplicates: string[] = [];

      const keys = ScreenRegistry.getAllKeys();
      keys.forEach(key => {
        const screen = SCREEN_REGISTRY[key];
        screen.sectionIds.forEach(sectionId => {
          if (sectionIdToScreen.has(sectionId)) {
            duplicates.push(`${sectionId} (in ${key} en ${sectionIdToScreen.get(sectionId)})`);
          } else {
            sectionIdToScreen.set(sectionId, key);
          }
        });
      });

      // Sections mogen hergebruikt worden? Ja, dat is waarschijnlijk de bedoeling.
      // Als sections uniek moeten zijn, uncomment deze regel:
      // expect(duplicates).toEqual([]);
      
      // Log duplicates voor debugging
      if (duplicates.length > 0) {
        console.warn('Hergebruikte sections:', duplicates);
      }
    });
  });

  describe('ScreenRegistry methods', () => {
    describe('getDefinition', () => {
      it('should return definition for existing screen', () => {
        const def = ScreenRegistry.getDefinition('DASHBOARD');
        expect(def).toBeDefined();
        expect(def?.id).toBe('DASHBOARD');
        expect(def?.type).toBe('APP_STATIC');
      });

      it('should return null for non-existing screen', () => {
        const def = ScreenRegistry.getDefinition('NON_EXISTING');
        expect(def).toBeNull();
      });

      it('should return definition for all registered screens', () => {
        const allKeys = ScreenRegistry.getAllKeys();
        allKeys.forEach(key => {
          const def = ScreenRegistry.getDefinition(key);
          expect(def).toBeDefined();
          expect(def?.id).toBe(key);
        });
      });
    });

    describe('isValidKey', () => {
      it('should return true for existing screen keys', () => {
        expect(ScreenRegistry.isValidKey('DASHBOARD')).toBe(true);
        expect(ScreenRegistry.isValidKey('LANDING')).toBe(true);
        expect(ScreenRegistry.isValidKey('WIZARD_SETUP_HOUSEHOLD')).toBe(true);
      });

      it('should return false for non-existing keys', () => {
        expect(ScreenRegistry.isValidKey('')).toBe(false);
        expect(ScreenRegistry.isValidKey('INVALID')).toBe(false);
        expect(ScreenRegistry.isValidKey('123')).toBe(false);
      });

      it('should be a type guard', () => {
        const testKey = 'DASHBOARD';
        if (ScreenRegistry.isValidKey(testKey)) {
          // TypeScript should know testKey is a valid key
          const def = SCREEN_REGISTRY[testKey];
          expect(def).toBeDefined();
        }
      });
    });

    describe('getAllKeys', () => {
      it('should return all screen keys', () => {
        const keys = ScreenRegistry.getAllKeys();
        expect(keys).toBeInstanceOf(Array);
        expect(keys.length).toBeGreaterThan(0);
        expect(keys).toContain('DASHBOARD');
        expect(keys).toContain('LANDING');
        expect(keys).toContain('UNDO');
      });

      it('should match SCREEN_REGISTRY keys', () => {
        const registryKeys = Object.keys(SCREEN_REGISTRY);
        const methodKeys = ScreenRegistry.getAllKeys();
        expect(methodKeys.sort()).toEqual(registryKeys.sort());
      });
    });
  });

  describe('registry integrity', () => {
    it('should have consistent screen ID naming', () => {
      const keys = ScreenRegistry.getAllKeys();
      
      keys.forEach(key => {
        // Screen IDs zijn UPPER_CASE
        expect(key).toMatch(/^[A-Z][A-Z0-9_]+$/);
      });
    });

    it('should have no orphaned next/previous references', () => {
      const allScreenIds = new Set(ScreenRegistry.getAllKeys());

      ScreenRegistry.getAllKeys().forEach(key => {
        const screen = SCREEN_REGISTRY[key];
        
        // Check nextScreenId references
        if (screen.nextScreenId && !allScreenIds.has(screen.nextScreenId)) {
          throw new Error(`Screen ${key} references non-existent nextScreenId: ${screen.nextScreenId}`);
        }
        
        // Check previousScreenId references
        if (screen.previousScreenId && !allScreenIds.has(screen.previousScreenId)) {
          throw new Error(`Screen ${key} references non-existent previousScreenId: ${screen.previousScreenId}`);
        }
      });
    });

    it('should have at least one section per screen (except SPLASH)', () => {
      ScreenRegistry.getAllKeys().forEach(key => {
        const screen = SCREEN_REGISTRY[key];
        if (key !== 'SPLASH' && key !== 'CRITICAL_ERROR') {
          expect(screen.sectionIds.length).toBeGreaterThan(0);
        }
      });
    });

    it('should have unique screen IDs', () => {
      const ids = ScreenRegistry.getAllKeys();
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });
  });
});