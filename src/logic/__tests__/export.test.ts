import { aggregateExportData } from '../export';
import { TransactionService } from '../../services/transactionService';
import { FormState } from '@state/schemas/FormStateSchema';

// 1. Mock de TransactionService
jest.mock('../../services/transactionService');
const mockedTxService = TransactionService as jest.Mocked<typeof TransactionService>;

describe('Export Logic & Aggregator', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Sectie 1: Service Mocks (Jouw bestaande test) ---
  it('moet alle transacties kunnen wissen voor een export', async () => {
    mockedTxService.clearAll.mockResolvedValue(undefined);
    
    await TransactionService.clearAll();

    expect(mockedTxService.clearAll).toHaveBeenCalledTimes(1);
  });

  // --- Sectie 2: Data Aggregation (Voor 100% Line & Branch coverage) ---
  describe('aggregateExportData', () => {
    
    it('moet een volledige state correct transformeren en anonymiseren', () => {
      const mockState = {
        schemaVersion: 2,
        C1: { aantalVolwassen: 6 }, // Trigger: isSpecialStatus = true (> 5)
        C4: {
          leden: [
            { memberType: 'adult', leeftijd: 35, firstName: 'Geheim', lastName: 'Persoon' },
            { memberType: 'child', leeftijd: 12, firstName: 'Kind', lastName: 'Anoniem' }
          ]
        },
        C7: { items: [{ label: 'Salaris', value: 250000 }] }, // Cents
        C10: { items: [{ label: 'Huur', value: 80000 }] }
      } as unknown as FormState;

      const result = aggregateExportData(mockState);

      // Controleer de Phoenix-export structuur
      expect(result.version).toBe('1.0-phoenix-export');
      expect(result.schemaVersion).toBe(2);
      expect(result.isSpecialStatus).toBe(true);
      
      // Controleer of PII (namen) zijn weggefilterd (mapping check)
      expect(result.household.members).toHaveLength(2);
      expect(result.household.members[0]).toEqual({
        type: 'adult',
        leeftijd: 35
      });
      // firstName/lastName mogen niet aanwezig zijn in het resultaat
      expect((result.household.members[0] as any).firstName).toBeUndefined();

      // Financiën check
      expect(result.finances.income).toHaveLength(1);
      expect(result.finances.expenses).toHaveLength(1);
      expect(result.exportDate).toMatch(/^\d{4}-\d{2}-\d{2}/); // ISO datum check
    });

    it('moet correct omgaan met lege of ontbrekende velden (edge cases)', () => {
      // Scenario waarbij optionele secties ontbreken (test de ?? en || operators)
      const emptyState = {
        schemaVersion: 1,
        C1: undefined,
        C4: null,
        C7: { items: [] }
      } as unknown as FormState;

      const result = aggregateExportData(emptyState);

      expect(result.household.totalAdults).toBe(0);
      expect(result.isSpecialStatus).toBe(false);
      expect(result.household.members).toEqual([]);
      expect(result.finances.expenses).toEqual([]);
    });
  });
});