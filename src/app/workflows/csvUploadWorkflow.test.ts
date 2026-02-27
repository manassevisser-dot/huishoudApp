// src/app/workflows/csvUploadWorkflow.test.ts
import { CsvUploadWorkflow } from './csvUploadWorkflow';
import type { FormStateOrchestrator } from '@app/orchestrators/FormStateOrchestrator';
import type { ImportOrchestrator } from '@app/orchestrators/ImportOrchestrator';
import type { ResearchOrchestrator } from '@app/orchestrators/ResearchOrchestrator';
import type { BusinessManager } from '@app/orchestrators/managers/BusinessManager';
import { CsvAnalysisService } from '@domain/finance/CsvAnalysisService';
import { logger } from '@adapters/audit/AuditLoggerAdapter';
import type { ParsedCsvTransaction, CsvAnalysisResult } from '@app/orchestrators/types/csvUpload.types';

// Mock dependencies
jest.mock('@domain/finance/CsvAnalysisService');
jest.mock('@adapters/audit/AuditLoggerAdapter', () => ({
  logger: {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
  },
}));

describe('CsvUploadWorkflow', () => {
  // Mocks
  let mockFso: jest.Mocked<FormStateOrchestrator>;
  let mockImportOrch: jest.Mocked<ImportOrchestrator>;
  let mockResearch: jest.Mocked<ResearchOrchestrator>;
  let mockBusiness: jest.Mocked<BusinessManager>;
  let workflow: CsvUploadWorkflow;

  // Test data
  const mockParams = {
    csvText: 'date,amount,description\n2024-01-01,42.50,Test',
    fileName: 'test.csv',
    bank: 'ING' as const,
  };

  const mockTransactions: ParsedCsvTransaction[] = [
    {
      id: '1',
      date: '2024-01-01',
      description: 'Test',
      amount: 42.5,
      amountCents: 4250,
      category: '',
      fieldId: 'test',
      isIgnored: false,
      original: {
        rawDigest: 'abc123',
        schemaVersion: '1.0',
        importedAt: new Date().toISOString(),
        columnMapVersion: '1.0',
        flags: [],
      },
    },
  ];

  const mockAnalysis: CsvAnalysisResult = {
    isDiscrepancy: false,
    hasMissingCosts: false,
    discrepancyDetails: undefined,
    periodSummary: {
      totalIncomeCents: 1000,
      totalExpensesCents: 500,
      balanceCents: 500,
      transactionCount: 1,
    },
    setupComparison: null,
  };

  const mockMetadata = {
    parsedCount: 1,
    skippedCount: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup mocks
    mockFso = {
      dispatch: jest.fn(),
      getState: jest.fn(),
    } as any;

    mockImportOrch = {
      processCsvImport: jest.fn(),
    } as any;

    mockResearch = {
      // processAllData is synchroon (retourneert MasterProcessResult, geen Promise)
      processAllData: jest.fn().mockReturnValue({
        local: { household: { members: [] }, finance: { transactions: [], summary: {}, hasMissingCosts: false } },
        research: { memberPayloads: [], financialAnalytics: { totalIncomeCents: 0, categoryTotals: {}, timestamp: '', postcodeDigits: '' } },
      }),
    } as any;

    mockBusiness = {
      recompute: jest.fn(),
    } as any;

    // Mock state
    mockFso.getState.mockReturnValue({
      data: {
        setup: {},
        finance: {},
        household: { members: [] }, // vereist door runPhaseC: state.data.household.members
        csvImport: {
          transactions: [],
          importedAt: '',
          status: 'parsed',
          fileName: 'test.csv',
          transactionCount: 0,
        },
      },
    } as any);

    // Create workflow
    workflow = new CsvUploadWorkflow({
      fso: mockFso,
      importOrch: mockImportOrch,
      research: mockResearch,
      business: mockBusiness,
    });
  });

  describe('execute', () => {
    it('should successfully complete full workflow', async () => {
      // Arrange
      mockImportOrch.processCsvImport.mockReturnValue({
        status: 'success',
        transactions: mockTransactions,
        metadata: mockMetadata,
      });

      (CsvAnalysisService.analyse as jest.Mock).mockReturnValue(mockAnalysis);

      // Act
      const result = await workflow.execute(mockParams);

      // Assert
      expect(result).toEqual({
        outcome: 'success',
        processedCount: 1,
        summary: mockAnalysis,
      });

      // Check fase A dispatch
      expect(mockFso.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'UPDATE_CSV_IMPORT',
          payload: expect.objectContaining({
            transactions: expect.any(Array),
            status: 'parsed',
            fileName: 'test.csv',
          }),
        })
      );

      // Check fase B dispatch
      expect(mockFso.dispatch).toHaveBeenCalledWith({
        type: 'UPDATE_VIEWMODEL',
        payload: { csvAnalysis: mockAnalysis },
      });

      // Check fase C
      expect(mockResearch.processAllData).toHaveBeenCalled();
      expect(mockBusiness.recompute).toHaveBeenCalledWith(mockFso);
      expect(logger.info).toHaveBeenCalledWith('csv_import_completed', expect.any(Object));
    });

    it('should handle empty CSV import', async () => {
      // Arrange
      mockImportOrch.processCsvImport.mockReturnValue({
        status: 'empty',
        message: 'Geen transacties gevonden',
      });

      // Act
      const result = await workflow.execute(mockParams);

      // Assert
      expect(result).toEqual({
        outcome: 'failure',
        errorMessage: 'Geen transacties gevonden in het bestand',
      });
      expect(logger.warn).toHaveBeenCalledWith('csv_parse_empty', expect.any(Object));
      expect(mockFso.dispatch).not.toHaveBeenCalled();
    });

    it('should handle CSV parsing error', async () => {
      // Arrange
      mockImportOrch.processCsvImport.mockReturnValue({
        status: 'error',
        errorMessage: 'Invalid CSV format',
      });

      // Act
      const result = await workflow.execute(mockParams);

      // Assert
      expect(result).toEqual({
        outcome: 'failure',
        errorMessage: 'Invalid CSV format',
      });
      expect(logger.error).toHaveBeenCalledWith('csv_parse_error', expect.any(Object));
    });

    it('should handle unexpected errors gracefully', async () => {
      // Arrange
      mockImportOrch.processCsvImport.mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      // Act
      const result = await workflow.execute(mockParams);

      // Assert
      expect(result).toEqual({
        outcome: 'failure',
        errorMessage: 'Onverwachte fout tijdens import',
      });
      expect(logger.error).toHaveBeenCalledWith('csv_workflow_failed', expect.any(Object));
    });
  });

  describe('runPhaseA', () => {
    it('should detect period from transactions', async () => {
      mockImportOrch.processCsvImport.mockReturnValue({
        status: 'success',
        transactions: [
          { ...mockTransactions[0], date: '2024-01-01' },
          { ...mockTransactions[0], date: '2024-01-15', id: '2' },
        ],
        metadata: mockMetadata,
      });

      await workflow.execute(mockParams);

      expect(mockFso.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'UPDATE_CSV_IMPORT',
          payload: expect.objectContaining({
            period: { from: '2024-01-01', to: '2024-01-15' },
          }),
        })
      );
    });

    it('should set period to null when no dates', async () => {
      mockImportOrch.processCsvImport.mockReturnValue({
        status: 'success',
        transactions: [
          { ...mockTransactions[0], date: '' },
        ],
        metadata: mockMetadata,
      });

      await workflow.execute(mockParams);

      expect(mockFso.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'UPDATE_CSV_IMPORT',
          payload: expect.objectContaining({
            period: null,
          }),
        })
      );
    });
  });

  describe('runPhaseB', () => {
    it('should handle discrepancy warning', async () => {
      // Arrange
      mockImportOrch.processCsvImport.mockReturnValue({
        status: 'success',
        transactions: mockTransactions,
        metadata: mockMetadata,
      });

      const analysisWithDiscrepancy: CsvAnalysisResult = {
        ...mockAnalysis,
        isDiscrepancy: true,
        discrepancyDetails: 'Income mismatch',
        setupComparison: {
          csvIncomeCents: 1000,
          setupIncomeCents: 800,
          diffCents: 200,
        },
      };

      (CsvAnalysisService.analyse as jest.Mock).mockReturnValue(analysisWithDiscrepancy);

      // Act
      await workflow.execute(mockParams);

      // Assert
      expect(logger.warn).toHaveBeenCalledWith('csv_discrepancy_found', expect.any(Object));
    });

    it('should handle missing costs warning', async () => {
      // Arrange
      mockImportOrch.processCsvImport.mockReturnValue({
        status: 'success',
        transactions: mockTransactions,
        metadata: mockMetadata,
      });

      const analysisWithMissingCosts: CsvAnalysisResult = {
        ...mockAnalysis,
        hasMissingCosts: true,
      };

      (CsvAnalysisService.analyse as jest.Mock).mockReturnValue(analysisWithMissingCosts);

      // Act
      await workflow.execute(mockParams);

      // Assert
      expect(logger.warn).toHaveBeenCalledWith('csv_missing_costs_detected', expect.any(Object));
    });

    it('should update status to analyzed', async () => {
      // Arrange
      mockImportOrch.processCsvImport.mockReturnValue({
        status: 'success',
        transactions: mockTransactions,
        metadata: mockMetadata,
      });

      (CsvAnalysisService.analyse as jest.Mock).mockReturnValue(mockAnalysis);

      // Act
      await workflow.execute(mockParams);

      // Assert
      expect(mockFso.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'UPDATE_CSV_IMPORT',
          payload: expect.objectContaining({
            status: 'analyzed',
          }),
        })
      );
    });
  });

  describe('runPhaseC', () => {
    it('should return partial outcome when warnings exist', async () => {
      // Arrange
      mockImportOrch.processCsvImport.mockReturnValue({
        status: 'success',
        transactions: mockTransactions,
        metadata: mockMetadata,
      });

      const analysisWithWarnings: CsvAnalysisResult = {
        ...mockAnalysis,
        isDiscrepancy: true,
        hasMissingCosts: true,
        discrepancyDetails: 'Income mismatch',
      };

      (CsvAnalysisService.analyse as jest.Mock).mockReturnValue(analysisWithWarnings);

      // Act
      const result = await workflow.execute(mockParams);

      // Assert
      expect(result).toEqual({
        outcome: 'partial',
        processedCount: 1,
        skippedCount: 0,
        warnings: [
          { type: 'ambiguous', message: 'Income mismatch' },
          { type: 'unmatched', message: 'Woonlasten gevonden die niet verwacht werden' },
        ],
        summary: analysisWithWarnings,
      });
    });
  });

  describe('toDispatchPayload', () => {
    it('should correctly map transactions for dispatch', async () => {
      // Arrange
      mockImportOrch.processCsvImport.mockReturnValue({
        status: 'success',
        transactions: mockTransactions,
        metadata: mockMetadata,
      });

      // Act
      await workflow.execute(mockParams);

      // Assert
      const dispatchCall = mockFso.dispatch.mock.calls.find(
        call => call[0].type === 'UPDATE_CSV_IMPORT'
      );

      expect(dispatchCall).toBeDefined();
      if (!dispatchCall) return;
      
      const action = dispatchCall[0];
      if ('payload' in action && action.payload && typeof action.payload === 'object' && 'transactions' in action.payload) {
        const payload = action.payload as any;
        expect(payload.transactions[0]).toHaveProperty('original');
        expect(payload.transactions[0].original).toEqual(mockTransactions[0].original);
        expect(payload.transactions[0]).toHaveProperty('fieldId');
        expect(payload.transactions[0].fieldId).toBe('test');
      }
    });
  });

  describe('error handling', () => {
    it('should handle research phase errors gracefully', async () => {
      // Arrange
      mockImportOrch.processCsvImport.mockReturnValue({
        status: 'success',
        transactions: mockTransactions,
        metadata: mockMetadata,
      });

      (CsvAnalysisService.analyse as jest.Mock).mockReturnValue(mockAnalysis);
      // processAllData is nu synchroon — throw in plaats van rejected Promise
      (mockResearch.processAllData as jest.Mock).mockImplementation(() => {
        throw new Error('Research failed');
      });

      // Act
      const result = await workflow.execute(mockParams);

      // Assert - should still succeed because research error is caught
      expect(result.outcome).toBe('success');
    });

    it('should handle business recompute errors', async () => {
      // Arrange
      mockImportOrch.processCsvImport.mockReturnValue({
        status: 'success',
        transactions: mockTransactions,
        metadata: mockMetadata,
      });

      (CsvAnalysisService.analyse as jest.Mock).mockReturnValue(mockAnalysis);
      mockBusiness.recompute.mockImplementation(() => {
        throw new Error('Recompute failed');
      });

      // Act & Assert
      await expect(workflow.execute(mockParams)).rejects.toThrow('Recompute failed');
    });
  });

  describe('integration with CsvAnalysisService', () => {
    it('should call CsvAnalysisService with correct parameters', async () => {
      // Arrange
      mockImportOrch.processCsvImport.mockReturnValue({
        status: 'success',
        transactions: mockTransactions,
        metadata: mockMetadata,
      });

      const mockState = {
        data: {
          setup: { woningType: 'Huur' },
          finance: { income: { salaries: [] } },
        },
      };
      mockFso.getState.mockReturnValue(mockState as any);

      // Act
      await workflow.execute(mockParams);

      // Assert
      expect(CsvAnalysisService.analyse).toHaveBeenCalledWith(
        mockTransactions,
        mockState.data.setup,
        mockState.data.finance
      );
    });
  });
});