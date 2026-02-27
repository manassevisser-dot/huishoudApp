// src/app/orchestrators/managers/BusinessManager.test.ts
/**
 * @file_intent Unit tests voor BusinessManager - business logic facade
 */
import { BusinessManager } from './BusinessManager';
import { FinancialOrchestrator } from '../FinancialOrchestrator';
import type { FormStateOrchestrator } from '../FormStateOrchestrator';
import type { FormState } from '@core/types/core';
import type { FinancialSummaryVM } from '../interfaces/IBusinessOrchestrator';

// Mocks
jest.mock('../FinancialOrchestrator');

describe('BusinessManager', () => {
  let businessManager: BusinessManager;
  let mockFinancialOrch: jest.Mocked<FinancialOrchestrator>;
  let mockFSO: jest.Mocked<FormStateOrchestrator>;
  let mockState: FormState;
  let mockSummary: FinancialSummaryVM;

  // Minimal valid FormState volgens Zod schema's
  const createMinimalState = (overrides?: Partial<FormState>): FormState => ({
    schemaVersion: '1.0',                    // literal '1.0'
    activeStep: 'LANDING',
    currentScreenId: 'landing',
    isValid: true,
    meta: {
      lastModified: new Date().toISOString(),
      version: 1.0,                           // number
    },
    data: {
      setup: {
        aantalMensen: 1,
        aantalVolwassen: 1,
        autoCount: '0',
        woningType: 'huur',
      },
      household: {
        members: [],
      },
      finance: {
        income: { items: [], totalAmount: 0 },
        expenses: { items: [], totalAmount: 0 },
        hasMissingCosts: false,
      },
      latestTransaction: {
        latestTransactionDate: new Date().toISOString().split('T')[0],
        latestTransactionAmount: 0,
        latestTransactionCategory: null,
        latestTransactionDescription: '',
        latestPaymentMethod: 'pin',
      },
      csvImport: {
        transactions: [],                      // required door schema
        importedAt: new Date().toISOString(),  // required
        period: null,                           // nullable
        status: 'idle',                         // enum: idle | parsed | analyzed
        fileName: '',                            // required string
        transactionCount: 0,                     // required number
      },
    },
    viewModels: {},                             // optional, maar default empty object
    ...overrides,
  });

  // Minimal valid FinancialSummaryVM volgens viewModels schema
  const createMinimalSummary = (overrides?: Partial<FinancialSummaryVM>): FinancialSummaryVM => ({
    totalIncomeDisplay: '€ 0',
    totalExpensesDisplay: '€ 0',
    netDisplay: '€ 0',
    ...overrides,
  });

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock FinancialOrchestrator
    mockFinancialOrch = {
      prepareViewModel: jest.fn(),
    } as unknown as jest.Mocked<FinancialOrchestrator>;
    
    (FinancialOrchestrator as jest.Mock).mockImplementation(() => mockFinancialOrch);

    // Mock FormStateOrchestrator
    mockFSO = {
      getState: jest.fn(),
      dispatch: jest.fn(),
      getValue: jest.fn(),
      updateField: jest.fn(),
      getValidationError: jest.fn(),
    } as unknown as jest.Mocked<FormStateOrchestrator>;

    // Basis state
    mockState = createMinimalState();
    mockFSO.getState.mockReturnValue(mockState);

    // Basis summary
    mockSummary = createMinimalSummary();
    mockFinancialOrch.prepareViewModel.mockReturnValue(mockSummary);

    businessManager = new BusinessManager(mockFinancialOrch);
  });

  // =========================================================================
  // CONSTRUCTOR
  // =========================================================================

  describe('constructor', () => {
  it('should accept FinancialOrchestrator as dependency', () => {
    // We mocken FinancialOrchestrator, maar de instantie wordt doorgegeven in constructor
    // Dus FinancialOrchestrator constructor wordt NIET opnieuw aangeroepen
    expect(businessManager).toBeDefined();
    
    // Check of de meegegeven mock is gebruikt
    const anyManager = businessManager as any;
    expect(anyManager.financialOrch).toBe(mockFinancialOrch);
  });
});

  // =========================================================================
  // prepareFinancialViewModel
  // =========================================================================

  describe('prepareFinancialViewModel', () => {
    it('should delegate to FinancialOrchestrator.prepareViewModel', () => {
      // Act
      const result = businessManager.prepareFinancialViewModel(mockState);

      // Assert
      expect(mockFinancialOrch.prepareViewModel).toHaveBeenCalledTimes(1);
      expect(mockFinancialOrch.prepareViewModel).toHaveBeenCalledWith(mockState);
      expect(result).toBe(mockSummary);
    });

    it('should pass through any errors from FinancialOrchestrator', () => {
      // Arrange
      const expectedError = new Error('Calculation failed');
      mockFinancialOrch.prepareViewModel.mockImplementation(() => {
        throw expectedError;
      });

      // Act & Assert
      expect(() => businessManager.prepareFinancialViewModel(mockState)).toThrow(expectedError);
    });

    it('should handle empty finance data gracefully', () => {
      // Arrange
      const emptyState = createMinimalState({
        data: {
          ...mockState.data,
          finance: {
            income: { items: [], totalAmount: 0 },
            expenses: { items: [], totalAmount: 0 },
            hasMissingCosts: false,
          },
        },
      });
      
      const emptySummary = createMinimalSummary();
      mockFinancialOrch.prepareViewModel.mockReturnValue(emptySummary);

      // Act
      const result = businessManager.prepareFinancialViewModel(emptyState);

      // Assert
      expect(result.totalIncomeDisplay).toBe('€ 0');
      expect(result.totalExpensesDisplay).toBe('€ 0');
      expect(result.netDisplay).toBe('€ 0');
    });
  });

  // =========================================================================
  // recompute
  // =========================================================================

  describe('recompute', () => {
    it('should get state, prepare summary and dispatch UPDATE_VIEWMODEL', () => {
      // Act
      businessManager.recompute(mockFSO);

      // Assert
      expect(mockFSO.getState).toHaveBeenCalledTimes(1);
      expect(mockFinancialOrch.prepareViewModel).toHaveBeenCalledTimes(1);
      expect(mockFinancialOrch.prepareViewModel).toHaveBeenCalledWith(mockState);
      expect(mockFSO.dispatch).toHaveBeenCalledTimes(1);
      expect(mockFSO.dispatch).toHaveBeenCalledWith({
        type: 'UPDATE_VIEWMODEL',
        payload: { financialSummary: mockSummary },
      });
    });

    it('should use the FSO passed as parameter (not stored in instance)', () => {
      // Arrange
      const mockFSO2 = {
        getState: jest.fn().mockReturnValue(createMinimalState()),
        dispatch: jest.fn(),
        getValue: jest.fn(),
        updateField: jest.fn(),
        getValidationError: jest.fn(),
      } as unknown as jest.Mocked<FormStateOrchestrator>;

      // Act
      businessManager.recompute(mockFSO2);

      // Assert
      expect(mockFSO2.getState).toHaveBeenCalled();
      expect(mockFSO2.dispatch).toHaveBeenCalled();
      expect(mockFSO.getState).not.toHaveBeenCalled();
    });

    it('should propagate errors from prepareFinancialViewModel', () => {
      // Arrange
      const expectedError = new Error('Failed to prepare view model');
      mockFinancialOrch.prepareViewModel.mockImplementation(() => {
        throw expectedError;
      });

      // Act & Assert
      expect(() => businessManager.recompute(mockFSO)).toThrow(expectedError);
      expect(mockFSO.getState).toHaveBeenCalledTimes(1);
      expect(mockFSO.dispatch).not.toHaveBeenCalled();
    });
  });

  // =========================================================================
  // STATELESS VERIFICATIE
  // =========================================================================

  describe('stateless design', () => {
    it('should not store FSO in instance (parameter only)', () => {
      // Arrange
      const instance = businessManager as any;
      
      // Act
      businessManager.recompute(mockFSO);

      // Assert
      expect(instance.fso).toBeUndefined();
      expect(mockFSO.getState).toHaveBeenCalled();
    });

    it('should work with multiple FSO instances', () => {
      // Arrange
      const mockFSO1 = {
        getState: jest.fn().mockReturnValue(createMinimalState()),
        dispatch: jest.fn(),
        getValue: jest.fn(),
        updateField: jest.fn(),
        getValidationError: jest.fn(),
      } as unknown as jest.Mocked<FormStateOrchestrator>;
      
      const mockFSO2 = {
        getState: jest.fn().mockReturnValue(createMinimalState()),
        dispatch: jest.fn(),
        getValue: jest.fn(),
        updateField: jest.fn(),
        getValidationError: jest.fn(),
      } as unknown as jest.Mocked<FormStateOrchestrator>;

      // Act
      businessManager.recompute(mockFSO1);
      businessManager.recompute(mockFSO2);

      // Assert
      expect(mockFSO1.getState).toHaveBeenCalled();
      expect(mockFSO2.getState).toHaveBeenCalled();
      expect(mockFSO1.dispatch).toHaveBeenCalled();
      expect(mockFSO2.dispatch).toHaveBeenCalled();
    });
  });

  // =========================================================================
  // INTEGRATIE MET FINANCIALORCHESTRATOR
  // =========================================================================

  describe('integration with FinancialOrchestrator', () => {
    it('should pass the correct state to FinancialOrchestrator', () => {
      // Arrange
      const complexState = createMinimalState({
        data: {
          ...mockState.data,
          finance: {
            income: { 
              items: [
                { amount: 1000, description: 'Salary' },
                { amount: 200, description: 'Gift' },
              ], 
              totalAmount: 1200 
            },
            expenses: { 
              items: [
                { amount: 300, description: 'Rent', category: 'housing' },
                { amount: 50, description: 'Food', category: 'groceries' },
              ], 
              totalAmount: 350 
            },
            hasMissingCosts: true,
          },
        },
      });

      mockFSO.getState.mockReturnValueOnce(complexState);

      // Act
      businessManager.recompute(mockFSO);

      // Assert
      expect(mockFinancialOrch.prepareViewModel).toHaveBeenCalledWith(complexState);
    });

    it('should use the return value from FinancialOrchestrator directly', () => {
      // Arrange
      const customSummary = createMinimalSummary({
        totalIncomeDisplay: '€ 1.234,56',
        totalExpensesDisplay: '€ 789,01',
        netDisplay: '€ 445,55',
      });

      mockFinancialOrch.prepareViewModel.mockReturnValue(customSummary);

      // Act
      businessManager.recompute(mockFSO);

      // Assert
      expect(mockFSO.dispatch).toHaveBeenCalledWith({
        type: 'UPDATE_VIEWMODEL',
        payload: { financialSummary: customSummary },
      });
    });
  });
});