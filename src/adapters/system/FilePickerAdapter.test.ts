/**
 * @file_intent Unit tests for FilePickerAdapter - OS file system integration
 * @repo_architecture Adapter Layer - Tests. Tests Expo SDK integration for file picking and reading.
 * @term_definition
 *   - DocumentPicker: Expo module for OS-native file selection dialog
 *   - FileSystem: Expo module for reading file contents from device storage
 *   - pickAndReadCsvFile: Async function that coordinates file picking and reading with error handling
 */

import { describe, it, expect, jest, beforeEach, afterEach } from '@jest/globals';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { pickAndReadCsvFile } from './FilePickerAdapter';

// ═══════════════════════════════════════════════════════════════════
// MOCKS - External Dependencies
// ═══════════════════════════════════════════════════════════════════

jest.mock('expo-document-picker');
jest.mock('expo-file-system');

// ═══════════════════════════════════════════════════════════════════
// TEST FIXTURES
// ═══════════════════════════════════════════════════════════════════

const FILE_CONTENT = 'Datum;Bedrag\n2024-01-01;100,00\n2024-01-02;50,00';
const FILE_URI = 'file:///cache/document.csv';

// Success response from DocumentPicker
const SUCCESS_RESPONSE = {
  canceled: false,
  assets: [
    {
      uri: FILE_URI,
      name: 'data.csv',
      size: 512,
      mimeType: 'text/csv',
    },
  ],
};

// User cancelled file picker
const CANCELLED_RESPONSE = {
  canceled: true,
  assets: null,
};

// Assets array is null
const NULL_ASSETS_RESPONSE = {
  canceled: false,
  assets: null,
};

// Assets array is undefined
const UNDEFINED_ASSETS_RESPONSE = {
  canceled: false,
  assets: undefined,
};

// Assets array is empty
const EMPTY_ASSETS_RESPONSE = {
  canceled: false,
  assets: [],
};

// First asset is null
const NULL_ASSET_RESPONSE = {
  canceled: false,
  assets: [null],
};

// First asset is undefined
const UNDEFINED_ASSET_RESPONSE = {
  canceled: false,
  assets: [undefined],
};

// ═══════════════════════════════════════════════════════════════════
// TESTS
// ═══════════════════════════════════════════════════════════════════

describe('FilePickerAdapter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('pickAndReadCsvFile()', () => {
    it('should call DocumentPicker.getDocumentAsync with correct options', async () => {
      // Arrange
      (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue(SUCCESS_RESPONSE);
      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(FILE_CONTENT);

      // Act
      await pickAndReadCsvFile();

      // Assert
      expect(DocumentPicker.getDocumentAsync).toHaveBeenCalledWith({
        type: ['text/comma-separated-values', 'text/plain'],
        copyToCacheDirectory: true,
      });
    });

    it('should request both csv and text MIME types for maximum compatibility', async () => {
      // Arrange
      (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue(SUCCESS_RESPONSE);
      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(FILE_CONTENT);

      // Act
      await pickAndReadCsvFile();

      // Assert
      const callArgs = (DocumentPicker.getDocumentAsync as jest.Mock).mock.calls[0][0];
      expect(callArgs.type).toContain('text/comma-separated-values');
      expect(callArgs.type).toContain('text/plain');
    });

    it('should set copyToCacheDirectory to true for proper file caching', async () => {
      // Arrange
      (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue(SUCCESS_RESPONSE);
      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(FILE_CONTENT);

      // Act
      await pickAndReadCsvFile();

      // Assert
      const callArgs = (DocumentPicker.getDocumentAsync as jest.Mock).mock.calls[0][0];
      expect(callArgs.copyToCacheDirectory).toBe(true);
    });

    it('should return file content as string on successful file read', async () => {
      // Arrange
      const expectedContent = 'Header1;Header2\nValue1;Value2';
      (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue(SUCCESS_RESPONSE);
      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(expectedContent);

      // Act
      const result = await pickAndReadCsvFile();

      // Assert
      expect(result).toBe(expectedContent);
    });

    it('should call FileSystem.readAsStringAsync with correct URI and UTF-8 encoding', async () => {
      // Arrange
      (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue(SUCCESS_RESPONSE);
      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(FILE_CONTENT);

      // Act
      await pickAndReadCsvFile();

      // Assert
      expect(FileSystem.readAsStringAsync).toHaveBeenCalledWith(FILE_URI, {
        encoding: 'utf8',
      });
    });

    it('should throw "Bestand selecteren geannuleerd" if user cancels (result.canceled === true)', async () => {
      // Arrange
      (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue(CANCELLED_RESPONSE);

      // Act & Assert
      await expect(pickAndReadCsvFile()).rejects.toThrow('Bestand selecteren geannuleerd');
    });

    it('should throw "Geen bestand geselecteerd" if assets is null', async () => {
      // Arrange
      (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue(NULL_ASSETS_RESPONSE);

      // Act & Assert
      await expect(pickAndReadCsvFile()).rejects.toThrow('Geen bestand geselecteerd');
    });

    it('should throw "Geen bestand geselecteerd" if assets is undefined', async () => {
      // Arrange
      (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue(UNDEFINED_ASSETS_RESPONSE);

      // Act & Assert
      await expect(pickAndReadCsvFile()).rejects.toThrow('Geen bestand geselecteerd');
    });

    it('should throw "Geen bestand geselecteerd" if assets is empty array', async () => {
      // Arrange
      (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue(EMPTY_ASSETS_RESPONSE);

      // Act & Assert
      await expect(pickAndReadCsvFile()).rejects.toThrow('Geen bestand geselecteerd');
    });

    it('should throw "Bestandsdata is corrupt of ontbreekt" if first asset is null', async () => {
      // Arrange
      (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue(NULL_ASSET_RESPONSE);

      // Act & Assert
      await expect(pickAndReadCsvFile()).rejects.toThrow('Bestandsdata is corrupt of ontbreekt');
    });

    it('should throw "Bestandsdata is corrupt of ontbreekt" if first asset is undefined', async () => {
      // Arrange
      (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue(UNDEFINED_ASSET_RESPONSE);

      // Act & Assert
      await expect(pickAndReadCsvFile()).rejects.toThrow('Bestandsdata is corrupt of ontbreekt');
    });

    it('should wrap file system read errors with FilePickerAdapter context', async () => {
      // Arrange
      const originalError = new Error('File read operation failed');
      (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue(SUCCESS_RESPONSE);
      (FileSystem.readAsStringAsync as jest.Mock).mockRejectedValue(originalError);

      // Act & Assert
      try {
        await pickAndReadCsvFile();
        fail('Should have thrown an error');
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(Error);
        const err = error as Error;
        expect(err.message).toContain('FilePickerAdapter:');
        expect(err.message).toContain('File read operation failed');
      }
    });

    it('should wrap unknown errors with FilePickerAdapter context', async () => {
      // Arrange
      const unknownError = 'Unknown error type';
      (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue(SUCCESS_RESPONSE);
      (FileSystem.readAsStringAsync as jest.Mock).mockRejectedValue(unknownError);

      // Act & Assert
      try {
        await pickAndReadCsvFile();
        fail('Should have thrown an error');
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(Error);
        const err = error as Error;
        expect(err.message).toContain('FilePickerAdapter:');
      }
    });

    it('should be async and return Promise<string>', () => {
      // Arrange
      (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue(SUCCESS_RESPONSE);
      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(FILE_CONTENT);

      // Act
      const result = pickAndReadCsvFile();

      // Assert
      expect(result).toBeInstanceOf(Promise);
    });
  });

  describe('Error Handling & Edge Cases', () => {
    it('should handle DocumentPicker rejection with proper error context', async () => {
      // Arrange
      const pickerError = new Error('Picker denied permissions');
      (DocumentPicker.getDocumentAsync as jest.Mock).mockRejectedValue(pickerError);

      // Act & Assert
      try {
        await pickAndReadCsvFile();
        fail('Should have thrown an error');
      } catch (error: unknown) {
        expect(error).toBeInstanceOf(Error);
      }
    });

    it('should read file exactly from the URI provided by asset', async () => {
      // Arrange
      const customUri = 'file:///specific/path/file.csv';
      const customResponse = {
        canceled: false,
        assets: [{ uri: customUri, name: 'custom.csv', size: 1024 }],
      };
      (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue(customResponse);
      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(FILE_CONTENT);

      // Act
      await pickAndReadCsvFile();

      // Assert
      expect(FileSystem.readAsStringAsync).toHaveBeenCalledWith(
        customUri,
        expect.any(Object),
      );
    });

    it('should only read the first asset in case of multiple assets', async () => {
      // Arrange
      const multiAssetResponse = {
        canceled: false,
        assets: [
          { uri: 'file:///first.csv', name: 'first.csv', size: 512 },
          { uri: 'file:///second.csv', name: 'second.csv', size: 512 },
        ],
      };
      (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue(multiAssetResponse);
      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(FILE_CONTENT);

      // Act
      await pickAndReadCsvFile();

      // Assert
      expect(FileSystem.readAsStringAsync).toHaveBeenCalledWith(
        'file:///first.csv',
        expect.any(Object),
      );
      expect(FileSystem.readAsStringAsync).toHaveBeenCalledTimes(1);
    });

    it('should explicitly check result.canceled === true (not truthy)', async () => {
      // Arrange
      const falseyCancelResponse = {
        canceled: 0, // falsy but not true
        assets: [{ uri: FILE_URI, name: 'file.csv' }],
      };
      (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue(
        falseyCancelResponse as any,
      );
      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(FILE_CONTENT);

      // Act
      const result = await pickAndReadCsvFile();

      // Assert - Should NOT throw because 0 !== true
      expect(result).toBe(FILE_CONTENT);
    });

    it('should preserve original error message when wrapping file system errors', async () => {
      // Arrange
      const originalMessage = 'Specific file system error: permission denied';
      const originalError = new Error(originalMessage);
      (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue(SUCCESS_RESPONSE);
      (FileSystem.readAsStringAsync as jest.Mock).mockRejectedValue(originalError);

      // Act & Assert
      try {
        await pickAndReadCsvFile();
        fail('Should have thrown an error');
      } catch (error: unknown) {
        const err = error as Error;
        expect(err.message).toContain(originalMessage);
      }
    });
  });

  describe('Integration Scenarios', () => {
    it('should successfully complete full file pick and read flow', async () => {
      // Arrange
      const csvData = 'Column1;Column2\nValue1;Value2\nValue3;Value4';
      (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue(SUCCESS_RESPONSE);
      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(csvData);

      // Act
      const result = await pickAndReadCsvFile();

      // Assert
      expect(result).toBe(csvData);
      expect(DocumentPicker.getDocumentAsync).toHaveBeenCalled();
      expect(FileSystem.readAsStringAsync).toHaveBeenCalled();
    });

    it('should handle large CSV files correctly', async () => {
      // Arrange
      const largeContent = 'Header\n' + 'Data\n'.repeat(10000);
      (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue(SUCCESS_RESPONSE);
      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(largeContent);

      // Act
      const result = await pickAndReadCsvFile();

      // Assert
      expect(result).toBe(largeContent);
      expect(result.length).toBeGreaterThan(10000);
    });

    it('should handle CSV content with special characters and encodings', async () => {
      // Arrange
      const specialContent = 'Résumé;Naïve\nÄpfel;Öl\n€uro;¥en';
      (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValue(SUCCESS_RESPONSE);
      (FileSystem.readAsStringAsync as jest.Mock).mockResolvedValue(specialContent);

      // Act
      const result = await pickAndReadCsvFile();

      // Assert
      expect(result).toBe(specialContent);
      expect(result).toContain('Résumé');
      expect(result).toContain('€uro');
    });
  });
});
