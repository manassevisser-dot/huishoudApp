// src/app/workflows/DailyTransactionWorkflow.test.ts
import { DailyTransactionWorkflow } from './DailyTransactionWorkflow';
import type { FormStateOrchestrator } from '@app/orchestrators/FormStateOrchestrator';
import type { BusinessManager } from '@app/orchestrators/managers/BusinessManager';
import { computePhoenixSummary } from '@domain/rules/calculateRules';
import { logger } from '@adapters/audit/AuditLoggerAdapter';

// Mock dependencies
jest.mock('@domain/rules/calculateRules');
jest.mock('@adapters/audit/AuditLoggerAdapter', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('DailyTransactionWorkflow', () => {
  let workflow: DailyTransactionWorkflow;
  let mockFso: jest.Mocked<FormStateOrchestrator>;
  let mockBusiness: jest.Mocked<BusinessManager>;
  let mockState: any;

  const validTransaction = {
    latestTransactionDate: '2024-01-15',
    latestTransactionAmount: 42.50,
    latestTransactionCategory: 'Boodschappen',
    latestTransactionDescription: 'Test transactie',
    latestPaymentMethod: 'pin' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock state
    mockState = {
      data: {
        latestTransaction: { ...validTransaction },
        finance: {
          income: {},
          expenses: {
            items: [],
            totalAmount: 0,
          },
        },
      },
    };

    // Mock FSO
    mockFso = {
      getState: jest.fn().mockReturnValue(mockState),
      dispatch: jest.fn(),
    } as any;

    // Mock Business
    mockBusiness = {
      recompute: jest.fn(),
    } as any;

    // Mock computePhoenixSummary
    (computePhoenixSummary as jest.Mock).mockReturnValue({
      totalExpensesCents: 4250,
    });

    workflow = new DailyTransactionWorkflow();
  });

  describe('execute', () => {
    it('should successfully save a valid transaction', () => {
      // Act
      const result = workflow.execute(mockFso, mockBusiness);

      // Assert
      expect(result).toBe(true);

      // Check dispatch call
      expect(mockFso.dispatch).toHaveBeenCalledTimes(1);
      const dispatchCall = mockFso.dispatch.mock.calls[0][0];
      expect(dispatchCall.type).toBe('UPDATE_DATA');
      
      // ✅ FIXED: Safe navigation met optional chaining en checks
      if (dispatchCall.type === 'UPDATE_DATA' && 'payload' in dispatchCall) {
        const payload = dispatchCall.payload;
        
        // Check dat de expense item is toegevoegd
        expect(payload?.finance?.expenses?.items).toHaveLength(1);
        expect(payload?.finance?.expenses?.items?.[0]).toMatchObject({
          amount: 42.50,
          category: 'Boodschappen',
          description: 'Test transactie',
          paymentMethod: 'pin',
          date: '2024-01-15',
        });
        expect(payload?.finance?.expenses?.items?.[0]?.fieldId).toMatch(/^expense_\d+$/);

        // Check dat latestTransaction is gereset
        expect(payload?.latestTransaction).toEqual({
          latestTransactionDate: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
          latestTransactionAmount: 0,
          latestTransactionCategory: null,
          latestTransactionDescription: '',
          latestPaymentMethod: 'pin',
        });
      } else {
        fail('Expected UPDATE_DATA action with payload');
      }

      // Check business recompute
      expect(mockBusiness.recompute).toHaveBeenCalledWith(mockFso);

      // Check logging
      expect(logger.info).toHaveBeenCalledWith('transaction_saved', expect.any(Object));
    });

    it('should return false when transaction is undefined', () => {
      // Arrange
      mockState.data.latestTransaction = undefined;

      // Act
      const result = workflow.execute(mockFso, mockBusiness);

      // Assert
      expect(result).toBe(false);
      expect(logger.warn).toHaveBeenCalledWith('transaction_form_not_initialized', expect.any(Object));
      expect(mockFso.dispatch).not.toHaveBeenCalled();
      expect(mockBusiness.recompute).not.toHaveBeenCalled();
    });

    it('should return false when transaction is null', () => {
      // Arrange
      mockState.data.latestTransaction = null;

      // Act
      const result = workflow.execute(mockFso, mockBusiness);

      // Assert
      expect(result).toBe(false);
      expect(logger.warn).toHaveBeenCalledWith('transaction_form_not_initialized', expect.any(Object));
    });

    it('should return false when amount is not a number', () => {
      // Arrange
      mockState.data.latestTransaction.latestTransactionAmount = 'invalid' as any;

      // Act
      const result = workflow.execute(mockFso, mockBusiness);

      // Assert
      expect(result).toBe(false);
      expect(logger.warn).toHaveBeenCalledWith('transaction_invalid_amount', expect.any(Object));
    });

    it('should return false when amount is zero', () => {
      // Arrange
      mockState.data.latestTransaction.latestTransactionAmount = 0;

      // Act
      const result = workflow.execute(mockFso, mockBusiness);

      // Assert
      expect(result).toBe(false);
      expect(logger.warn).toHaveBeenCalledWith('transaction_invalid_amount', expect.any(Object));
    });

    it('should return false when amount is negative', () => {
      // Arrange
      mockState.data.latestTransaction.latestTransactionAmount = -10;

      // Act
      const result = workflow.execute(mockFso, mockBusiness);

      // Assert
      expect(result).toBe(false);
      expect(logger.warn).toHaveBeenCalledWith('transaction_invalid_amount', expect.any(Object));
    });

    it('should return false when category is not a string', () => {
      // Arrange
      mockState.data.latestTransaction.latestTransactionCategory = 123 as any;

      // Act
      const result = workflow.execute(mockFso, mockBusiness);

      // Assert
      expect(result).toBe(false);
      expect(logger.warn).toHaveBeenCalledWith('transaction_category_required', expect.any(Object));
    });

    it('should return false when category is empty string', () => {
      // Arrange
      mockState.data.latestTransaction.latestTransactionCategory = '';

      // Act
      const result = workflow.execute(mockFso, mockBusiness);

      // Assert
      expect(result).toBe(false);
      expect(logger.warn).toHaveBeenCalledWith('transaction_category_required', expect.any(Object));
    });

    it('should handle missing description and payment method', () => {
      // Arrange
      mockState.data.latestTransaction = {
        latestTransactionDate: '2024-01-15',
        latestTransactionAmount: 42.50,
        latestTransactionCategory: 'Boodschappen',
        // description en paymentMethod ontbreken
      };

      // Act
      const result = workflow.execute(mockFso, mockBusiness);

      // Assert
      expect(result).toBe(true);
      
      const dispatchCall = mockFso.dispatch.mock.calls[0][0];
      if (dispatchCall.type === 'UPDATE_DATA' && 'payload' in dispatchCall) {
        const payload = dispatchCall.payload;
        const expenseItem = payload?.finance?.expenses?.items?.[0];
        expect(expenseItem?.description).toBe('');
        expect(expenseItem?.paymentMethod).toBe('pin');
      } else {
        fail('Expected UPDATE_DATA action with payload');
      }
    });

    it('should handle missing date', () => {
      // Arrange
      mockState.data.latestTransaction = {
        latestTransactionAmount: 42.50,
        latestTransactionCategory: 'Boodschappen',
        latestTransactionDescription: 'Test',
        latestPaymentMethod: 'pin',
        // date ontbreekt
      };

      // Act
      const result = workflow.execute(mockFso, mockBusiness);

      // Assert
      expect(result).toBe(true);
      
      const dispatchCall = mockFso.dispatch.mock.calls[0][0];
      if (dispatchCall.type === 'UPDATE_DATA' && 'payload' in dispatchCall) {
        const payload = dispatchCall.payload;
        const expenseItem = payload?.finance?.expenses?.items?.[0];
        expect(expenseItem?.date).toMatch(/^\d{4}-\d{2}-\d{2}$/); // vandaag
      } else {
        fail('Expected UPDATE_DATA action with payload');
      }
    });

    it('should preserve existing expense items', () => {
      // Arrange
      const existingItem = {
        fieldId: 'expense_123',
        amount: 10,
        category: 'Huur',
        description: 'Oude transactie',
        paymentMethod: 'pin',
        date: '2024-01-01',
      };
      mockState.data.finance.expenses.items = [existingItem];

      // Act
      const result = workflow.execute(mockFso, mockBusiness);

      // Assert
      expect(result).toBe(true);
      
      const dispatchCall = mockFso.dispatch.mock.calls[0][0];
      if (dispatchCall.type === 'UPDATE_DATA' && 'payload' in dispatchCall) {
        const payload = dispatchCall.payload;
        const items = payload?.finance?.expenses?.items;
        expect(items).toHaveLength(2);
        expect(items?.[0]).toBe(existingItem); // bestaande item blijft
        expect(items?.[1]).toMatchObject({
          amount: 42.50,
          category: 'Boodschappen',
        });
      } else {
        fail('Expected UPDATE_DATA action with payload');
      }
    });

    it('should calculate totalAmount using computePhoenixSummary', () => {
      // Arrange
      (computePhoenixSummary as jest.Mock).mockReturnValue({
        totalExpensesCents: 5000,
      });

      // Act
      workflow.execute(mockFso, mockBusiness);

      // Assert
      expect(computePhoenixSummary).toHaveBeenCalled();
      const dispatchCall = mockFso.dispatch.mock.calls[0][0];
      if (dispatchCall.type === 'UPDATE_DATA' && 'payload' in dispatchCall) {
        const payload = dispatchCall.payload;
        expect(payload?.finance?.expenses?.totalAmount).toBe(5000);
      } else {
        fail('Expected UPDATE_DATA action with payload');
      }
    });
  });

  describe('buildExpenseItem', () => {
    it('should generate unique fieldId based on timestamp', () => {
      // Mock Date.now voor voorspelbare test
      const mockNow = 1234567890;
      jest.spyOn(Date, 'now').mockReturnValue(mockNow);

      workflow.execute(mockFso, mockBusiness);

      const dispatchCall = mockFso.dispatch.mock.calls[0][0];
      if (dispatchCall.type === 'UPDATE_DATA' && 'payload' in dispatchCall) {
        const payload = dispatchCall.payload;
        const expenseItem = payload?.finance?.expenses?.items?.[0];
        expect(expenseItem?.fieldId).toBe(`expense_${mockNow}`);
      } else {
        fail('Expected UPDATE_DATA action with payload');
      }

      jest.restoreAllMocks();
    });
  });

  describe('persistAndReset', () => {
    it('should reset latestTransaction to default values', () => {
      // Arrange
      const today = new Date().toISOString().split('T')[0];

      // Act
      workflow.execute(mockFso, mockBusiness);

      // Assert
      const dispatchCall = mockFso.dispatch.mock.calls[0][0];
      if (dispatchCall.type === 'UPDATE_DATA' && 'payload' in dispatchCall) {
        const payload = dispatchCall.payload;
        expect(payload?.latestTransaction).toEqual({
          latestTransactionDate: today,
          latestTransactionAmount: 0,
          latestTransactionCategory: null,
          latestTransactionDescription: '',
          latestPaymentMethod: 'pin',
        });
      } else {
        fail('Expected UPDATE_DATA action with payload');
      }
    });

    it('should handle empty existing items array', () => {
      // Arrange
      mockState.data.finance.expenses.items = [];

      // Act
      workflow.execute(mockFso, mockBusiness);

      // Assert
      const dispatchCall = mockFso.dispatch.mock.calls[0][0];
      if (dispatchCall.type === 'UPDATE_DATA' && 'payload' in dispatchCall) {
        const payload = dispatchCall.payload;
        expect(payload?.finance?.expenses?.items).toHaveLength(1);
      } else {
        fail('Expected UPDATE_DATA action with payload');
      }
    });
  });
});