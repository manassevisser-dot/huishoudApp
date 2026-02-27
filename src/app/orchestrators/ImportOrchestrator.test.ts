// src/app/orchestrators/__tests__/ImportOrchestrator.test.ts
/**
 * @file_intent Unit tests voor ImportOrchestrator - CSV parsing ACL boundary
 */

import { ImportOrchestrator } from './ImportOrchestrator';
import { dataProcessor } from '@domain/finance/StatementIntakePipeline';
import { csvAdapter } from '@adapters/csv/csvAdapter';
import { Logger } from '@adapters/audit/AuditLoggerAdapter';
import type { CsvItem } from '@adapters/csv/csvAdapter';
import type { CsvParseResult } from './types/csvUpload.types';

// Mocks
jest.mock('@domain/finance/StatementIntakePipeline');
jest.mock('@adapters/csv/csvAdapter');
jest.mock('@adapters/audit/AuditLoggerAdapter');

describe('ImportOrchestrator', () => {
  let orchestrator: ImportOrchestrator;

  beforeEach(() => {
    jest.clearAllMocks();
    orchestrator = new ImportOrchestrator();
  });

  // =========================================================================
  // processCsvImport - SUCCESS PATHS
  // =========================================================================

  describe('processCsvImport - success', () => {
    it('should parse valid CSV and return transactions', () => {
      // Arrange
      const mockCsv = 'datum,bedrag,omschrijving\n2024-01-01,42.50,Boodschappen';
      const mockAdapterResult: CsvItem[] = [{
        date: '2024-01-01',
        amountEuros: 42.50,
        description: 'Boodschappen',
        original: { datum: '2024-01-01', bedrag: '42,50', omschrijving: 'Boodschappen' }
      }];

      (csvAdapter.mapToInternalModel as jest.Mock).mockReturnValue(mockAdapterResult);
      (dataProcessor.stripPII as jest.Mock).mockReturnValue('Boodschappen');
      (dataProcessor.categorize as jest.Mock).mockReturnValue('Boodschappen');

      // Act
      const result = orchestrator.processCsvImport(mockCsv);

      // Assert
      expect(result.status).toBe('success');
      if (result.status === 'success') {
        expect(result.transactions).toHaveLength(1);
        expect(result.transactions[0]).toMatchObject({
          amount: 42.50,
          amountCents: 4250,
          description: 'Boodschappen',
          category: 'Boodschappen',
          original: {
            rawDigest: expect.any(String),
            schemaVersion: 'csv-v1',
            importedAt: expect.any(String),
            columnMapVersion: 'v1',
            flags: [],
          },
        });
        expect(result.transactions[0].id).toMatch(/^csv_[0-9a-f]+$/);
        expect(result.transactions[0].fieldId).toMatch(/^csv_tx_[0-9a-f]+_0$/);
      }
    });

    it('should handle multiple transactions', () => {
      // Arrange
      const mockCsv = 'datum,bedrag,omschrijving\n2024-01-01,42.50,Boodschappen\n2024-01-02,15.30,Koffie';
      const mockAdapterResult: CsvItem[] = [
        {
          date: '2024-01-01',
          amountEuros: 42.50,
          description: 'Boodschappen',
          original: { datum: '2024-01-01', bedrag: '42,50', omschrijving: 'Boodschappen' }
        },
        {
          date: '2024-01-02',
          amountEuros: 15.30,
          description: 'Koffie',
          original: { datum: '2024-01-02', bedrag: '15,30', omschrijving: 'Koffie' }
        }
      ];

      (csvAdapter.mapToInternalModel as jest.Mock).mockReturnValue(mockAdapterResult);
      (dataProcessor.stripPII as jest.Mock).mockImplementation((desc: string) => desc);
      (dataProcessor.categorize as jest.Mock).mockImplementation((desc: string) => desc);

      // Act
      const result = orchestrator.processCsvImport(mockCsv);

      // Assert
      expect(result.status).toBe('success');
      if (result.status === 'success') {
        expect(result.transactions).toHaveLength(2);
        expect(result.metadata.parsedCount).toBe(2);
      }
    });
  });

  // =========================================================================
  // processCsvImport - EMPTY PATHS
  // =========================================================================

  describe('processCsvImport - empty', () => {
    it('should return empty status when CSV is empty string', () => {
      // Arrange
      (csvAdapter.mapToInternalModel as jest.Mock).mockReturnValue([]);

      // Act
      const result = orchestrator.processCsvImport('');

      // Assert
      expect(result.status).toBe('empty');
      if (result.status === 'empty') {
        expect(result.message).toBe('Geen verwerkte transacties gevonden in het CSV-bestand.');
      }
    });

    it('should return empty status when CSV contains only headers', () => {
      // Arrange
      const mockCsv = 'datum,bedrag,omschrijving';
      (csvAdapter.mapToInternalModel as jest.Mock).mockReturnValue([]);

      // Act
      const result = orchestrator.processCsvImport(mockCsv);

      // Assert
      expect(result.status).toBe('empty');
    });

    it('should return empty status when all rows are invalid', () => {
      // Arrange
      const mockCsv = 'datum,bedrag,omschrijving\n2024-01-01,0,Test';
      const mockAdapterResult: CsvItem[] = [{
        date: '2024-01-01',
        amountEuros: 0,
        description: 'Test',
        original: { datum: '2024-01-01', bedrag: '0', omschrijving: 'Test' }
      }];

      (csvAdapter.mapToInternalModel as jest.Mock).mockReturnValue(mockAdapterResult);

      // Act
      const result = orchestrator.processCsvImport(mockCsv);

      // Assert
      expect(result.status).toBe('empty');
    });
  });

  // =========================================================================
  // processCsvImport - ERROR PATHS
  // =========================================================================

  describe('processCsvImport - error', () => {
    it('should return error status when csvAdapter throws', () => {
      // Arrange
      const mockCsv = 'invalid,csv';
      const mockError = new Error('Adapter failure');
      (csvAdapter.mapToInternalModel as jest.Mock).mockImplementation(() => {
        throw mockError;
      });

      // Act
      const result = orchestrator.processCsvImport(mockCsv);

      // Assert
      expect(result.status).toBe('error');
      if (result.status === 'error') {
        expect(result.errorMessage).toBe('Adapter failure');
        expect(result.technicalDetails?.errorCode).toBe('PARSING_ERROR');
      }
      expect(Logger.error).toHaveBeenCalled();
    });

    it('should return error status with fallback message for non-Error throws', () => {
      // Arrange
      const mockCsv = 'invalid,csv';
      (csvAdapter.mapToInternalModel as jest.Mock).mockImplementation(() => {
        throw 'String error';
      });

      // Act
      const result = orchestrator.processCsvImport(mockCsv);

      // Assert
      expect(result.status).toBe('error');
      if (result.status === 'error') {
        expect(result.errorMessage).toBe('Fout bij verwerken van CSV');
      }
    });
  });

  // =========================================================================
  // Edge Cases & Flag Logic
  // =========================================================================

  describe('edge cases and flag handling', () => {
    it('should filter out transactions with invalid amount', () => {
      // Arrange
      const mockAdapterResult: CsvItem[] = [
        {
          date: '2024-01-01',
          amountEuros: 42.50,
          description: 'Valid',
          original: { datum: '2024-01-01', bedrag: '42,50', omschrijving: 'Valid' }
        },
        {
          date: '2024-01-02',
          amountEuros: 0,
          description: 'Zero amount',
          original: { datum: '2024-01-02', bedrag: '0', omschrijving: 'Zero amount' }
        },
        {
          date: '2024-01-03',
          amountEuros: NaN,
          description: 'NaN',
          original: { datum: '2024-01-03', bedrag: 'invalid', omschrijving: 'NaN' }
        }
      ];

      (csvAdapter.mapToInternalModel as jest.Mock).mockReturnValue(mockAdapterResult);
      (dataProcessor.stripPII as jest.Mock).mockReturnValue('Valid');
      (dataProcessor.categorize as jest.Mock).mockReturnValue('Valid');

      // Act
      const result = orchestrator.processCsvImport('mock,csv');

      // Assert
      expect(result.status).toBe('success');
      if (result.status === 'success') {
        expect(result.transactions).toHaveLength(1);
        expect(result.transactions[0].description).toBe('Valid');
      }
    });

   it('should add missing_description flag when description is empty', () => {
  // Arrange
  const mockAdapterResult: CsvItem[] = [{
    date: '2024-01-01',
    amountEuros: 42.50,
    description: '',
    original: { datum: '2024-01-01', bedrag: '42,50', omschrijving: '' }
  }];

  (csvAdapter.mapToInternalModel as jest.Mock).mockReturnValue(mockAdapterResult);
  (dataProcessor.stripPII as jest.Mock).mockReturnValue('Geen omschrijving');
  (dataProcessor.categorize as jest.Mock).mockReturnValue('Overig'); // ← Dit is GEEN lege string

  // Act
  const result = orchestrator.processCsvImport('mock,csv');

  // Assert
  expect(result.status).toBe('success');
  if (result.status === 'success') {
    expect(result.transactions[0].description).toBe('Geen omschrijving');
    expect(result.transactions[0].original.flags).toContain('missing_description');
    // fallback_category wordt NIET toegevoegd omdat categorize 'Overig' teruggeeft
    expect(result.transactions[0].original.flags).not.toContain('fallback_category');
  }
});
it('should add fallback_category flag when categorize returns empty string', () => {
  // Arrange
  const mockAdapterResult: CsvItem[] = [{
    date: '2024-01-01',
    amountEuros: 42.50,
    description: 'Iets onbekends',
    original: { datum: '2024-01-01', bedrag: '42,50', omschrijving: 'Iets onbekends' }
  }];

  (csvAdapter.mapToInternalModel as jest.Mock).mockReturnValue(mockAdapterResult);
  (dataProcessor.stripPII as jest.Mock).mockReturnValue('Iets onbekends');
  (dataProcessor.categorize as jest.Mock).mockReturnValue(''); // ← LEGE STRING!

  // Act
  const result = orchestrator.processCsvImport('mock,csv');

  // Assert
  expect(result.status).toBe('success');
  if (result.status === 'success') {
    expect(result.transactions[0].category).toBe('Overig');
    expect(result.transactions[0].original.flags).toContain('fallback_category');
  }
});

    it('should add missing_date flag and use imported date when date is missing', () => {
      // Arrange
      const mockDate = '2024-01-15';
      jest.useFakeTimers().setSystemTime(new Date(mockDate));

      const mockAdapterResult: CsvItem[] = [{
        date: '',
        amountEuros: 42.50,
        description: 'Boodschappen',
        original: { datum: '', bedrag: '42,50', omschrijving: 'Boodschappen' }
      }];

      (csvAdapter.mapToInternalModel as jest.Mock).mockReturnValue(mockAdapterResult);
      (dataProcessor.stripPII as jest.Mock).mockReturnValue('Boodschappen');
      (dataProcessor.categorize as jest.Mock).mockReturnValue('Boodschappen');

      // Act
      const result = orchestrator.processCsvImport('mock,csv');

      // Assert
      expect(result.status).toBe('success');
      if (result.status === 'success') {
        expect(result.transactions[0].date).toBe(mockDate);
        expect(result.transactions[0].original.flags).toContain('missing_date');
      }

      jest.useRealTimers();
    });

    it('should add missing_date flag when date is invalid', () => {
      // Arrange
      const mockAdapterResult: CsvItem[] = [{
        date: 'invalid-date',
        amountEuros: 42.50,
        description: 'Boodschappen',
        original: { datum: 'invalid-date', bedrag: '42,50', omschrijving: 'Boodschappen' }
      }];

      (csvAdapter.mapToInternalModel as jest.Mock).mockReturnValue(mockAdapterResult);
      (dataProcessor.stripPII as jest.Mock).mockReturnValue('Boodschappen');
      (dataProcessor.categorize as jest.Mock).mockReturnValue('Boodschappen');

      // Act
      const result = orchestrator.processCsvImport('mock,csv');

      // Assert
      expect(result.status).toBe('success');
      if (result.status === 'success') {
        expect(result.transactions[0].original.flags).toContain('missing_date');
        expect(result.transactions[0].date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    });

    it('should add fallback_category flag when categorization returns empty', () => {
      // Arrange
      const mockAdapterResult: CsvItem[] = [{
        date: '2024-01-01',
        amountEuros: 42.50,
        description: 'Unknown',
        original: { datum: '2024-01-01', bedrag: '42,50', omschrijving: 'Unknown' }
      }];

      (csvAdapter.mapToInternalModel as jest.Mock).mockReturnValue(mockAdapterResult);
      (dataProcessor.stripPII as jest.Mock).mockReturnValue('Unknown');
      (dataProcessor.categorize as jest.Mock).mockReturnValue('');

      // Act
      const result = orchestrator.processCsvImport('mock,csv');

      // Assert
      expect(result.status).toBe('success');
      if (result.status === 'success') {
        expect(result.transactions[0].category).toBe('Overig');
        expect(result.transactions[0].original.flags).toContain('fallback_category');
      }
    });
  });

  // =========================================================================
  // Digest Generation
  // =========================================================================

  describe('digest generation', () => {
    it('should generate consistent digest for same input', () => {
      // Arrange
      const mockAdapterResult: CsvItem[] = [{
        date: '2024-01-01',
        amountEuros: 42.50,
        description: 'Boodschappen',
        original: { datum: '2024-01-01', bedrag: '42,50', omschrijving: 'Boodschappen' }
      }];

      (csvAdapter.mapToInternalModel as jest.Mock).mockReturnValue(mockAdapterResult);
      (dataProcessor.stripPII as jest.Mock).mockReturnValue('Boodschappen');
      (dataProcessor.categorize as jest.Mock).mockReturnValue('Boodschappen');

      // Act
      const result1 = orchestrator.processCsvImport('mock,csv');
      const result2 = orchestrator.processCsvImport('mock,csv');

      // Assert
      expect(result1.status).toBe('success');
      expect(result2.status).toBe('success');
      if (result1.status === 'success' && result2.status === 'success') {
        expect(result1.transactions[0].original.rawDigest)
          .toBe(result2.transactions[0].original.rawDigest);
      }
    });

    it('should generate different digests for different inputs', () => {
      // Arrange
      const mockAdapterResult1: CsvItem[] = [{
        date: '2024-01-01',
        amountEuros: 42.50,
        description: 'Boodschappen',
        original: { datum: '2024-01-01', bedrag: '42,50', omschrijving: 'Boodschappen' }
      }];
      const mockAdapterResult2: CsvItem[] = [{
        date: '2024-01-02',
        amountEuros: 42.50,
        description: 'Boodschappen',
        original: { datum: '2024-01-02', bedrag: '42,50', omschrijving: 'Boodschappen' }
      }];

      (csvAdapter.mapToInternalModel as jest.Mock)
        .mockReturnValueOnce(mockAdapterResult1)
        .mockReturnValueOnce(mockAdapterResult2);
      (dataProcessor.stripPII as jest.Mock).mockReturnValue('Boodschappen');
      (dataProcessor.categorize as jest.Mock).mockReturnValue('Boodschappen');

      // Act
      const result1 = orchestrator.processCsvImport('mock1,csv');
      const result2 = orchestrator.processCsvImport('mock2,csv');

      // Assert
      expect(result1.status).toBe('success');
      expect(result2.status).toBe('success');
      if (result1.status === 'success' && result2.status === 'success') {
        expect(result1.transactions[0].original.rawDigest)
          .not.toBe(result2.transactions[0].original.rawDigest);
      }
    });
  });
});