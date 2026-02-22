/**
 * @file_intent Unit tests for csvAdapter - CSV to domain model transformation
 * @repo_architecture Adapter Layer - Tests. Tests pure data transformation from CSV strings to domain CsvItem objects.
 * @term_definition
 *   - CsvItem: Domain model representation of a CSV row with amount, description, date fields
 *   - Column Detection: Regex pattern matching to identify columns by various name synonyms
 *   - mapToInternalModel: Core transformation function that parses CSV and maps to CsvItem array
 */

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import { csvAdapter } from './csvAdapter';
import type { CsvItem } from './csvAdapter';
import type { csvKeys } from '@domain/services/csvProcessor';

// ═══════════════════════════════════════════════════════════════════
// MOCKS - External Dependencies
// ═══════════════════════════════════════════════════════════════════

jest.mock('@utils/csvHelper');
jest.mock('@domain/services/csvProcessor');

import { parseRawCsv } from '@utils/csvHelper';
import { csvProcessor } from '@domain/services/csvProcessor';

// ═══════════════════════════════════════════════════════════════════
// TEST FIXTURES
// ═══════════════════════════════════════════════════════════════════
const processRowMock = csvProcessor.prototype.processRow as jest.MockedFunction<
  (row: Record<string, string>, keys: csvKeys) => CsvItem
>;

// Valid CSV with common bank headers (semicolon-delimited)
const VALID_ING_CSV = `Datum;Naam;Rekening;Tegenrekening;Code;Af Bij;Bedrag;Mutatiesoort;Mededelingen
20240101;Bakker;NL01;NL02;BA;Af;10,00;Betaalautomaat;Brood
20240102;Ruis;NL01;NL02;BA;Bij;50,00;Betaling;Salary`;

// CSV with alternative comma-delimited format
const COMMA_CSV = `date,amount,description
2024-01-01,25.50,Coffee
2024-01-02,15.75,Lunch`;

// CSV with another variant of column names
const VARIANT_CSV = `Boekdatum;Omschrijving;transactie;Bedrag
2024-01-01;Payment;transfer;100,00`;

// Empty CSV inputs
const EMPTY_CSV = '';
const SINGLE_LINE_CSV = 'Header1;Header2;Header3';
const NULL_INPUT = null as unknown as string;

// ═══════════════════════════════════════════════════════════════════
// TESTS
// ═══════════════════════════════════════════════════════════════════

describe('csvAdapter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('mapToInternalModel()', () => {
    it('should parse CSV and return array of CsvItem objects', () => {
      // Arrange
      const mockRows = [
        { Datum: '2024-01-01', Bedrag: '10,00', Nama: 'Bakker', original: {} },
        { Datum: '2024-01-02', Bedrag: '50,00', Nama: 'Ruis', original: {} },
      ];
      (parseRawCsv as jest.Mock).mockReturnValue(mockRows);
      (csvProcessor.prototype.processRow as jest.Mock).mockReturnValue({
        amount: 10,
        description: 'Bakker',
        date: '2024-01-01',
        original: {},
      } as CsvItem);

      // Act
      const result = csvAdapter.mapToInternalModel(VALID_ING_CSV);

      // Assert
      expect(parseRawCsv).toHaveBeenCalledWith(VALID_ING_CSV);
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('amount');
      expect(result[0]).toHaveProperty('description');
      expect(result[0]).toHaveProperty('date');
    });

    it('should handle empty CSV string by returning empty array', () => {
      // Arrange
      (parseRawCsv as jest.Mock).mockReturnValue([]);

      // Act
      const result = csvAdapter.mapToInternalModel(EMPTY_CSV);

      // Assert
      expect(result).toEqual([]);
    });

    it('should handle null parseRawCsv result by returning empty array', () => {
      // Arrange
      (parseRawCsv as jest.Mock).mockReturnValue(null);

      // Act
      const result = csvAdapter.mapToInternalModel(VALID_ING_CSV);

      // Assert
      expect(result).toEqual([]);
    });

    it('should detect AMOUNT column with bedrag/amount/transactie regex', () => {
      // Arrange
      const mockRow = { Bedrag: '25,00', Datum: '2024-01-01' };
      (parseRawCsv as jest.Mock).mockReturnValue([mockRow]);
      let capturedKeys: any = null;
      processRowMock.mockImplementation((row, keys) => {
        capturedKeys = keys;
        return { amount: 25, description: '', date: '2024-01-01', original: {} };
      });

      // Act
      csvAdapter.mapToInternalModel(VALID_ING_CSV);

      // Assert
      expect(capturedKeys.amount).toBe('Bedrag');
    });

    it('should detect DATE column with Datum/Boekdatum/date regex', () => {
      // Arrange
      const mockRow = { Boekdatum: '2024-01-01', Amount: '10' };
      (parseRawCsv as jest.Mock).mockReturnValue([mockRow]);
      let capturedKeys: any = null;
      processRowMock.mockImplementation((row, keys) => {
      capturedKeys = keys;
        return { amount: 10, description: '', date: '2024-01-01', original: {} };
      });

      // Act
      csvAdapter.mapToInternalModel(VALID_ING_CSV);

      // Assert
      expect(capturedKeys.date).toBe('Boekdatum');
    });

    it('should detect DESCRIPTION column with Naam/Omschrijving/Beschrijving regex', () => {
      // Arrange
      const mockRow = { Omschrijving: 'Payment', Bedrag: '50' };
      (parseRawCsv as jest.Mock).mockReturnValue([mockRow]);
      let capturedKeys: any = null;
      processRowMock.mockImplementation((row, keys) => {
        capturedKeys = keys;
        return { amount: 50, description: 'Payment', date: '', original: {} };
      });

      // Act
      csvAdapter.mapToInternalModel(VALID_ING_CSV);

      // Assert
      expect(capturedKeys.description).toBe('Omschrijving');
    });

    it('should handle missing columns by falling back to empty string', () => {
      // Arrange
      const mockRow = { UnrelatedColumn: 'Value' };
      (parseRawCsv as jest.Mock).mockReturnValue([mockRow]);
      let capturedKeys: any = null;
      processRowMock.mockImplementation((row, keys) => {
        capturedKeys = keys;
        return { amount: 0, description: '', date: '', original: {} };
      });

      // Act
      csvAdapter.mapToInternalModel(VALID_ING_CSV);

      // Assert
      expect(capturedKeys.amount).toBe('');
      expect(capturedKeys.date).toBe('');
      expect(capturedKeys.description).toBe('');
    });

    it('should call csvProcessor.processRow for each row from parseRawCsv', () => {
      // Arrange
      const mockRows = [
        { Name: 'Row1', Amount: '10' },
        { Name: 'Row2', Amount: '20' },
      ];
      (parseRawCsv as jest.Mock).mockReturnValue(mockRows);
      (csvProcessor.prototype.processRow as jest.Mock).mockReturnValue({
        amount: 0,
        description: '',
        date: '',
        original: {},
      });

      // Act
      csvAdapter.mapToInternalModel(VALID_ING_CSV);

      // Assert
      expect(csvProcessor.prototype.processRow).toHaveBeenCalledTimes(2);
    });

    it('should call csvProcessor.processRow with row and detected keys', () => {
      // Arrange
      const mockRow = { BedragColumn: '100', DateColumn: '2024-01-01' };
      (parseRawCsv as jest.Mock).mockReturnValue([mockRow]);
      (csvProcessor.prototype.processRow as jest.Mock).mockReturnValue({
        amount: 100,
        description: '',
        date: '2024-01-01',
        original: {},
      });

      // Act
      csvAdapter.mapToInternalModel(VALID_ING_CSV);

      // Assert
      expect(csvProcessor.prototype.processRow).toHaveBeenCalledWith(
        mockRow,
        expect.objectContaining({
          amount: expect.any(String),
          date: expect.any(String),
          description: expect.any(String),
          mutation: expect.any(String),
        }),
      );
    });

    it('should cast csvProcessor result as CsvItem type', () => {
      // Arrange
      const mockRow = { Bedrag: '50' };
      (parseRawCsv as jest.Mock).mockReturnValue([mockRow]);
      const procesedItem = {
        amount: 50,
        description: 'Test',
        date: '2024-01-01',
        original: { Bedrag: '50' },
      };
      (csvProcessor.prototype.processRow as jest.Mock).mockReturnValue(procesedItem);

      // Act
      const result = csvAdapter.mapToInternalModel(VALID_ING_CSV);

      // Assert
      expect(result[0]).toEqual(procesedItem);
      expect(result[0]).toHaveProperty('amount');
      expect(result[0]).toHaveProperty('description');
      expect(result[0]).toHaveProperty('date');
      expect(result[0]).toHaveProperty('original');
    });

    it('should handle multiple rows and return array with matching length', () => {
      // Arrange
      const mockRows = [
        { Amount: '10', Date: '2024-01-01' },
        { Amount: '20', Date: '2024-01-02' },
        { Amount: '30', Date: '2024-01-03' },
      ];
      (parseRawCsv as jest.Mock).mockReturnValue(mockRows);
      (csvProcessor.prototype.processRow as jest.Mock).mockReturnValue({
        amount: 10,
        description: '',
        date: '',
        original: {},
      });

      // Act
      const result = csvAdapter.mapToInternalModel(VALID_ING_CSV);

      // Assert
      expect(result).toHaveLength(3);
    });

    it('should preserve original row in CsvItem within csvProcessor response', () => {
      // Arrange
      const mockRow = { Bedrag: '75', Beschrijving: 'Expense' };
      (parseRawCsv as jest.Mock).mockReturnValue([mockRow]);
      const expectedItem: CsvItem = {
        amount: 75,
        description: 'Expense',
        date: '',
        original: mockRow,
      };
      (csvProcessor.prototype.processRow as jest.Mock).mockReturnValue(expectedItem);

      // Act
      const result = csvAdapter.mapToInternalModel(VALID_ING_CSV);

      // Assert
      expect(result[0].original).toEqual(mockRow);
    });
  });

  describe('processCsvData()', () => {
    it('should be an alias for mapToInternalModel', () => {
      // Arrange
      (parseRawCsv as jest.Mock).mockReturnValue([]);
      const spyMap = jest.spyOn(csvAdapter, 'mapToInternalModel');

      // Act
      csvAdapter.processCsvData(VALID_ING_CSV);

      // Assert
      expect(spyMap).toHaveBeenCalledWith(VALID_ING_CSV);
    });

    it('should return same result as mapToInternalModel', () => {
      // Arrange
      const mockRows = [{ Amount: '10' }];
      const mockItem = { amount: 10, description: '', date: '', original: {} };
      (parseRawCsv as jest.Mock).mockReturnValue(mockRows);
      (csvProcessor.prototype.processRow as jest.Mock).mockReturnValue(mockItem);

      // Act
      const resultMap = csvAdapter.mapToInternalModel(VALID_ING_CSV);
      const resultAlias = csvAdapter.processCsvData(VALID_ING_CSV);

      // Assert
      expect(resultAlias).toEqual(resultMap);
    });
  });

  describe('Column Detection - Edge Cases', () => {
    it('should handle case-insensitive regex matching (bedrag vs BEDRAG vs Bedrag)', () => {
      // Arrange
      const mockRows = [
        { BEDRAG: '10' },
        { bedrag: '20' },
        { BeDrAg: '30' },
      ];
      (parseRawCsv as jest.Mock).mockReturnValue([mockRows[0]]);
      let detectedAmount: string = '';
      processRowMock.mockImplementation((row, keys) => {
        detectedAmount = keys.amount;
        return { amount: 0, description: '', date: '', original: {} };
      });

      // Test BEDRAG variant
      csvAdapter.mapToInternalModel(VALID_ING_CSV);
      expect(detectedAmount).toBe('BEDRAG');

      // Test bedrag variant
      (parseRawCsv as jest.Mock).mockReturnValue([mockRows[1]]);
      csvAdapter.mapToInternalModel(VALID_ING_CSV);
      expect(detectedAmount).toBe('bedrag');

      // Test BeDrAg variant
      (parseRawCsv as jest.Mock).mockReturnValue([mockRows[2]]);
      csvAdapter.mapToInternalModel(VALID_ING_CSV);
      expect(detectedAmount).toBe('BeDrAg');
    });

    it('should handle multiple synonyms for amount column', () => {
      // Arrange
      const mockRows = [
        { amount: '10' },
        { transactie: '20' },
      ];
      let detectedAmountSynonym: string = '';
      processRowMock.mockImplementation((row, keys) => {
        detectedAmountSynonym = keys.amount;
        return { amount: 0, description: '', date: '', original: {} };
      });

      // Test "amount" synonym
      (parseRawCsv as jest.Mock).mockReturnValue([mockRows[0]]);
      csvAdapter.mapToInternalModel(VALID_ING_CSV);
      expect(detectedAmountSynonym).toBe('amount');

      // Test "transactie" synonym
      (parseRawCsv as jest.Mock).mockReturnValue([mockRows[1]]);
      csvAdapter.mapToInternalModel(VALID_ING_CSV);
      expect(detectedAmountSynonym).toBe('transactie');
    });
  });
});
