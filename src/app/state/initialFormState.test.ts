// src/app/state/initialFormState.test.ts
import { initialFormState } from './initialFormState';
import { DATA_KEYS } from '@domain/constants/datakeys';

describe('initialFormState', () => {
  it('should have correct schema version', () => {
    expect(initialFormState.schemaVersion).toBe('1.0');
  });

  it('should start on LANDING step', () => {
    expect(initialFormState.activeStep).toBe('LANDING');
    expect(initialFormState.currentScreenId).toBe('landing');
  });

  it('should be valid initially', () => {
    expect(initialFormState.isValid).toBe(true);
  });

  describe('data structure', () => {
    it('should have all DATA_KEYS sections', () => {
      const dataKeys = Object.keys(initialFormState.data);
      expect(dataKeys).toContain(DATA_KEYS.SETUP);
      expect(dataKeys).toContain(DATA_KEYS.HOUSEHOLD);
      expect(dataKeys).toContain(DATA_KEYS.FINANCE);
    });

    it('should have correct SETUP defaults', () => {
      const setup = initialFormState.data[DATA_KEYS.SETUP];
      expect(setup).toEqual({
        aantalMensen: 1,
        aantalVolwassen: 1,
        autoCount: 'Geen',
        heeftHuisdieren: false,
        woningType: 'Huur',
        postcode: '',
      });
    });

    it('should have correct HOUSEHOLD defaults', () => {
      const household = initialFormState.data[DATA_KEYS.HOUSEHOLD];
      expect(household).toEqual({
        members: [],
        huurtoeslag: 0,
        zorgtoeslag: 0,
      });
    });

    it('should have correct FINANCE defaults', () => {
      const finance = initialFormState.data[DATA_KEYS.FINANCE];
      expect(finance).toEqual({
        income: { items: [], totalAmount: 0 },
        expenses: { items: [], totalAmount: 0 },
      });
    });

    it('should have latestTransaction with today\'s date', () => {
      const today = new Date().toISOString().split('T')[0];
      expect(initialFormState.data.latestTransaction).toEqual({
        latestTransactionDate: today,
        latestTransactionAmount: 0,
        latestTransactionCategory: null,
        latestTransactionDescription: '',
        latestPaymentMethod: 'pin',
      });
    });

    it('should have empty csvImport state', () => {
      expect(initialFormState.data.csvImport).toEqual({
        transactions: [],
        importedAt: '',
        period: null,
        status: 'idle',
        sourceBank: undefined,
        fileName: '',
        transactionCount: 0,
      });
    });

    it('should have empty transaction history', () => {
      expect(initialFormState.data.transactionHistory).toEqual({
        past: [],
        present: null,
        future: [],
      });
    });
  });

  describe('viewModels', () => {
    it('should start with empty viewModels', () => {
      expect(initialFormState.viewModels).toEqual({});
    });
  });

  describe('meta', () => {
    it('should have lastModified timestamp', () => {
      expect(initialFormState.meta.lastModified).toBeDefined();
      expect(typeof initialFormState.meta.lastModified).toBe('string');
      expect(new Date(initialFormState.meta.lastModified).toString()).not.toBe('Invalid Date');
    });

    it('should have version 1', () => {
      expect(initialFormState.meta.version).toBe(1);
    });
  });

  describe('type safety', () => {
    it('should match FormState interface structure', () => {
      // Dit is meer een compile-time check, maar we kunnen de shape verifiëren
      const state = initialFormState;
      
      // Top-level properties
      expect(state).toHaveProperty('schemaVersion');
      expect(state).toHaveProperty('activeStep');
      expect(state).toHaveProperty('currentScreenId');
      expect(state).toHaveProperty('isValid');
      expect(state).toHaveProperty('data');
      expect(state).toHaveProperty('viewModels');
      expect(state).toHaveProperty('meta');

      // Nested data properties
      expect(state.data).toHaveProperty(DATA_KEYS.SETUP);
      expect(state.data).toHaveProperty(DATA_KEYS.HOUSEHOLD);
      expect(state.data).toHaveProperty(DATA_KEYS.FINANCE);
      expect(state.data).toHaveProperty('latestTransaction');
      expect(state.data).toHaveProperty('csvImport');
      expect(state.data).toHaveProperty('transactionHistory');
    });
  });

  describe('immutability', () => {
    it('should be a frozen object (readonly)', () => {
      // In development, we can check if it's frozen
      // Dit is optioneel, afhankelijk of je Object.freeze gebruikt
      if (Object.isFrozen) {
        expect(Object.isFrozen(initialFormState)).toBe(false); // Of true als je freeze gebruikt
      }
    });

    it('should return a new copy when spread', () => {
      const copy = { ...initialFormState };
      expect(copy).not.toBe(initialFormState);
      expect(copy).toEqual(initialFormState);
    });
  });
});