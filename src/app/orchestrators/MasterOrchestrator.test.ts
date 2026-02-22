/**
 * @file_intent Comprehensive unit tests for MasterOrchestrator - the central hub and facade for all application actions.
 * @repo_architecture App Layer - Orchestrator Tests. Tests the delegation, state management, and workflow coordination.
 * @term_definition
 *   - Render-Ready VM: Data transformed from domain ViewModels into a format directly usable by UI (with resolved labels, visibility flags, onChange handlers)
 *   - DomainCluster: Collection of business logic orchestrators (data, business, validation, visibility, value, research)
 *   - AppCluster: Collection of application-layer orchestrators (ui, navigation, theme)
 */

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import type { FormState } from '@core/types/core';
import type { ExpenseItem } from '@core/types/core';
import { MasterOrchestrator } from './MasterOrchestrator';
import type { FormStateOrchestrator } from './FormStateOrchestrator';
import type { IBusinessOrchestrator } from './interfaces/IBusinessOrchestrator';
import type { IValidationOrchestrator, SectionValidationResult } from './interfaces/IValidationOrchestrator';
import type { IUIOrchestrator } from './interfaces/IUIOrchestrator';
import type { INavigationOrchestrator } from './interfaces/INavigationOrchestrator';
import type { IThemeOrchestrator } from './interfaces/IThemeOrchestrator';
import type { ResearchOrchestrator, MasterProcessResult } from './ResearchOrchestrator';

// ═══════════════════════════════════════════════════════════════════
// MOCKS - External Dependencies (adapters)
// ═══════════════════════════════════════════════════════════════════

jest.mock('@adapters/validation/validateAtBoundary');
jest.mock('@adapters/audit/AuditLoggerAdapter');
jest.mock('@domain/rules/calculateRules');
jest.mock('@domain/registry/EntryRegistry');
jest.mock('@domain/constants/labelResolver');

import { validateAtBoundary } from '@adapters/validation/validateAtBoundary';
import { logger } from '@adapters/audit/AuditLoggerAdapter';
import { computePhoenixSummary } from '@domain/rules/calculateRules';
import { EntryRegistry } from '@domain/registry/EntryRegistry';
import { labelFromToken } from '@domain/constants/labelResolver';

// ═══════════════════════════════════════════════════════════════════
// TEST FIXTURES & BUILDERS
// ═══════════════════════════════════════════════════════════════════

const ISO_NOW = '2026-02-23T10:00:00Z';

const createTestFormState = (): FormState => ({
  schemaVersion: '1.0',
  activeStep: 'setup',
  currentScreenId: 'SCREEN_TEST',
  isValid: true,
  data: {
    setup: {
      aantalMensen: 1,
      aantalVolwassen: 1,
      autoCount: 'Nee' as const,
      heeftHuisdieren: false,
      woningType: 'Huur' as const,
    },
    household: {
      members: [],
      huurtoeslag: 0,
      zorgtoeslag: 0,
    },
    finance: {
      income: { items: [] },
      expenses: {
        items: [],
        living_costs: 0,
        energy_costs: 0,
        insurance_total: 0,
      },
    },
    latestTransaction: {
      latestTransactionDate: '2026-02-23',
      latestTransactionAmount: 0,
      latestTransactionCategory: null,
      latestTransactionDescription: '',
      latestPaymentMethod: 'pin',
    },
  } as any, // Extended with dynamic properties via [key: string]: unknown
  meta: { lastModified: ISO_NOW, version: 1 },
});

// Mock builders for DomainCluster
const createMockFormStateOrchestrator = (): Partial<FormStateOrchestrator> => ({
  getState: jest.fn().mockReturnValue(createTestFormState()),
  dispatch: jest.fn(),
  getValue: jest.fn((fieldId: string) => null),
  updateField: jest.fn(),
});

const createMockBusinessOrchestrator = (): Partial<IBusinessOrchestrator> => ({
  prepareFinancialViewModel: jest.fn().mockReturnValue({
    totalIncomeDisplay: '€0',
    totalExpensesDisplay: '€0',
    netDisplay: '€0',
  }),
});

const createMockValidationOrchestrator = (): Partial<IValidationOrchestrator> => ({
  validateSection: jest.fn().mockReturnValue({ isValid: true, errors: [] } as SectionValidationResult),
});

const createMockVisibilityEvaluator = () => ({
  evaluate: jest.fn().mockReturnValue(true),
});

const createMockValueOrchestrator = () => ({
  getValueViewModel: jest.fn(),
});

const createMockResearchOrchestrator = (): Partial<ResearchOrchestrator> => ({
  processAllData: jest.fn().mockReturnValue({
    local: {
      finance: {
        transactions: [],
        hasMissingCosts: false,
        summary: { isDiscrepancy: false },
      },
    },
    research: {},
  } as MasterProcessResult),
});

const createMockDataManager = () => ({
  processCsvImport: jest.fn().mockReturnValue({
    status: 'success' as const,
    transactions: [],
  }),
});

const createMockUIOrchestrator = (): Partial<IUIOrchestrator> => ({
  buildScreen: jest.fn().mockReturnValue({
    screenId: 'SCREEN_TEST',
    titleToken: 'TITLE_TEST',
    type: 'form',
    sections: [],
    navigation: { next: undefined, previous: undefined },
    style: {},
  }),
});

const createMockNavigationOrchestrator = (): Partial<INavigationOrchestrator> => ({
  navigateBack: jest.fn(),
  navigateNext: jest.fn(),
  goToDashboard: jest.fn(),
});

const createMockThemeOrchestrator = (): Partial<IThemeOrchestrator> => ({
  getTheme: jest.fn(),
});

// ═══════════════════════════════════════════════════════════════════
// TEST DESCRIBE BLOCKS
// ═══════════════════════════════════════════════════════════════════

describe('MasterOrchestrator', () => {
  let master: MasterOrchestrator;
  let mockFso: Partial<FormStateOrchestrator>;
  let mockBusiness: Partial<IBusinessOrchestrator>;
  let mockValidation: Partial<IValidationOrchestrator>;
  let mockVisibility: ReturnType<typeof createMockVisibilityEvaluator>;
  let mockValue: ReturnType<typeof createMockValueOrchestrator>;
  let mockResearch: Partial<ResearchOrchestrator>;
  let mockDataManager: ReturnType<typeof createMockDataManager>;
  let mockUI: Partial<IUIOrchestrator>;
  let mockNavigation: Partial<INavigationOrchestrator>;
  let mockTheme: Partial<IThemeOrchestrator>;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Create fresh mocks for each test
    mockFso = createMockFormStateOrchestrator();
    mockBusiness = createMockBusinessOrchestrator();
    mockValidation = createMockValidationOrchestrator();
    mockVisibility = createMockVisibilityEvaluator();
    mockValue = createMockValueOrchestrator();
    mockResearch = createMockResearchOrchestrator();
    mockDataManager = createMockDataManager();
    mockUI = createMockUIOrchestrator();
    mockNavigation = createMockNavigationOrchestrator();
    mockTheme = createMockThemeOrchestrator();

    // Mock external adapters
    (labelFromToken as jest.Mock).mockImplementation((token: string) => token.replace('_', ' '));
    (computePhoenixSummary as jest.Mock).mockReturnValue({
      totalIncomeCents: 0,
      totalExpensesCents: 0,
      netCents: 0,
    });
    (EntryRegistry.getDefinition as jest.Mock).mockReturnValue({
      primitiveType: 'TEXT',
      labelToken: 'LABEL_TEST',
    });

    // Create MasterOrchestrator with mocked dependencies
    master = new MasterOrchestrator(
      mockFso as FormStateOrchestrator,
      {
        data: mockDataManager as any,
        business: mockBusiness as IBusinessOrchestrator,
        validation: mockValidation as IValidationOrchestrator,
        visibility: mockVisibility,
        value: mockValue,
        research: mockResearch as ResearchOrchestrator,
      },
      {
        ui: mockUI as IUIOrchestrator,
        navigation: mockNavigation as INavigationOrchestrator,
        theme: mockTheme as IThemeOrchestrator,
      },
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ═══════════════════════════════════════════════════════════════
  // RENDERING & SCREEN BUILDING
  // ═══════════════════════════════════════════════════════════════

  describe('Rendering & Screen Building', () => {
    it('buildRenderScreen() should call ui.buildScreen() with screenId and transform result', () => {
      // Arrange
      const screenId = 'TEST_SCREEN_ID';

      // Act
      const result = master.buildRenderScreen(screenId);

      // Assert
      expect(mockUI.buildScreen).toHaveBeenCalledWith(screenId);
      expect(result).toHaveProperty('screenId');
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('sections');
    });

    it('buildRenderScreen() should resolve label tokens to readable text', () => {
      // Arrange
      (labelFromToken as jest.Mock).mockReturnValue('Test Title');

      // Act
      const result = master.buildRenderScreen('TEST_SCREEN');

      // Assert
      expect(labelFromToken).toHaveBeenCalled();
      expect(result.title).toBe('Test Title');
    });

    it('buildRenderScreen() should handle screens with sections and entries', () => {
      // Arrange
      (mockUI.buildScreen as jest.Mock).mockReturnValue({
        screenId: 'COMPLEX_SCREEN',
        titleToken: 'TITLE_COMPLEX',
        type: 'form',
        sections: [
          {
            sectionId: 'SEC_1',
            titleToken: 'SECTION_TITLE',
            layout: 'card',
            children: [
              {
                entryId: 'ENTRY_1',
                labelToken: 'LABEL_ENTRY',
                child: { primitiveType: 'TEXT' },
              },
            ],
          },
        ],
        navigation: {},
      });

      // Act
      const result = master.buildRenderScreen('COMPLEX_SCREEN');

      // Assert
      expect(result.sections).toHaveLength(1);
      expect(result.sections[0].sectionId).toBe('SEC_1');
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // NAVIGATION & VALIDATION
  // ═══════════════════════════════════════════════════════════════

  describe('Navigation & Validation', () => {
    it('isVisible() should delegate to visibility evaluator', () => {
      // Arrange
      (mockVisibility.evaluate as jest.Mock).mockReturnValue(true);

      // Act
      const result = master.isVisible('RULE_TEST', 'member_1');

      // Assert
      expect(mockVisibility.evaluate).toHaveBeenCalledWith('RULE_TEST', 'member_1');
      expect(result).toBe(true);
    });

    it('canNavigateNext() should validate section and return isValid flag', () => {
      // Arrange
      (mockValidation.validateSection as jest.Mock).mockReturnValue({ isValid: true });

      // Act
      const result = master.canNavigateNext('SECTION_ID');

      // Assert
      expect(mockValidation.validateSection).toHaveBeenCalledWith('SECTION_ID', expect.any(Object));
      expect(result).toBe(true);
    });

    it('canNavigateNext() should return false when section validation fails', () => {
      // Arrange
      (mockValidation.validateSection as jest.Mock).mockReturnValue({ isValid: false, errors: ['Field required'] });

      // Act
      const result = master.canNavigateNext('SECTION_ID');

      // Assert
      expect(result).toBe(false);
    });

    it('onNavigateBack() should delegate to navigation orchestrator', () => {
      // Act
      master.onNavigateBack();

      // Assert
      expect(mockNavigation.navigateBack).toHaveBeenCalled();
    });

    it('onNavigateNext() should delegate to navigation orchestrator', () => {
      // Act
      master.onNavigateNext();

      // Assert
      expect(mockNavigation.navigateNext).toHaveBeenCalled();
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // STATE MANAGEMENT (updateField)
  // ═══════════════════════════════════════════════════════════════

  describe('State Management (updateField)', () => {
    it('updateField() should validate input at boundary', () => {
      // Arrange
      (validateAtBoundary as jest.Mock).mockReturnValue({ success: true, data: 123 });

      // Act
      master.updateField('testField', 123);

      // Assert
      expect(validateAtBoundary).toHaveBeenCalledWith('testField', 123);
    });

    it('updateField() should call fso.updateField() on validation success', () => {
      // Arrange
      (validateAtBoundary as jest.Mock).mockReturnValue({ success: true, data: 'valid_value' });

      // Act
      master.updateField('testField', 'valid_value');

      // Assert
      expect(mockFso.updateField).toHaveBeenCalledWith('testField', 'valid_value');
    });

    it('updateField() should recompute business state after successful update', () => {
      // Arrange
      (validateAtBoundary as jest.Mock).mockReturnValue({ success: true, data: 100 });

      // Act
      master.updateField('salary', 100);

      // Assert
      expect(mockBusiness.prepareFinancialViewModel).toHaveBeenCalled();
      expect(mockFso.dispatch).toHaveBeenCalled();
    });

    it('updateField() should log warning on validation failure and NOT update state', () => {
      // Arrange
      const validationError = { success: false, error: 'Invalid value' };
      (validateAtBoundary as jest.Mock).mockReturnValue(validationError);

      // Act
      master.updateField('testField', 'invalid');

      // Assert
      expect(logger.warn).toHaveBeenCalled();
      expect(mockFso.updateField).not.toHaveBeenCalled();
    });

    it('updateField() should dispatch UPDATE_VIEWMODEL action', () => {
      // Arrange
      (validateAtBoundary as jest.Mock).mockReturnValue({ success: true, data: 50 });

      // Act
      master.updateField('amount', 50);

      // Assert
      expect(mockFso.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'UPDATE_VIEWMODEL',
          payload: expect.objectContaining({ financialSummary: expect.any(Object) }),
        }),
      );
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // CSV IMPORT WORKFLOW
  // ═══════════════════════════════════════════════════════════════

  describe('CSV Import Workflow (handleCsvImport)', () => {
    it('handleCsvImport() should parse CSV via DataManager', async () => {
      // Arrange
      const csvText = 'a,b,c\n1,2,3';
      (mockDataManager.processCsvImport as jest.Mock).mockReturnValue({
        status: 'success',
        transactions: [],
      });

      // Act
      await master.handleCsvImport(csvText);

      // Assert
      expect(mockDataManager.processCsvImport).toHaveBeenCalledWith(
        expect.objectContaining({ csvText }),
      );
    });

    it('handleCsvImport() should process transactions through ResearchOrchestrator', async () => {
      // Arrange
      const mockTransactions = [{ amount: 100, date: '2026-02-23' }];
      (mockDataManager.processCsvImport as jest.Mock).mockReturnValue({
        status: 'success',
        transactions: mockTransactions,
      });

      // Act
      await master.handleCsvImport('csv_data');

      // Assert
      expect(mockResearch.processAllData).toHaveBeenCalledWith(
        expect.any(Array),
        mockTransactions,
        expect.any(Object),
      );
    });

    it('handleCsvImport() should dispatch finance data to state on success', async () => {
      // Arrange
      (mockDataManager.processCsvImport as jest.Mock).mockReturnValue({
        status: 'success',
        transactions: [{ amount: 100 }],
      });

      // Act
      await master.handleCsvImport('csv_data');

      // Assert
      expect(mockFso.dispatch).toHaveBeenCalled();
    });

    it('handleCsvImport() should log warning on parse error', async () => {
      // Arrange
      (mockDataManager.processCsvImport as jest.Mock).mockReturnValue({
        status: 'error',
        errorMessage: 'Invalid CSV format',
      });

      // Act
      await master.handleCsvImport('invalid_csv');

      // Assert
      expect(logger.error).toHaveBeenCalled();
    });

    it('handleCsvImport() should log warning on empty CSV', async () => {
      // Arrange
      (mockDataManager.processCsvImport as jest.Mock).mockReturnValue({
        status: 'empty',
      });

      // Act
      await master.handleCsvImport('');

      // Assert
      expect(logger.warn).toHaveBeenCalled();
    });

    it('handleCsvImport() should log discrepancy if detected', async () => {
      // Arrange
      (mockDataManager.processCsvImport as jest.Mock).mockReturnValue({
        status: 'success',
        transactions: [],
      });
      (mockResearch.processAllData as jest.Mock).mockReturnValue({
        local: {
          finance: {
            transactions: [],
            summary: { isDiscrepancy: true, details: 'Mismatch' },
          },
        },
      });

      // Act
      await master.handleCsvImport('csv_data');

      // Assert
      expect(logger.warn).toHaveBeenCalledWith('csv_IMPORT_DISCREPANCY_FOUND', expect.any(Object));
    });

    it('handleCsvImport() should recompute business state after import', async () => {
      // Arrange
      (mockDataManager.processCsvImport as jest.Mock).mockReturnValue({
        status: 'success',
        transactions: [],
      });

      // Act
      await master.handleCsvImport('csv_data');

      // Assert
      expect(mockBusiness.prepareFinancialViewModel).toHaveBeenCalled();
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // DAILY TRANSACTION WORKFLOW
  // ═══════════════════════════════════════════════════════════════

  describe('Daily Transaction Workflow (saveDailyTransaction)', () => {
    it('saveDailyTransaction() should return false if form not initialized', () => {
      // Arrange
      (mockFso.getState as jest.Mock).mockReturnValue({
        ...createTestFormState(),
        data: { ...createTestFormState().data, latestTransaction: null },
      });

      // Act
      const result = master.saveDailyTransaction();

      // Assert
      expect(result).toBe(false);
      expect(logger.warn).toHaveBeenCalled();
    });

    it('saveDailyTransaction() should return false if amount is invalid (zero or negative)', () => {
      // Arrange
      const state = createTestFormState();
      (mockFso.getState as jest.Mock).mockReturnValue({
        ...state,
        data: {
          ...state.data,
          latestTransaction: { ...state.data.latestTransaction, latestTransactionAmount: 0 },
        },
      });

      // Act
      const result = master.saveDailyTransaction();

      // Assert
      expect(result).toBe(false);
      expect(logger.warn).toHaveBeenCalledWith('transaction_INVALID_AMOUNT', expect.any(Object));
    });

    it('saveDailyTransaction() should return false if category is missing', () => {
      // Arrange
      const state = createTestFormState();
      (mockFso.getState as jest.Mock).mockReturnValue({
        ...state,
        data: {
          ...state.data,
          latestTransaction: {
            ...state.data.latestTransaction,
            latestTransactionAmount: 50,
            latestTransactionCategory: null,
          },
        },
      });

      // Act
      const result = master.saveDailyTransaction();

      // Assert
      expect(result).toBe(false);
      expect(logger.warn).toHaveBeenCalledWith('transaction_CATEGORY_REQUIRED');
    });

    it('saveDailyTransaction() should save valid transaction to finance.expenses', () => {
      // Arrange
      const state = createTestFormState();
      (mockFso.getState as jest.Mock).mockReturnValue({
        ...state,
        data: {
          ...state.data,
          latestTransaction: {
            latestTransactionDate: '2026-02-23',
            latestTransactionAmount: 25.50,
            latestTransactionCategory: 'Groceries',
            latestTransactionDescription: 'Weekly shopping',
            latestPaymentMethod: 'card',
          },
        },
      });

      // Act
      const result = master.saveDailyTransaction();

      // Assert
      expect(result).toBe(true);
    });

    it('saveDailyTransaction() should dispatch state update with new expense item', () => {
      // Arrange
      const state = createTestFormState();
      (mockFso.getState as jest.Mock).mockReturnValue({
        ...state,
        data: {
          ...state.data,
          latestTransaction: {
            latestTransactionDate: '2026-02-23',
            latestTransactionAmount: 30,
            latestTransactionCategory: 'Restaurants',
            latestTransactionDescription: 'Dinner',
            latestPaymentMethod: 'pin',
          },
        },
      });

      // Act
      master.saveDailyTransaction();

      // Assert
      expect(mockFso.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'UPDATE_DATA',
          payload: expect.objectContaining({
            finance: expect.any(Object),
            latestTransaction: expect.any(Object),
          }),
        }),
      );
    });

    it('saveDailyTransaction() should reset form after saving', () => {
      // Arrange
      const state = createTestFormState();
      (mockFso.getState as jest.Mock).mockReturnValue({
        ...state,
        data: {
          ...state.data,
          latestTransaction: {
            latestTransactionDate: '2026-02-23',
            latestTransactionAmount: 15,
            latestTransactionCategory: 'Coffee',
            latestTransactionDescription: '',
            latestPaymentMethod: 'card',
          },
        },
      });

      // Act
      master.saveDailyTransaction();

      // Assert
      expect(mockFso.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            latestTransaction: {
              latestTransactionDate: expect.any(String),
              latestTransactionAmount: 0,
              latestTransactionCategory: null,
              latestTransactionDescription: '',
              latestPaymentMethod: 'pin',
            },
          }),
        }),
      );
    });

    it('saveDailyTransaction() should use domain calculation for finance summary', () => {
      // Arrange
      const state = createTestFormState();
      (mockFso.getState as jest.Mock).mockReturnValue({
        ...state,
        data: {
          ...state.data,
          latestTransaction: {
            latestTransactionDate: '2026-02-23',
            latestTransactionAmount: 45,
            latestTransactionCategory: 'Transport',
            latestTransactionDescription: 'Gas',
            latestPaymentMethod: 'card',
          },
        },
      });

      // Act
      master.saveDailyTransaction();

      // Assert
      expect(computePhoenixSummary).toHaveBeenCalled();
    });

    it('saveDailyTransaction() should recompute business state after save', () => {
      // Arrange
      const state = createTestFormState();
      (mockFso.getState as jest.Mock).mockReturnValue({
        ...state,
        data: {
          ...state.data,
          latestTransaction: {
            latestTransactionDate: '2026-02-23',
            latestTransactionAmount: 20,
            latestTransactionCategory: 'Utilities',
            latestTransactionDescription: 'Electricity bill',
            latestPaymentMethod: 'transfer',
          },
        },
      });

      // Act
      master.saveDailyTransaction();

      // Assert
      expect(mockBusiness.prepareFinancialViewModel).toHaveBeenCalled();
    });

    it('saveDailyTransaction() should log success with expense fieldId', () => {
      // Arrange
      const state = createTestFormState();
      (mockFso.getState as jest.Mock).mockReturnValue({
        ...state,
        data: {
          ...state.data,
          latestTransaction: {
            latestTransactionDate: '2026-02-23',
            latestTransactionAmount: 35,
            latestTransactionCategory: 'Medical',
            latestTransactionDescription: 'Pharmacy',
            latestPaymentMethod: 'card',
          },
        },
      });

      // Act
      master.saveDailyTransaction();

      // Assert
      expect(logger.info).toHaveBeenCalledWith('transaction_SAVED', expect.any(Object));
    });
  });
});
