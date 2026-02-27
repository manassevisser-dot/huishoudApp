// src/services/storageShim.test.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuditLogger } from '@adapters/audit/AuditLoggerAdapter';
import StorageShim from './storageShim';
import type { FormState } from '@core/types/core';
import type { Theme } from '@domain/constants/Colors';

// Mocks
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('@adapters/audit/AuditLoggerAdapter', () => ({
  AuditLogger: {
    error: jest.fn(),
  },
}));

describe('StorageShim', () => {
  const mockFormState: FormState = {
  schemaVersion: '1.0',
  activeStep: 'LANDING',
  currentScreenId: 'landing',
  isValid: true,
  data: {
    setup: {
      aantalMensen: 1,
      aantalVolwassen: 1,
      autoCount: 'Geen',
      woningType: 'Huur',
      heeftHuisdieren: false,
    },
    household: {
      members: [],
      huurtoeslag: 0,
      zorgtoeslag: 0,
    },
    finance: {
      income: {
        huurtoeslag: 0,
        kindgebondenBudget: 0,
        kinderopvangtoeslag: 0,
        kinderbijslag: 0,
        heeftVermogen: 'Nee',
        vermogenWaarde: 0,
        items: [],
        totalAmount: 0,
      },
      expenses: {
        kaleHuur: 0,
        servicekosten: 0,
        hypotheekBruto: 0,
        ozb: 0,
        gemeentebelastingen: 0,
        waterschapsbelasting: 0,
        kostgeld: 0,
        woonlasten: 0,
        energieGas: 0,
        water: 0,
        bijdrageEGW: 0,
        ziektekostenPremie: 0,
        aansprakelijkheid: 0,
        reis: 0,
        opstal: 0,
        uitvaart: 0,
        rechtsbijstand: 0,
        overlijdensrisico: 0,
        internetTv: 0,
        sport: 0,
        lezen: 0,
        contributie: 0,
        autos: [],
        items: [],
        totalAmount: 0,
      },
    },
    latestTransaction: {
      latestTransactionDate: '2025-01-15',
      latestTransactionAmount: 0,
      latestTransactionCategory: null,
      latestTransactionDescription: '',
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
      totalIncomeDisplay: '€ 0,00',
      totalExpensesDisplay: '€ 0,00',
      netDisplay: '€ 0,00',
    },
  },
  meta: {
    lastModified: '2025-01-15T10:00:00.000Z',
    version: 1,
  },
}


  const mockEnvelope = {
    version: 2, // ENVELOPE_VERSION
    state: { ...mockFormState, schemaVersion: '1.0' },
  };

  const mockStorageKey = '@CashflowWizardState';
  const mockThemeKey = '@Theme';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loadState', () => {
    it('should return null when no data exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await StorageShim.loadState();

      expect(result).toBeNull();
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(mockStorageKey);
    });

    it('should return state when envelope version matches', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockEnvelope));

      const result = await StorageShim.loadState();

      expect(result).toEqual(mockEnvelope.state);
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(mockStorageKey);
    });

    it('should return null when envelope version mismatches', async () => {
      const oldEnvelope = { ...mockEnvelope, version: 1 };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(oldEnvelope));

      const result = await StorageShim.loadState();

      expect(result).toBeNull();
    });

    it('should return null and log error on malformed JSON', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid-json');

      const result = await StorageShim.loadState();

      expect(result).toBeNull();
      expect(AuditLogger.error).toHaveBeenCalledWith('STORAGE_LOAD_FAILURE', {
        error: expect.any(Error),
      });
    });

    it('should return null and log error on AsyncStorage failure', async () => {
      const error = new Error('Storage error');
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(error);

      const result = await StorageShim.loadState();

      expect(result).toBeNull();
      expect(AuditLogger.error).toHaveBeenCalledWith('STORAGE_LOAD_FAILURE', {
        error,
      });
    });
  });

  describe('saveState', () => {
    it('should save state with envelope and schemaVersion', async () => {
      await StorageShim.saveState(mockFormState);

      const expectedState = {
        ...mockFormState,
        schemaVersion: '1.0', // CURRENT_SCHEMA_VERSION
      };
      const expectedEnvelope = {
        version: 2, // ENVELOPE_VERSION
        state: expectedState,
      };

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        mockStorageKey,
        JSON.stringify(expectedEnvelope)
      );
    });

    it('should log error on save failure', async () => {
      const error = new Error('Save failed');
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(error);

      await StorageShim.saveState(mockFormState);

      expect(AuditLogger.error).toHaveBeenCalledWith('STORAGE_SAVE_FAILURE', {
        error,
      });
    });
  });

  describe('loadTheme', () => {
    it('should return "light" theme when stored', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('light');

      const result = await StorageShim.loadTheme();

      expect(result).toBe('light');
      expect(AsyncStorage.getItem).toHaveBeenCalledWith(mockThemeKey);
    });

    it('should return "dark" theme when stored', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('dark');

      const result = await StorageShim.loadTheme();

      expect(result).toBe('dark');
    });

    it('should return null when no theme stored', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      const result = await StorageShim.loadTheme();

      expect(result).toBeNull();
    });

    it('should return null for invalid theme value', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid-theme');

      const result = await StorageShim.loadTheme();

      expect(result).toBeNull();
    });

    it('should log error on load failure', async () => {
      const error = new Error('Load failed');
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(error);

      const result = await StorageShim.loadTheme();

      expect(result).toBeNull();
      expect(AuditLogger.error).toHaveBeenCalledWith('THEME_LOAD_FAILURE', {
        error,
      });
    });
  });

  describe('saveTheme', () => {
    it('should save light theme', async () => {
      await StorageShim.saveTheme('light');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(mockThemeKey, 'light');
    });

    it('should save dark theme', async () => {
      await StorageShim.saveTheme('dark');

      expect(AsyncStorage.setItem).toHaveBeenCalledWith(mockThemeKey, 'dark');
    });

    it('should log error on save failure', async () => {
      const error = new Error('Save failed');
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(error);

      await StorageShim.saveTheme('light');

      expect(AuditLogger.error).toHaveBeenCalledWith('THEME_SAVE_FAILURE', {
        error,
      });
    });
  });

  describe('clearAll', () => {
    it('should remove storage key', async () => {
      await StorageShim.clearAll();

      expect(AsyncStorage.removeItem).toHaveBeenCalledWith(mockStorageKey);
    });

    it('should log error on clear failure', async () => {
      const error = new Error('Clear failed');
      (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(error);

      await StorageShim.clearAll();

      expect(AuditLogger.error).toHaveBeenCalledWith('STORAGE_CLEAR_FAILURE', {
        error,
      });
    });
  });

  describe('integration scenarios', () => {
    it('should successfully save and load state', async () => {
      // Mock save
      (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
      
      await StorageShim.saveState(mockFormState);

      // Mock load
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify({
          version: 2,
          state: { ...mockFormState, schemaVersion: '1.0' },
        })
      );

      const loaded = await StorageShim.loadState();

      expect(loaded).toEqual({ ...mockFormState, schemaVersion: '1.0' });
    });

    it('should handle version migration scenario', async () => {
      // Oude versie data
      const oldData = {
        version: 1,
        state: mockFormState,
      };
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(oldData));

      const result = await StorageShim.loadState();

      // Moet null teruggeven bij version mismatch
      expect(result).toBeNull();
      
      // Geen automatische migratie (dat is taak van migratieService)
      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });
  });
});