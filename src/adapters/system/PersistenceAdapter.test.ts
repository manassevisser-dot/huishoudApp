// src/adapters/system/PersistenceAdapter.test.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { save, load, clear } from './PersistenceAdapter';
import { logger } from '@adapters/audit/AuditLoggerAdapter';
import type { FormState } from '@core/types/core';
import { initialFormState } from '@app/state/initialFormState';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock logger
jest.mock('@adapters/audit/AuditLoggerAdapter', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
  },
}));

const mockSetItem = AsyncStorage.setItem as jest.Mock;
const mockGetItem = AsyncStorage.getItem as jest.Mock;
const mockRemoveItem = AsyncStorage.removeItem as jest.Mock;

describe('PersistenceAdapter', () => {
  const STORAGE_KEY = 'APP_FORM_STATE_V1';
  
  // Een kopie van initialFormState die voldoet aan het FormState type
  const mockState: FormState = {
    ...initialFormState,
    data: {
      ...initialFormState.data,
      setup: {
        aantalMensen: 2,
        aantalVolwassen: 2,
        autoCount: '1',
        heeftHuisdieren: true,
        woningType: 'Koop',
        postcode: '1234AB',
      },
      household: {
        members: [{ id: '1', name: 'Test', age: 30 }],
        huurtoeslag: 0,
        zorgtoeslag: 0,
      },
      finance: {
        income: { items: [{ id: '1', amount: 2500 }], totalAmount: 2500 },
        expenses: { items: [{ id: '1', amount: 800 }], totalAmount: 800 },
      },
      latestTransaction: {
        latestTransactionDate: '2024-01-15',
        latestTransactionAmount: 42.50,
        latestTransactionCategory: 'Boodschappen',
        latestTransactionDescription: 'Test',
        latestPaymentMethod: 'pin',
      },
      csvImport: {
        transactions: [],
        importedAt: '',
        period: null,
        status: 'idle',
        sourceBank: undefined,
        fileName: '',
        transactionCount: 0,
      },
      transactionHistory: {
        past: [],
        present: null,
        future: [],
      },
    },
    viewModels: {
      financialSummary: {
        totalIncomeDisplay: '€ 2.500',
        totalExpensesDisplay: '€ 800',
        netDisplay: '€ 1.700',
      },
    },
    meta: {
      lastModified: '2024-01-15T10:00:00.000Z',
      version: 1,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('save', () => {
    it('should handle errors with non-Error objects', async () => {
  mockSetItem.mockRejectedValueOnce('String error'); // Geen Error object
  
  await save(mockState);

  expect(logger.warn).toHaveBeenCalledWith('state_persist_failed', expect.objectContaining({
    error: 'unknown',
  }));
});
    it('should save persistable subset of state to AsyncStorage', async () => {
      await save(mockState);

      // Check dat setItem is aangeroepen met de juiste key
      expect(mockSetItem).toHaveBeenCalledWith(STORAGE_KEY, expect.any(String));

      // Parse de opgeslagen JSON
      const savedJson = mockSetItem.mock.calls[0][1];
      const savedData = JSON.parse(savedJson);

      // Controleer dat viewModels NIET is opgeslagen
      expect(savedData).not.toHaveProperty('viewModels');
      
      // Controleer dat de persistable data wel is opgeslagen
      expect(savedData).toHaveProperty('schemaVersion', '1.0');
      expect(savedData).toHaveProperty('data.setup');
      expect(savedData).toHaveProperty('data.household');
      expect(savedData).toHaveProperty('data.finance');
      expect(savedData).toHaveProperty('data.latestTransaction');
      expect(savedData).toHaveProperty('meta');

      // Controleer dat specifieke velden correct zijn
      expect(savedData.data.setup.aantalMensen).toBe(2);
      expect(savedData.data.household.members[0].name).toBe('Test');
      expect(savedData.data.finance.income.totalAmount).toBe(2500);
      
      // Controleer dat logger is aangeroepen
      expect(logger.info).toHaveBeenCalledWith('state_persisted', expect.any(Object));
    });

    it('should handle AsyncStorage errors gracefully', async () => {
      const error = new Error('Storage full');
      mockSetItem.mockRejectedValueOnce(error);

      await save(mockState);

      expect(logger.warn).toHaveBeenCalledWith('state_persist_failed', expect.objectContaining({
        error: 'Storage full',
      }));
    });
  });

  describe('load', () => {
    it('should return null when no saved state exists', async () => {
      mockGetItem.mockResolvedValueOnce(null);

      const result = await load();

      expect(result).toBeNull();
      expect(logger.info).not.toHaveBeenCalled();
      expect(logger.warn).not.toHaveBeenCalled();
    });
it('should handle load errors with non-Error objects', async () => {
  mockGetItem.mockRejectedValueOnce('String error'); // Geen Error object

  const result = await load();

  expect(result).toBeNull();
  expect(logger.warn).toHaveBeenCalledWith('hydration_failed', expect.objectContaining({
    error: 'unknown',
  }));
});
    it('should load and validate valid persisted state', async () => {
      const persistableData = {
        schemaVersion: '1.0',
        data: {
          setup: mockState.data.setup,
          household: mockState.data.household,
          finance: mockState.data.finance,
          latestTransaction: mockState.data.latestTransaction,
        },
        meta: mockState.meta,
      };

      mockGetItem.mockResolvedValueOnce(JSON.stringify(persistableData));

      const result = await load();

      expect(result).toEqual(persistableData);
      expect(logger.info).toHaveBeenCalledWith('hydration_success', expect.any(Object));
    });

    it('should handle corrupt JSON', async () => {
      mockGetItem.mockResolvedValueOnce('{ invalid json }');

      const result = await load();

      expect(result).toBeNull();
      expect(mockRemoveItem).toHaveBeenCalledWith(STORAGE_KEY);
      expect(logger.warn).toHaveBeenCalledWith('hydration_failed', expect.any(Object));
    });

    it('should reject invalid schema version', async () => {
      const invalidData = {
        schemaVersion: '2.0', // Verkeerde versie
        data: {},
        meta: {},
      };

      mockGetItem.mockResolvedValueOnce(JSON.stringify(invalidData));

      const result = await load();

      expect(result).toBeNull();
      expect(mockRemoveItem).toHaveBeenCalledWith(STORAGE_KEY);
      expect(logger.warn).toHaveBeenCalledWith('storage_corrupt', expect.any(Object));
    });

    it('should reject missing required fields', async () => {
      const invalidData = {
        schemaVersion: '1.0',
        // data ontbreekt
        meta: {},
      };

      mockGetItem.mockResolvedValueOnce(JSON.stringify(invalidData));

      const result = await load();

      expect(result).toBeNull();
      expect(mockRemoveItem).toHaveBeenCalledWith(STORAGE_KEY);
    });

    it('should handle AsyncStorage errors during load', async () => {
      const error = new Error('Failed to read');
      mockGetItem.mockRejectedValueOnce(error);

      const result = await load();

      expect(result).toBeNull();
      expect(mockRemoveItem).toHaveBeenCalledWith(STORAGE_KEY);
      expect(logger.warn).toHaveBeenCalledWith('hydration_failed', expect.objectContaining({
        error: 'Failed to read',
      }));
    });

    it('should handle errors during key removal gracefully', async () => {
      mockGetItem.mockResolvedValueOnce('{ invalid json }');
      mockRemoveItem.mockRejectedValueOnce(new Error('Cannot remove'));

      const result = await load();

      expect(result).toBeNull();
      // Geen extra errors, gewoon null terug
    });
  });

  describe('clear', () => {
    it('should handle clear errors with non-Error objects', async () => {
  mockRemoveItem.mockRejectedValueOnce('String error'); // Geen Error object

  await clear();

  expect(logger.warn).toHaveBeenCalledWith('storage_clear_failed', expect.objectContaining({
    error: 'unknown',
  }));
});
    it('should remove storage key', async () => {
      await clear();

      expect(mockRemoveItem).toHaveBeenCalledWith(STORAGE_KEY);
      expect(logger.info).toHaveBeenCalledWith('storage_cleared', expect.any(Object));
    });

    it('should handle errors during clear', async () => {
      const error = new Error('Cannot clear');
      mockRemoveItem.mockRejectedValueOnce(error);

      await clear();

      expect(logger.warn).toHaveBeenCalledWith('storage_clear_failed', expect.objectContaining({
        error: 'Cannot clear',
      }));
    });
  });

  describe('toPersistable (indirect getest via save)', () => {
    it('should strip viewModels from saved state', async () => {
      const stateWithViewModels = {
  ...mockState,
  viewModels: { 
    financialSummary: { 
      totalIncomeDisplay: 'test', 
      totalExpensesDisplay: 'test', 
      netDisplay: 'test' 
    } 
  },
};

      await save(stateWithViewModels);

      const savedJson = mockSetItem.mock.calls[0][1];
      const savedData = JSON.parse(savedJson);

      expect(savedData).not.toHaveProperty('viewModels');
    });

    it('should strip activeStep and currentScreenId', async () => {
      const stateWithNavigation = {
        ...mockState,
        activeStep: 'DASHBOARD',
        currentScreenId: 'dashboard',
      };

      await save(stateWithNavigation);

      const savedJson = mockSetItem.mock.calls[0][1];
      const savedData = JSON.parse(savedJson);

      expect(savedData).not.toHaveProperty('activeStep');
      expect(savedData).not.toHaveProperty('currentScreenId');
    });
  });

  describe('isPersistableFormState (indirect getest via load)', () => {
    it('should reject non-object values', async () => {
      mockGetItem.mockResolvedValueOnce('null');
      expect(await load()).toBeNull();

      mockGetItem.mockResolvedValueOnce('42');
      expect(await load()).toBeNull();

      mockGetItem.mockResolvedValueOnce('"string"');
      expect(await load()).toBeNull();
    });

    it('should reject missing schemaVersion', async () => {
      mockGetItem.mockResolvedValueOnce(JSON.stringify({ data: {}, meta: {} }));
      expect(await load()).toBeNull();
    });

    it('should reject missing data or meta', async () => {
      mockGetItem.mockResolvedValueOnce(JSON.stringify({ schemaVersion: '1.0', data: {} }));
      expect(await load()).toBeNull();

      mockGetItem.mockResolvedValueOnce(JSON.stringify({ schemaVersion: '1.0', meta: {} }));
      expect(await load()).toBeNull();
    });
  });
});