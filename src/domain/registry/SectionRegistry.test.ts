// src/domain/registry/SectionRegistry.test.ts
import { SectionRegistry, SECTION_REGISTRY } from './SectionRegistry';
import type { SectionDefinition } from './SectionRegistry';

describe('SectionRegistry', () => {
  describe('SECTION_REGISTRY', () => {
    it('should have all required wizard sections', () => {
      const wizardSections = [
        'householdSetup',
        'householdDetails',
        'incomeDetails',
        'workToeslagen',
        'fixedExpenses',
        'overigeVerzekeringen',
        'abonnementen',
        'memberDetails',
      ];

      wizardSections.forEach(sectionId => {
        expect(SECTION_REGISTRY[sectionId]).toBeDefined();
        expect(SECTION_REGISTRY[sectionId].id).toBe(sectionId);
      });
    });

    it('should have all required static sections', () => {
      const staticSections = [
        'LANDING_ACTIONS_CARD',
        'DASHBOARD_OVERVIEW_CARD',
        'QUICK_ACTIONS_SECTION',
        'EXPENSE_INPUT_CARD',
        'GLOBAL_OPTIONS_LIST',
        'USER_PROFILE_CARD',
        'APP_PREFERENCES_SECTION',
        'CSV_DROPZONE_CARD',
        'CSV_MAPPING_SECTION',
        'CSV_ANALYSIS_RESULT_CARD',
        'RESET_CONFIRMATION_CARD',
        'ERROR_DIAGNOSTICS_CARD',
        'TRANSACTION_HISTORY_LIST',
        'TRANSACTION_ACTIONS_CARD',
      ];

      staticSections.forEach(sectionId => {
        expect(SECTION_REGISTRY[sectionId]).toBeDefined();
        expect(SECTION_REGISTRY[sectionId].id).toBe(sectionId);
      });
    });

    it('should have valid layout types', () => {
      const validLayouts = ['list', 'grid', 'card', 'stepper'];
      const keys = SectionRegistry.getAllKeys();

      keys.forEach(key => {
        const section = SECTION_REGISTRY[key];
        expect(validLayouts).toContain(section.layout);
      });
    });

    it('should have valid uiModel when present', () => {
      const validUiModels = ['numericWrapper', 'collapsible', 'swipeable', 'readonly'];
      const keys = SectionRegistry.getAllKeys();

      keys.forEach(key => {
        const section = SECTION_REGISTRY[key];
        if (section.uiModel) {
          expect(validUiModels).toContain(section.uiModel);
        }
      });
    });

    it('should have label tokens in correct format', () => {
      const keys = SectionRegistry.getAllKeys();

      keys.forEach(key => {
        const section = SECTION_REGISTRY[key];
        expect(section.labelToken).toMatch(/^(SECTION_|LABEL_)/);
      });
    });
  });

  describe('Wizard sections', () => {
    it('should have fieldIds for all wizard sections', () => {
      const wizardSections = [
        'householdSetup',
        'householdDetails',
        'incomeDetails',
        'workToeslagen',
        'fixedExpenses',
        'overigeVerzekeringen',
        'abonnementen',
        'memberDetails',
      ];

      wizardSections.forEach(sectionId => {
        const section = SECTION_REGISTRY[sectionId];
        expect(section.fieldIds.length).toBeGreaterThan(0);
      });
    });

    it('should have correct fieldIds for householdSetup', () => {
      expect(SECTION_REGISTRY.householdSetup.fieldIds).toEqual([
        'aantalMensen',
        'aantalVolwassen',
        'kinderenLabel',
        'postcode',
        'autoCount',
        'heeftHuisdieren',
      ]);
    });

    it('should have correct fieldIds for incomeDetails', () => {
      expect(SECTION_REGISTRY.incomeDetails.fieldIds).toEqual([
        'incomeCategory',
        'nettoSalaris',
        'frequentie',
        'vakantiegeldPerJaar',
      ]);
    });

    it('should have correct fieldIds for fixedExpenses', () => {
      expect(SECTION_REGISTRY.fixedExpenses.fieldIds).toEqual([
        'kaleHuur',
        'hypotheekBruto',
        'energieGas',
        'water',
        'telefoon',
      ]);
    });

    it('should have correct uiModel for specific sections', () => {
      expect(SECTION_REGISTRY.workToeslagen.uiModel).toBe('numericWrapper');
      expect(SECTION_REGISTRY.memberDetails.uiModel).toBe('collapsible');
    });
  });

  describe('Static sections (stubs)', () => {
    it('should have empty fieldIds for stub sections', () => {
      // LANDING_ACTIONS_CARD is geen stub meer — heeft fieldIds na UniversalScreen-migratie
      const stubSections = [
        'DASHBOARD_OVERVIEW_CARD',
        'QUICK_ACTIONS_SECTION',
        'USER_PROFILE_CARD',
        'CSV_DROPZONE_CARD',
        'CSV_MAPPING_SECTION',
        'CSV_ANALYSIS_RESULT_CARD',
        'RESET_CONFIRMATION_CARD',
        'ERROR_DIAGNOSTICS_CARD',
        'TRANSACTION_HISTORY_LIST',
      ];

      stubSections.forEach(sectionId => {
        expect(SECTION_REGISTRY[sectionId].fieldIds).toEqual([]);
      });
    });

    it('should have correct fieldIds for LANDING_ACTIONS_CARD', () => {
      expect(SECTION_REGISTRY.LANDING_ACTIONS_CARD.fieldIds).toEqual([
        'startWizard',
        'goToDashboard',
      ]);
    });

    it('should have fieldIds for EXPENSE_INPUT_CARD', () => {
      expect(SECTION_REGISTRY.EXPENSE_INPUT_CARD.fieldIds).toEqual([
        'dailyTransactionDate',
        'dailyTransactionAmount',
        'dailyTransactionCategory',
        'dailyTransactionDescription',
        'dailyPaymentMethod',
      ]);
    });

    it('should have fieldIds for GLOBAL_OPTIONS_LIST', () => {
      expect(SECTION_REGISTRY.GLOBAL_OPTIONS_LIST.fieldIds).toEqual([
        'goToSettings',
        'goToCsvUpload',
        'goToReset',
      ]);
    });

    it('should have fieldIds for TRANSACTION_ACTIONS_CARD', () => {
      expect(SECTION_REGISTRY.TRANSACTION_ACTIONS_CARD.fieldIds).toEqual([
        'undoAction',
        'redoAction',
        'clearAllAction',
      ]);
    });

    it('should have correct layout for static sections', () => {
      expect(SECTION_REGISTRY.LANDING_ACTIONS_CARD.layout).toBe('card');
      expect(SECTION_REGISTRY.DASHBOARD_OVERVIEW_CARD.layout).toBe('card');
      expect(SECTION_REGISTRY.QUICK_ACTIONS_SECTION.layout).toBe('grid');
      expect(SECTION_REGISTRY.GLOBAL_OPTIONS_LIST.layout).toBe('list');
      expect(SECTION_REGISTRY.TRANSACTION_HISTORY_LIST.layout).toBe('list');
    });
  });

  describe('SectionRegistry methods', () => {
    describe('getDefinition', () => {
      it('should return definition for existing section', () => {
        const def = SectionRegistry.getDefinition('householdSetup');
        expect(def).toBeDefined();
        expect(def?.id).toBe('householdSetup');
        expect(def?.layout).toBe('list');
      });

      it('should return null for non-existing section', () => {
        const def = SectionRegistry.getDefinition('NON_EXISTING');
        expect(def).toBeNull();
      });

      it('should return definition for all registered sections', () => {
        const allKeys = SectionRegistry.getAllKeys();
        allKeys.forEach(key => {
          const def = SectionRegistry.getDefinition(key);
          expect(def).toBeDefined();
          expect(def?.id).toBe(key);
        });
      });
    });

    describe('isValidKey', () => {
      it('should return true for existing section keys', () => {
        expect(SectionRegistry.isValidKey('householdSetup')).toBe(true);
        expect(SectionRegistry.isValidKey('LANDING_ACTIONS_CARD')).toBe(true);
        expect(SectionRegistry.isValidKey('TRANSACTION_ACTIONS_CARD')).toBe(true);
      });

      it('should return false for non-existing keys', () => {
        expect(SectionRegistry.isValidKey('')).toBe(false);
        expect(SectionRegistry.isValidKey('INVALID')).toBe(false);
        expect(SectionRegistry.isValidKey('123')).toBe(false);
      });

      it('should be a type guard', () => {
        const testKey = 'householdSetup';
        if (SectionRegistry.isValidKey(testKey)) {
          // TypeScript should know testKey is a valid key
          const def = SECTION_REGISTRY[testKey];
          expect(def).toBeDefined();
        }
      });
    });

    describe('getAllKeys', () => {
      it('should return all section keys', () => {
        const keys = SectionRegistry.getAllKeys();
        expect(keys).toBeInstanceOf(Array);
        expect(keys.length).toBeGreaterThan(0);
        expect(keys).toContain('householdSetup');
        expect(keys).toContain('LANDING_ACTIONS_CARD');
        expect(keys).toContain('TRANSACTION_ACTIONS_CARD');
      });

      it('should match SECTION_REGISTRY keys', () => {
        const registryKeys = Object.keys(SECTION_REGISTRY);
        const methodKeys = SectionRegistry.getAllKeys();
        expect(methodKeys.sort()).toEqual(registryKeys.sort());
      });
    });
  });

  describe('registry integrity', () => {
    it('should have consistent section ID naming', () => {
      const keys = SectionRegistry.getAllKeys();

      keys.forEach(key => {
        // Wizard sections: camelCase
        // Static sections: UPPER_CASE
        if (key.match(/^[a-z]/)) {
          expect(key).toMatch(/^[a-z][a-zA-Z0-9]+$/);
        } else {
          expect(key).toMatch(/^[A-Z][A-Z0-9_]+$/);
        }
      });
    });

    it('should have unique section IDs', () => {
      const ids = SectionRegistry.getAllKeys();
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });

    it('should have all fieldIds as arrays', () => {
      SectionRegistry.getAllKeys().forEach(key => {
        const section = SECTION_REGISTRY[key];
        expect(Array.isArray(section.fieldIds)).toBe(true);
      });
    });

    it('should have consistent layout per section type', () => {
      // Wizard sections often use list/card
      expect(SECTION_REGISTRY.householdSetup.layout).toBe('list');
      expect(SECTION_REGISTRY.householdDetails.layout).toBe('grid');
      expect(SECTION_REGISTRY.incomeDetails.layout).toBe('list');
      
      // Static sections
      expect(SECTION_REGISTRY.LANDING_ACTIONS_CARD.layout).toBe('card');
      expect(SECTION_REGISTRY.QUICK_ACTIONS_SECTION.layout).toBe('grid');
    });
  });

  describe('cross-registry validation', () => {
    it('should reference existing entry IDs (optional check)', () => {
      // Deze test is optioneel - je kunt hem later toevoegen
      // als je EntryRegistry ook hebt
      const sectionsWithFields = SectionRegistry.getAllKeys().filter(key => 
        SECTION_REGISTRY[key].fieldIds.length > 0
      );

      sectionsWithFields.forEach(key => {
        const section = SECTION_REGISTRY[key];
        // Hier zou je kunnen checken of elk fieldId bestaat in EntryRegistry
        // Maar dat vereist import van EntryRegistry
      });
    });
  });
});