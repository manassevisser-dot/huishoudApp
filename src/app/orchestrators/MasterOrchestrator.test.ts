// src/app/orchestrators/__tests__/MasterOrchestrator.test.ts

import { MasterOrchestrator } from './MasterOrchestrator';
import type { FormStateOrchestrator } from './FormStateOrchestrator';
import type { DataManager } from './managers/DataManager';
import type { ResearchOrchestrator } from './ResearchOrchestrator';
import type { UIOrchestrator } from './UIOrchestrator';
import type { INavigationOrchestrator } from './interfaces/INavigationOrchestrator';
import type { IThemeOrchestrator } from './interfaces/IThemeOrchestrator';
import type { IBusinessOrchestrator } from './interfaces/IBusinessOrchestrator';
import type { IValidationOrchestrator } from './interfaces/IValidationOrchestrator';
import type { IValueOrchestrator } from './interfaces/IValueOrchestrator';
import { BusinessManager } from './managers/BusinessManager';
import { ValidationOrchestrator } from './ValidationOrchestrator';
import { DailyTransactionWorkflow } from './../workflows/DailyTransactionWorkflow';
import type { CsvUploadParams } from './../types/MasterOrchestratorAPI';
import type { RenderScreenVM } from './types/render.types';

// Mocks
jest.mock('./managers/BusinessManager');
jest.mock('./ValidationOrchestrator');
jest.mock('./../workflows/DailyTransactionWorkflow');

// Interface voor visibility evaluator (niet geëxporteerd)
interface IVisibilityEvaluator {
  evaluate(ruleName: string, memberId?: string): boolean;
}

describe('MasterOrchestrator', () => {
  // Mocks
  let mockFSO: jest.Mocked<FormStateOrchestrator>;
  let mockDataManager: jest.Mocked<DataManager>;
  let mockResearch: jest.Mocked<ResearchOrchestrator>;
  let mockBusiness: jest.Mocked<BusinessManager>;
  let mockValidation: jest.Mocked<ValidationOrchestrator>;
  let mockVisibility: jest.Mocked<IVisibilityEvaluator>;
  let mockValue: jest.Mocked<IValueOrchestrator>;
  let mockUI: jest.Mocked<UIOrchestrator>;
  let mockNavigation: jest.Mocked<INavigationOrchestrator>;
  let mockTheme: jest.Mocked<IThemeOrchestrator>;
  let mockDomain: any;
  let mockApp: any;
  let orchestrator: MasterOrchestrator;

  beforeEach(() => {
    // Reset alle mocks
    jest.clearAllMocks();

    // Maak alle mocks aan
    mockFSO = {
      dispatch: jest.fn(),
    } as any;

    mockDataManager = {
      executeImportWorkflow: jest.fn().mockResolvedValue(undefined),
    } as any;

    mockResearch = {} as any;

    mockBusiness = {
      recompute: jest.fn(),
    } as any;
    (BusinessManager as jest.Mock).mockImplementation(() => mockBusiness);

    mockValidation = {
      updateAndValidate: jest.fn(),
    } as any;
    (ValidationOrchestrator as jest.Mock).mockImplementation(() => mockValidation);

    mockVisibility = {
      evaluate: jest.fn().mockReturnValue(true),
    };

    mockValue = {} as any;

    mockUI = {
      buildRenderScreen: jest.fn(),
      isVisible: jest.fn().mockReturnValue(true),
    } as any;

    mockNavigation = {
      getCurrentScreenId: jest.fn(),
      canNavigateNext: jest.fn(),
      navigateNext: jest.fn(),
      navigateBack: jest.fn(),
      startWizard: jest.fn(),
      goToDashboard: jest.fn(),
      goToOptions: jest.fn(),
      goToSettings: jest.fn(),
      goToCsvUpload: jest.fn(),
      goToCsvAnalysis: jest.fn(),
      goToReset: jest.fn(),
      goBack: jest.fn(),
      goToUndo: jest.fn(),
    } as any;

    mockTheme = {} as any;

    mockDomain = {
      data: mockDataManager,
      business: mockBusiness,
      validation: mockValidation,
      visibility: mockVisibility,
      value: mockValue,
      research: mockResearch,
    };

    mockApp = {
      ui: mockUI,
      navigation: mockNavigation,
      theme: mockTheme,
    };

    // Maak de orchestrator aan
    orchestrator = new MasterOrchestrator(mockFSO, mockDomain, mockApp);
  });

  // =========================================================================
  // CONSTRUCTOR TESTS
  // =========================================================================

  describe('constructor', () => {
    it('should expose app properties', () => {
      expect(orchestrator.theme).toBe(mockTheme);
      expect(orchestrator.navigation).toBe(mockNavigation);
      expect(orchestrator.ui).toBe(mockUI);
    });

    it('should instantiate DailyTransactionWorkflow', () => {
      expect(DailyTransactionWorkflow).toHaveBeenCalledTimes(1);
    });

    it('should use passed-in business and validation dependencies', () => {
      expect(BusinessManager).toHaveBeenCalledTimes(0);
      expect(ValidationOrchestrator).toHaveBeenCalledTimes(0);

      orchestrator.updateField('x', 1);
      expect(mockValidation.updateAndValidate).toHaveBeenCalledWith('x', 1);
    });
  });

  // =========================================================================
  // buildRenderScreen
  // =========================================================================

  describe('buildRenderScreen', () => {
    it('should delegate to UIOrchestrator.buildRenderScreen with context', () => {
      const screenId = 'dashboard';
      const expectedResult: RenderScreenVM = {
        screenId: 'dashboard',
        title: 'Dashboard',
        type: 'wizard',
        navigation: { next: 'next', previous: 'prev' },
        sections: [],
      };
      mockUI.buildRenderScreen.mockReturnValue(expectedResult);

      const result = orchestrator.buildRenderScreen(screenId);

      expect(mockUI.buildRenderScreen).toHaveBeenCalledTimes(1);
      expect(mockUI.buildRenderScreen).toHaveBeenCalledWith(
        screenId,
        expect.objectContaining({
          fso: mockFSO,
          onFieldChange: expect.any(Function),
          onNavigate: expect.any(Function),
          onCommand: expect.any(Function)
        })
      );
      expect(result).toBe(expectedResult);
    });

    it('should pass updateField as onFieldChange callback', () => {
      const screenId = 'dashboard';
      const mockCallback = jest.fn();
      
      orchestrator.updateField = mockCallback;
      orchestrator.buildRenderScreen(screenId);

      const [, context] = mockUI.buildRenderScreen.mock.calls[0] as [string, any];
      context.onFieldChange('field123', 'new value');
      
      expect(mockCallback).toHaveBeenCalledWith('field123', 'new value');
    });
  });

  // =========================================================================
  // isVisible
  // =========================================================================

  describe('isVisible', () => {
    it('should delegate to UIOrchestrator.isVisible', () => {
      const ruleName = 'test-rule';
      const memberId = 'member-123';
      mockUI.isVisible.mockReturnValue(false);

      const result = orchestrator.isVisible(ruleName, memberId);

      expect(mockUI.isVisible).toHaveBeenCalledTimes(1);
      expect(mockUI.isVisible).toHaveBeenCalledWith(ruleName, memberId);
      expect(result).toBe(false);
    });

    it('should work without memberId', () => {
      const ruleName = 'test-rule';
      mockUI.isVisible.mockReturnValue(true);

      const result = orchestrator.isVisible(ruleName);

      expect(mockUI.isVisible).toHaveBeenCalledWith(ruleName, undefined);
      expect(result).toBe(true);
    });
  });

  // =========================================================================
  // updateField
  // =========================================================================

  describe('updateField', () => {
    it('should delegate to ValidationOrchestrator.updateAndValidate', () => {
      const fieldId = 'field-123';
      const value = 'new value';

      orchestrator.updateField(fieldId, value);

      expect(mockValidation.updateAndValidate).toHaveBeenCalledTimes(1);
      expect(mockValidation.updateAndValidate).toHaveBeenCalledWith(fieldId, value);
    });
  });

  // =========================================================================
  // NAVIGATION METHODS
  // =========================================================================

  describe('onNavigateBack', () => {
    it('should delegate to NavigationOrchestrator.navigateBack', () => {
      orchestrator.onNavigateBack();
      expect(mockNavigation.navigateBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('onNavigateNext', () => {
    it('should delegate to NavigationOrchestrator.navigateNext', () => {
      orchestrator.onNavigateNext();
      expect(mockNavigation.navigateNext).toHaveBeenCalledTimes(1);
    });
  });

  describe('canNavigateNext', () => {
    it('should delegate to NavigationOrchestrator.canNavigateNext', () => {
      mockNavigation.canNavigateNext.mockReturnValue(false);
      const sectionId = 'section-123';

      const result = orchestrator.canNavigateNext(sectionId);

      expect(mockNavigation.canNavigateNext).toHaveBeenCalledTimes(1);
      expect(mockNavigation.canNavigateNext).toHaveBeenCalledWith();
      expect(result).toBe(false);
    });
  });

  // =========================================================================
  // handleCsvImport
  // =========================================================================

  describe('handleCsvImport', () => {
    it('should delegate to DataManager.executeImportWorkflow', async () => {
      const params: CsvUploadParams = {
        csvText: 'date,amount,description\n2024-01-01,42.50,Test',
        fileName: 'test.csv',
        bank: 'ABN AMRO',
      };

      await orchestrator.handleCsvImport(params);

      expect(mockDataManager.executeImportWorkflow).toHaveBeenCalledTimes(1);
      expect(mockDataManager.executeImportWorkflow).toHaveBeenCalledWith(
        params,
        {
          fso: mockFSO,
          research: mockResearch,
          business: mockBusiness,
        }
      );
    });

    it('should work without optional bank field', async () => {
      const params: CsvUploadParams = {
        csvText: 'date,amount,description\n2024-01-01,42.50,Test',
        fileName: 'test.csv',
      };

      await orchestrator.handleCsvImport(params);

      expect(mockDataManager.executeImportWorkflow).toHaveBeenCalledWith(
        params,
        {
          fso: mockFSO,
          research: mockResearch,
          business: mockBusiness,
        }
      );
    });

    it('should propagate errors from DataManager', async () => {
      const params: CsvUploadParams = {
        csvText: 'invalid',
        fileName: 'test.csv',
      };
      const expectedError = new Error('Import failed');
      mockDataManager.executeImportWorkflow.mockRejectedValue(expectedError);

      await expect(orchestrator.handleCsvImport(params)).rejects.toThrow(expectedError);
    });
  });

  // =========================================================================
  // saveDailyTransaction
  // =========================================================================

  describe('saveDailyTransaction', () => {
    it('should delegate to DailyTransactionWorkflow.execute', () => {
      const mockDailyExecute = jest.fn().mockReturnValue(true);
      (DailyTransactionWorkflow as jest.Mock).mockImplementation(() => ({
        execute: mockDailyExecute,
      }));

      // Nieuwe orchestrator met de gemockte workflow
      const newOrchestrator = new MasterOrchestrator(mockFSO, mockDomain, mockApp);

      const result = newOrchestrator.saveDailyTransaction();

      expect(mockDailyExecute).toHaveBeenCalledTimes(1);
      expect(mockDailyExecute).toHaveBeenCalledWith(mockFSO, mockBusiness);
      expect(result).toBe(true);
    });

    it('should return false when workflow returns false', () => {
      const mockDailyExecute = jest.fn().mockReturnValue(false);
      (DailyTransactionWorkflow as jest.Mock).mockImplementation(() => ({
        execute: mockDailyExecute,
      }));

      const newOrchestrator = new MasterOrchestrator(mockFSO, mockDomain, mockApp);

      const result = newOrchestrator.saveDailyTransaction();

      expect(result).toBe(false);
    });
  });

  // =========================================================================
  // PRIVATE METHODS (indirect getest via public methods)
  // =========================================================================

  describe('private navigation methods', () => {
    it('should navigate to different screens via navigateTo', () => {
      // Test via buildRenderScreen die onNavigate callback gebruikt
      mockUI.buildRenderScreen.mockImplementation((id, context: any) => {
        context.onNavigate('SETTINGS');
        context.onNavigate('CSV_UPLOAD');
        context.onNavigate('RESET');
        context.onNavigate('OPTIONS');
        context.onNavigate('DASHBOARD');
        context.onNavigate('UNDO');
        return {} as any;
      });

      orchestrator.buildRenderScreen('test');

      expect(mockNavigation.goToSettings).toHaveBeenCalledTimes(1);
      expect(mockNavigation.goToCsvUpload).toHaveBeenCalledTimes(1);
      expect(mockNavigation.goToReset).toHaveBeenCalledTimes(1);
      expect(mockNavigation.goToOptions).toHaveBeenCalledTimes(1);
      expect(mockNavigation.goToDashboard).toHaveBeenCalledTimes(1);
      expect(mockNavigation.goToUndo).toHaveBeenCalledTimes(1);
    });

    it('should dispatch commands via dispatchCommand', () => {
      // Test via buildRenderScreen die onCommand callback gebruikt
      mockUI.buildRenderScreen.mockImplementation((id, context: any) => {
        context.onCommand('UNDO');
        context.onCommand('REDO');
        context.onCommand('CLEAR_ALL');
        return {} as any;
      });

      orchestrator.buildRenderScreen('test');

      expect(mockFSO.dispatch).toHaveBeenCalledTimes(3);
      expect(mockFSO.dispatch).toHaveBeenCalledWith({ type: 'UNDO_TRANSACTION' });
      expect(mockFSO.dispatch).toHaveBeenCalledWith({ type: 'REDO_TRANSACTION' });
      expect(mockFSO.dispatch).toHaveBeenCalledWith({ type: 'CLEAR_TRANSACTIONS' });
    });

    it('should ignore unknown navigation targets', () => {
      mockUI.buildRenderScreen.mockImplementation((id, context: any) => {
        context.onNavigate('UNKNOWN');
        return {} as any;
      });

      orchestrator.buildRenderScreen('test');
      // Geen errors, niets geroepen
    });

    it('should ignore unknown commands', () => {
      mockUI.buildRenderScreen.mockImplementation((id, context: any) => {
        context.onCommand('UNKNOWN');
        return {} as any;
      });

      orchestrator.buildRenderScreen('test');
      // Geen errors, niets geroepen
    });
  });
});