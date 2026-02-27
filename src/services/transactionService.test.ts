// src/services/transactionService.test.ts
import { StorageShim } from '@services/storageShim';
import { Logger } from '@adapters/audit/AuditLoggerAdapter';
import { LegacyValidator } from '@adapters/validation/LegacyStateAdapter';
import { TransactionService, migrateTransactionsToPhoenix, undoLastTransaction } from './transactionService';
import type { LegacyState } from '@adapters/validation/LegacyStateAdapter';

// Mocks
jest.mock('@services/storageShim', () => ({
  StorageShim: {
    loadState: jest.fn(),
    clearAll: jest.fn(),
  },
}));

jest.mock('@adapters/audit/AuditLoggerAdapter', () => ({
  Logger: {
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('@adapters/validation/LegacyStateAdapter', () => {
  const actual = jest.requireActual('@adapters/validation/LegacyStateAdapter');
  return {
    ...actual,
    LegacyValidator: {
      parseState: jest.fn(),
    },
  };
});

describe('TransactionService', () => {
  // Mock data - AANGEPAST: Zet ALLE data direct op root level
  const mockLegacyMember = {
    firstName: 'Jan',
    memberType: 'adult',
    id: 'mem-1',
  };

  // ✅ FIX 1: Vereenvoudig de mock state - zet ALLES op root level
  const mockLegacyState: Partial<LegacyState> = {
    setup: {
      aantalMensen: 2,
      aantalVolwassen: 2,
      autoCount: 'Ja',
      heeftHuisdieren: true,
    },
    household: {
      leden: [mockLegacyMember],
    },
    // ✅ Zet finance items direct op root level als 'transactions'
    transactions: [
      { fieldId: 'salary', amount: 2500 },
      { fieldId: 'bonus', amount: 500 },
      { fieldId: 'rent', amount: 1200 },
      { fieldId: 'groceries', amount: 400 },
      { fieldId: 'legacy_income', amount: 1000 },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // ✅ FIX: parseState moet gewoon de state doorgeven
    (LegacyValidator.parseState as jest.Mock).mockImplementation((state) => state);
  });

  describe('migrateTransactionsToPhoenix', () => {
    it('should successfully migrate legacy state to Phoenix format', async () => {
      (LegacyValidator.parseState as jest.Mock).mockReturnValue(mockLegacyState);

      const result = await migrateTransactionsToPhoenix(mockLegacyState);

      expect(LegacyValidator.parseState).toHaveBeenCalledWith(mockLegacyState);
      
      // ✅ Nu zou dit moeten werken omdat alle transacties op de juiste plek staan
      expect(result).toEqual({
        schemaVersion: '1.0',
        data: {
          setup: {
            aantalMensen: 2,
            aantalVolwassen: 2,
            autoCount: 'Ja',
            heeftHuisdieren: true,
          },
          household: {
            members: [
              {
                entityId: 'mem-1',
                firstName: 'Jan',
                lastName: '',
                memberType: 'adult',
                naam: 'Jan',
                name: 'Jan',
              },
            ],
          },
          transactions: [
            { fieldId: 'salary', amount: 2500 },
            { fieldId: 'bonus', amount: 500 },
            { fieldId: 'rent', amount: 1200 },
            { fieldId: 'groceries', amount: 400 },
            { fieldId: 'legacy_income', amount: 1000 },
          ],
        },
        meta: {
          lastModified: expect.any(String),
          version: 1,
          itemsProcessed: 1,
        },
      });
    });

    it('should handle different legacy state structures', async () => {
      const alternateState = {
        data: {
          setup: { aantalMensen: 3 },
          household: { leden: [{ naam: 'Test', type: 'CHILD' }] },
        },
      };
      (LegacyValidator.parseState as jest.Mock).mockReturnValue(alternateState);

      const result = await migrateTransactionsToPhoenix(alternateState);

      expect(result.data.setup.aantalMensen).toBe(3);
      expect(result.data.household.members[0].name).toBe('Test');
    });

    it('should handle members with different name formats', async () => {
      const stateWithNames = {
        household: {
          leden: [
            { firstName: 'Jan', lastName: 'Jansen', type: 'ADULT' },
            { naam: 'Piet Pietersen', type: 'ADULT' },
            { firstName: '', naam: 'Klaas', type: 'CHILD' },
          ],
        },
      };
      (LegacyValidator.parseState as jest.Mock).mockReturnValue(stateWithNames);

      const result = await migrateTransactionsToPhoenix(stateWithNames);
      const members = result.data.household.members;

      expect(members[0]).toEqual(expect.objectContaining({
        name: 'Jan',
        firstName: 'Jan',
        lastName: '',
      }));
      expect(members[1]).toEqual(expect.objectContaining({
        name: 'Piet Pietersen',
        firstName: 'Piet',
        lastName: 'Pietersen',
      }));
    });

    it('should handle memberType conversion via toMemberType', async () => {
      const stateWithTypes = {
        household: {
          leden: [
            { firstName: 'Test1', memberType: 'ADULT' },
            { firstName: 'Test2', type: 'CHILD' },
            { firstName: 'Test3', memberType: 'SENIOR' },
          ],
        },
      };
      (LegacyValidator.parseState as jest.Mock).mockReturnValue(stateWithTypes);

      const result = await migrateTransactionsToPhoenix(stateWithTypes);
      const members = result.data.household.members;

      expect(members[0].memberType).toBeDefined();
      expect(members[1].memberType).toBeDefined();
      expect(members[2].memberType).toBeDefined();
    });

    it('should use fallback entityId when missing', async () => {
      const stateWithoutIds = {
        household: {
          leden: [
            { firstName: 'Test1', type: 'ADULT' },
            { firstName: 'Test2', type: 'CHILD' },
          ],
        },
      };
      (LegacyValidator.parseState as jest.Mock).mockReturnValue(stateWithoutIds);

      const result = await migrateTransactionsToPhoenix(stateWithoutIds);
      const members = result.data.household.members;

      expect(members[0].entityId).toBe('m-0');
      expect(members[1].entityId).toBe('m-1');
    });
  }); // ✅ Einde van describe('migrateTransactionsToPhoenix')

  describe('getAllTransactions', () => {
    beforeEach(() => {
      (StorageShim.loadState as jest.Mock).mockReset();
    });

    it('should return all income and expense items', async () => {
  // ✅ CORRECTE structuur voor getAllTransactions
  const stateWithFinance = {
    data: {
      finance: {
        income: {
          items: [
            { fieldId: 'salary', amount: 2500 },
            { fieldId: 'bonus', amount: 500 },
          ],
        },
        expenses: {
          items: [
            { fieldId: 'rent', amount: 1200 },
            { fieldId: 'groceries', amount: 400 },
          ],
        },
      },
    },
  };
  
  (StorageShim.loadState as jest.Mock).mockResolvedValue(stateWithFinance);

  const result = await TransactionService.getAllTransactions();

  expect(result).toEqual([
    { fieldId: 'salary', amount: 2500 },
    { fieldId: 'bonus', amount: 500 },
    { fieldId: 'rent', amount: 1200 },
    { fieldId: 'groceries', amount: 400 },
  ]);
});

    it('should return empty array when no finance data exists', async () => {
      (StorageShim.loadState as jest.Mock).mockResolvedValue({
        data: {},
      });

      const result = await TransactionService.getAllTransactions();

      expect(result).toEqual([]);
    });

    it('should return empty array when state is null', async () => {
      (StorageShim.loadState as jest.Mock).mockResolvedValue(null);

      const result = await TransactionService.getAllTransactions();

      expect(result).toEqual([]);
    });

    it('should filter out invalid items', async () => {
      (StorageShim.loadState as jest.Mock).mockResolvedValue({
        data: {
          finance: {
            income: {
              items: [
                { fieldId: 'valid', amount: 100 },
                { fieldId: 'invalid' },
                { amount: 200 },
                { fieldId: 'also-valid', amount: 300 },
              ],
            },
            expenses: {
              items: [
                { fieldId: 'expense', amount: 50 },
                { notEvenClose: true },
              ],
            },
          },
        },
      });

      const result = await TransactionService.getAllTransactions();

      expect(result).toEqual([
        { fieldId: 'valid', amount: 100 },
        { fieldId: 'also-valid', amount: 300 },
        { fieldId: 'expense', amount: 50 },
      ]);
    });

    it('should handle missing income or expense sections', async () => {
      (StorageShim.loadState as jest.Mock).mockResolvedValue({
        data: {
          finance: {
            income: { items: [{ fieldId: 'only-income', amount: 100 }] },
          },
        },
      });

      const result = await TransactionService.getAllTransactions();

      expect(result).toEqual([
        { fieldId: 'only-income', amount: 100 },
      ]);
    });
  }); // ✅ Einde van describe('getAllTransactions')

    describe('memberType conversion', () => {
    it('should handle different memberType formats', async () => {
      const testCases = [
        { input: 'ADULT', expected: 'adult' },
        { input: 'adult', expected: 'adult' },
        { input: 'Adult', expected: 'adult' },
        { input: 'CHILD', expected: 'child' },
        { input: 'SENIOR', expected: 'senior' },
      ];

      for (const { input, expected } of testCases) {
        // ✅ FIX 2: Gebruik een UNIEKE id voor elke test case
        const uniqueId = `test-${input}-${Date.now()}-${Math.random()}`;
        
        const state = {
          household: {
            leden: [{ 
              firstName: `Test-${input}`, 
              memberType: input, 
              id: uniqueId  // ✅ Unieke ID!
            }],
          },
        };
        
        (LegacyValidator.parseState as jest.Mock).mockReturnValue(state);

        const result = await migrateTransactionsToPhoenix(state);
        
      
        expect(result.data.household.members[0].memberType).toBe(expected);
      }
    });
    it('should throw error for invalid memberType', async () => {
  const state = {
    household: {
      leden: [{ 
        firstName: 'Test', 
        memberType: 'tiener',  // Ongeldige waarde door bug in ageRules
        id: '1' 
      }],
    },
  };
  
  (LegacyValidator.parseState as jest.Mock).mockReturnValue(state);

  // ✅ Verwacht dat er een fout wordt gegooid
  await expect(migrateTransactionsToPhoenix(state)).rejects.toThrow(
    'Ongeldige memberType'
  );
});
  });
}); 

  describe('undoLastTransaction', () => {
    it('should log warning and return null', async () => {
      const result = await undoLastTransaction();

      expect(result).toBeNull();
      expect(Logger.warn).toHaveBeenCalledWith('Undo functionaliteit nog niet geïmplementeerd');
    });
  }); // ✅ Einde van describe('undoLastTransaction')

  describe('clearAll', () => {
    it('should call StorageShim.clearAll', async () => {
      (StorageShim.clearAll as jest.Mock).mockResolvedValue(undefined);

      await TransactionService.clearAll();

      expect(StorageShim.clearAll).toHaveBeenCalled();
    });
  }); // ✅ Einde van describe('clearAll')

  describe('edge cases and error handling', () => {
    it('should handle null/undefined values in setup source', async () => {
      const stateWithNulls = {
        setup: {
          aantalMensen: null,
          aantalVolwassen: null,
          autoCount: null,
          heeftHuisdieren: null,
        },
      };
      (LegacyValidator.parseState as jest.Mock).mockReturnValue(stateWithNulls);

      const result = await migrateTransactionsToPhoenix(stateWithNulls);

      expect(result.data.setup).toEqual({
        aantalMensen: 0,
        aantalVolwassen: 0,
        autoCount: 'Nee',
        heeftHuisdieren: false,
      });
    });

    it('should handle missing setup properties', async () => {
      const stateWithMissingProps = {
        setup: {
          aantalMensen: null,
        },
      };
      (LegacyValidator.parseState as jest.Mock).mockReturnValue(stateWithMissingProps);

      const result = await migrateTransactionsToPhoenix(stateWithMissingProps);

      expect(result.data.setup).toEqual({
        aantalMensen: 0,
        aantalVolwassen: 0,
        autoCount: 'Nee',
        heeftHuisdieren: false,
      });
    });
  }); 
