// src/app/orchestrators/managers/DataManager.test.ts
/**
 * @file_intent Unit tests voor DataManager - CSV import workflow façade
 * @test_strategy
 *   - Test alle paden van executeImportWorkflow
 *   - Mock ImportOrchestrator en dependencies
 *   - Verifieer logging en business.recompute()
 *   - Type guard verificatie
 */

import { DataManager } from './DataManager';
import { ImportOrchestrator } from '@app/orchestrators/ImportOrchestrator';
import { logger } from '@adapters/audit/AuditLoggerAdapter';
import type { FormStateOrchestrator } from '@app/orchestrators/FormStateOrchestrator';
import type { ResearchOrchestrator } from '@app/orchestrators/ResearchOrchestrator';
import type { BusinessManager } from './BusinessManager';
import type { CsvParseResult, CsvParseSuccess } from '@app/orchestrators/types/csvUpload.types';

// Mocks
jest.mock('@app/orchestrators/ImportOrchestrator');
jest.mock('@adapters/audit/AuditLoggerAdapter');

describe('DataManager', () => {
  let dataManager: DataManager;
  let mockImportOrchestrator: jest.Mocked<ImportOrchestrator>;
  let mockFSO: jest.Mocked<FormStateOrchestrator>;
  let mockResearch: jest.Mocked<ResearchOrchestrator>;
  let mockBusiness: jest.Mocked<BusinessManager>;
  let mockDeps: ImportWorkflowDeps;

  // Mock data
  const mockParams = {
    csvText: 'date,amount,description\n2024-01-01,42.50,Test',
    fileName: 'test.csv',
    bank: 'ING' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock ImportOrchestrator
    mockImportOrchestrator = {
      processCsvImport: jest.fn(),
    } as unknown as jest.Mocked<ImportOrchestrator>;
    (ImportOrchestrator as jest.Mock).mockImplementation(() => mockImportOrchestrator);

    // Mock dependencies
    mockFSO = {} as jest.Mocked<FormStateOrchestrator>;
    mockResearch = {} as jest.Mocked<ResearchOrchestrator>;
    mockBusiness = {
      recompute: jest.fn(),
    } as unknown as jest.Mocked<BusinessManager>;

    mockDeps = {
      fso: mockFSO,
      research: mockResearch,
      business: mockBusiness,
    };

    // Mock logger
    (logger.error as jest.Mock) = jest.fn();
    (logger.warn as jest.Mock) = jest.fn();
    (logger.info as jest.Mock) = jest.fn();

    dataManager = new DataManager();
  });

  // =========================================================================
  // SUCCESS PATH
  // =========================================================================

  describe('executeImportWorkflow - success', () => {
    it('should process successful parse and recompute business state', async () => {
      // Arrange
      const mockTransactions = [{ id: 'tx1' }, { id: 'tx2' }];
      const mockParseResult: CsvParseSuccess = {
        status: 'success',
        transactions: mockTransactions as any,
        metadata: {
          parsedCount: 2,
          skippedCount: 0,
        },
      };
      mockImportOrchestrator.processCsvImport.mockReturnValue(mockParseResult);

      // Act
      await dataManager.executeImportWorkflow(mockParams, mockDeps);

      // Assert
      expect(mockImportOrchestrator.processCsvImport).toHaveBeenCalledTimes(1);
      expect(mockImportOrchestrator.processCsvImport).toHaveBeenCalledWith(mockParams.csvText);
      
      expect(mockBusiness.recompute).toHaveBeenCalledTimes(1);
      expect(mockBusiness.recompute).toHaveBeenCalledWith(mockFSO);

      expect(logger.info).toHaveBeenCalledTimes(1);
      expect(logger.info).toHaveBeenCalledWith('csv_parse_success_stub', {
        orchestrator: 'data',
        action: 'executeImportWorkflow',
        count: 2,
        fileName: mockParams.fileName,
        bank: mockParams.bank,
      });
    });

    it('should work without optional bank field', async () => {
      // Arrange
      const paramsWithoutBank = {
        csvText: mockParams.csvText,
        fileName: mockParams.fileName,
        // bank is undefined
      };
      const mockParseResult: CsvParseSuccess = {
        status: 'success',
        transactions: [],
        metadata: {
          parsedCount: 0,
          skippedCount: 0,
        },
      };
      mockImportOrchestrator.processCsvImport.mockReturnValue(mockParseResult);

      // Act
      await dataManager.executeImportWorkflow(paramsWithoutBank, mockDeps);

      // Assert
      expect(logger.info).toHaveBeenCalledWith('csv_parse_success_stub', {
        orchestrator: 'data',
        action: 'executeImportWorkflow',
        count: 0,
        fileName: mockParams.fileName,
        bank: undefined,
      });
    });
  });

  // =========================================================================
  // ERROR PATH
  // =========================================================================

  describe('executeImportWorkflow - error', () => {
    it('should handle parse error and not recompute', async () => {
      // Arrange
      const mockParseResult: CsvParseResult = {
        status: 'error',
        errorMessage: 'Invalid CSV format',
        technicalDetails: {
          errorCode: 'PARSING_ERROR',
          originalError: new Error('Parse failed'),
        },
      };
      mockImportOrchestrator.processCsvImport.mockReturnValue(mockParseResult);

      // Act
      await dataManager.executeImportWorkflow(mockParams, mockDeps);

      // Assert
      expect(mockBusiness.recompute).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalledTimes(1);
      expect(logger.error).toHaveBeenCalledWith('csv_parse_failed', {
        orchestrator: 'data',
        action: 'executeImportWorkflow',
        error: 'Invalid CSV format',
      });
      expect(logger.info).not.toHaveBeenCalled();
    });
  });

  // =========================================================================
  // EMPTY PATH
  // =========================================================================

  describe('executeImportWorkflow - empty', () => {
    it('should handle empty parse result and not recompute', async () => {
      // Arrange
      const mockParseResult: CsvParseResult = {
        status: 'empty',
        message: 'No transactions found',
      };
      mockImportOrchestrator.processCsvImport.mockReturnValue(mockParseResult);

      // Act
      await dataManager.executeImportWorkflow(mockParams, mockDeps);

      // Assert
      expect(mockBusiness.recompute).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalledTimes(1);
      expect(logger.warn).toHaveBeenCalledWith('csv_parse_empty', {
        orchestrator: 'data',
        action: 'executeImportWorkflow',
        fileName: mockParams.fileName,
      });
      expect(logger.info).not.toHaveBeenCalled();
    });
  });

  // =========================================================================
  // TYPE GUARD TESTS (indirect via paden)
  // =========================================================================

  describe('handleParseResult type guard', () => {
    it('should return true for success result', async () => {
      // Arrange
      const mockParseResult: CsvParseSuccess = {
        status: 'success',
        transactions: [],
        metadata: {
          parsedCount: 0,
          skippedCount: 0,
        },
      };
      mockImportOrchestrator.processCsvImport.mockReturnValue(mockParseResult);

      // Act
      await dataManager.executeImportWorkflow(mockParams, mockDeps);

      // Assert - we komen in het success pad
      expect(mockBusiness.recompute).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalled();
    });

    it('should return false for error result', async () => {
      // Arrange
      const mockParseResult: CsvParseResult = {
        status: 'error',
        errorMessage: 'Error',
      };
      mockImportOrchestrator.processCsvImport.mockReturnValue(mockParseResult);

      // Act
      await dataManager.executeImportWorkflow(mockParams, mockDeps);

      // Assert - we komen in het error pad
      expect(mockBusiness.recompute).not.toHaveBeenCalled();
      expect(logger.error).toHaveBeenCalled();
    });

    it('should return false for empty result', async () => {
      // Arrange
      const mockParseResult: CsvParseResult = {
        status: 'empty',
        message: 'Empty',
      };
      mockImportOrchestrator.processCsvImport.mockReturnValue(mockParseResult);

      // Act
      await dataManager.executeImportWorkflow(mockParams, mockDeps);

      // Assert - we komen in het empty pad
      expect(mockBusiness.recompute).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalled();
    });
  });

  // =========================================================================
  // EDGE CASES
  // =========================================================================

  describe('executeImportWorkflow - edge cases', () => {
    it('should handle undefined bank field gracefully', async () => {
      // Arrange
      const paramsWithoutBank = {
        csvText: mockParams.csvText,
        fileName: mockParams.fileName,
      };
      const mockParseResult: CsvParseSuccess = {
        status: 'success',
        transactions: [{ id: 'tx1' }] as any,
        metadata: {
          parsedCount: 1,
          skippedCount: 0,
        },
      };
      mockImportOrchestrator.processCsvImport.mockReturnValue(mockParseResult);

      // Act
      await dataManager.executeImportWorkflow(paramsWithoutBank, mockDeps);

      // Assert
      expect(logger.info).toHaveBeenCalledWith('csv_parse_success_stub', {
        orchestrator: 'data',
        action: 'executeImportWorkflow',
        count: 1,
        fileName: mockParams.fileName,
        bank: undefined,
      });
    });

    it('should handle empty transactions array', async () => {
      // Arrange
      const mockParseResult: CsvParseSuccess = {
        status: 'success',
        transactions: [],
        metadata: {
          parsedCount: 0,
          skippedCount: 0,
        },
      };
      mockImportOrchestrator.processCsvImport.mockReturnValue(mockParseResult);

      // Act
      await dataManager.executeImportWorkflow(mockParams, mockDeps);

      // Assert
      expect(mockBusiness.recompute).toHaveBeenCalled(); // Nog steeds recompute
      expect(logger.info).toHaveBeenCalledWith('csv_parse_success_stub', {
        orchestrator: 'data',
        action: 'executeImportWorkflow',
        count: 0,
        fileName: mockParams.fileName,
        bank: mockParams.bank,
      });
    });
  });
});

// Type alias voor de test (om de interface beschikbaar te maken)
type ImportWorkflowDeps = {
  fso: FormStateOrchestrator;
  research: ResearchOrchestrator;
  business: BusinessManager;
};