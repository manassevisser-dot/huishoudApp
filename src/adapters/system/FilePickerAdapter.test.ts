jest.mock('expo-document-picker', () => ({
  getDocumentAsync: jest.fn(),
}));

jest.mock('expo-file-system', () => ({
  readAsStringAsync: jest.fn(),
}));

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

const mockedDocumentPicker = jest.mocked(DocumentPicker);
const mockedFileSystem = jest.mocked(FileSystem);

// ═══════════════════════════════════════════════════════════════════
// TEST FIXTURES
// ═══════════════════════════════════════════════════════════════════

const FILE_CONTENT = 'Datum;Bedrag\n2024-01-01;100,00\n2024-01-02;50,00';
const FILE_URI = 'file:///cache/document.csv';

const SUCCESS_RESPONSE: DocumentPicker.DocumentPickerSuccessResult = {
  canceled: false,
  assets: [
    {
      uri: FILE_URI,
      name: 'data.csv',
      size: 512,
      mimeType: 'text/csv',
      lastModified: Date.now(),
    },
  ],
};

const NULL_ASSETS_RESPONSE = {
  canceled: false,
  assets: null,
} as any;

const UNDEFINED_ASSETS_RESPONSE = {
  canceled: false,
  assets: undefined,
} as any;

const EMPTY_ASSETS_RESPONSE = {
  canceled: false,
  assets: [],
} as any;

const NULL_ASSET_RESPONSE = {
  canceled: false,
  assets: [null],
} as any;

const UNDEFINED_ASSET_RESPONSE = {
  canceled: false,
  assets: [undefined],
} as any;

const CANCELLED_RESPONSE: DocumentPicker.DocumentPickerCanceledResult = {
  canceled: true,
  assets: null,
};

const MULTI_ASSET_RESPONSE: DocumentPicker.DocumentPickerSuccessResult = {
  canceled: false,
  assets: [
    { uri: 'file:///first.csv', name: 'first.csv', size: 512, lastModified: Date.now() },
    { uri: 'file:///second.csv', name: 'second.csv', size: 512, lastModified: Date.now() },
  ],
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
      mockedDocumentPicker.getDocumentAsync.mockResolvedValue(SUCCESS_RESPONSE);
      mockedFileSystem.readAsStringAsync.mockResolvedValue(FILE_CONTENT);

      // Act
      await pickAndReadCsvFile();

      // Assert
      expect(mockedDocumentPicker.getDocumentAsync).toHaveBeenCalledWith({
        type: ['text/comma-separated-values', 'text/plain'],
        copyToCacheDirectory: true,
      });
    });

    it('should request both csv and text MIME types for maximum compatibility', async () => {
      // Arrange
      mockedDocumentPicker.getDocumentAsync.mockResolvedValue(SUCCESS_RESPONSE);
      mockedFileSystem.readAsStringAsync.mockResolvedValue(FILE_CONTENT);

      // Act
      await pickAndReadCsvFile();

      // Assert
      const callArgs = mockedDocumentPicker.getDocumentAsync.mock.calls[0]?.[0];
      expect(callArgs?.type).toContain('text/comma-separated-values');
      expect(callArgs?.type).toContain('text/plain');
    });

    it('should set copyToCacheDirectory to true for proper file caching', async () => {
      // Arrange
      mockedDocumentPicker.getDocumentAsync.mockResolvedValue(SUCCESS_RESPONSE);
      mockedFileSystem.readAsStringAsync.mockResolvedValue(FILE_CONTENT);

      // Act
      await pickAndReadCsvFile();

      // Assert
      const callArgs = mockedDocumentPicker.getDocumentAsync.mock.calls[0]?.[0];
      expect(callArgs?.copyToCacheDirectory).toBe(true);
    });

    it('should return file content as string on successful file read', async () => {
      // Arrange
      const expectedContent = 'Header1;Header2\nValue1;Value2';
      mockedDocumentPicker.getDocumentAsync.mockResolvedValue(SUCCESS_RESPONSE);
      mockedFileSystem.readAsStringAsync.mockResolvedValue(expectedContent);

      // Act
      const result = await pickAndReadCsvFile();

      // Assert
      expect(result).toBe(expectedContent);
    });

    it('should call FileSystem.readAsStringAsync with correct URI and UTF-8 encoding', async () => {
      // Arrange
      mockedDocumentPicker.getDocumentAsync.mockResolvedValue(SUCCESS_RESPONSE);
      mockedFileSystem.readAsStringAsync.mockResolvedValue(FILE_CONTENT);

      // Act
      await pickAndReadCsvFile();

      // Assert
      expect(mockedFileSystem.readAsStringAsync).toHaveBeenCalledWith(FILE_URI, {
        encoding: 'utf8',
      });
    });

    it('should throw "Bestand selecteren geannuleerd" if user cancels (result.canceled === true)', async () => {
      // Arrange
      mockedDocumentPicker.getDocumentAsync.mockResolvedValue(CANCELLED_RESPONSE);

      // Act & Assert
      await expect(pickAndReadCsvFile()).rejects.toThrow('Bestand selecteren geannuleerd');
    });

    it('should throw "Geen bestand geselecteerd" if assets is null', async () => {
      // Arrange
      mockedDocumentPicker.getDocumentAsync.mockResolvedValue(NULL_ASSETS_RESPONSE);

      // Act & Assert
      await expect(pickAndReadCsvFile()).rejects.toThrow('Geen bestand geselecteerd');
    });

    it('should throw "Geen bestand geselecteerd" if assets is undefined', async () => {
      // Arrange
      mockedDocumentPicker.getDocumentAsync.mockResolvedValue(UNDEFINED_ASSETS_RESPONSE);

      // Act & Assert
      await expect(pickAndReadCsvFile()).rejects.toThrow('Geen bestand geselecteerd');
    });

    it('should throw "Geen bestand geselecteerd" if assets is empty array', async () => {
      // Arrange
      mockedDocumentPicker.getDocumentAsync.mockResolvedValue(EMPTY_ASSETS_RESPONSE);

      // Act & Assert
      await expect(pickAndReadCsvFile()).rejects.toThrow('Geen bestand geselecteerd');
    });

    it('should throw "Bestandsdata is corrupt of ontbreekt" if first asset is null', async () => {
      // Arrange
      mockedDocumentPicker.getDocumentAsync.mockResolvedValue(NULL_ASSET_RESPONSE);

      // Act & Assert
      await expect(pickAndReadCsvFile()).rejects.toThrow('Bestandsdata is corrupt of ontbreekt');
    });

    it('should throw "Bestandsdata is corrupt of ontbreekt" if first asset is undefined', async () => {
      // Arrange
      mockedDocumentPicker.getDocumentAsync.mockResolvedValue(UNDEFINED_ASSET_RESPONSE);

      // Act & Assert
      await expect(pickAndReadCsvFile()).rejects.toThrow('Bestandsdata is corrupt of ontbreekt');
    });

    it('should wrap file system read errors with FilePickerAdapter context', async () => {
      // Arrange
      const originalError = new Error('File read operation failed');
      mockedDocumentPicker.getDocumentAsync.mockResolvedValue(SUCCESS_RESPONSE);
      mockedFileSystem.readAsStringAsync.mockRejectedValue(originalError);

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
      mockedDocumentPicker.getDocumentAsync.mockResolvedValue(SUCCESS_RESPONSE);
      mockedFileSystem.readAsStringAsync.mockRejectedValue(unknownError);

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
      mockedDocumentPicker.getDocumentAsync.mockResolvedValue(SUCCESS_RESPONSE);
      mockedFileSystem.readAsStringAsync.mockResolvedValue(FILE_CONTENT);

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
      mockedDocumentPicker.getDocumentAsync.mockRejectedValue(pickerError);

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
        canceled: false as const,
        assets: [{ uri: customUri, name: 'custom.csv', size: 1024 }],
      };
      mockedDocumentPicker.getDocumentAsync.mockResolvedValue(customResponse as any);
      mockedFileSystem.readAsStringAsync.mockResolvedValue(FILE_CONTENT);

      // Act
      await pickAndReadCsvFile();

      // Assert
      expect(mockedFileSystem.readAsStringAsync).toHaveBeenCalledWith(
        customUri,
        expect.any(Object),
      );
    });

    it('should only read the first asset in case of multiple assets', async () => {
      // Arrange
      const multiAssetResponse = {
        canceled: false as const,
        assets: [
          { uri: 'file:///first.csv', name: 'first.csv', size: 512 },
          { uri: 'file:///second.csv', name: 'second.csv', size: 512 },
        ],
      };
      mockedDocumentPicker.getDocumentAsync.mockResolvedValue(MULTI_ASSET_RESPONSE);
      mockedFileSystem.readAsStringAsync.mockResolvedValue(FILE_CONTENT);

      // Act
      await pickAndReadCsvFile();

      // Assert
      expect(mockedFileSystem.readAsStringAsync).toHaveBeenCalledWith(
        'file:///first.csv',
        expect.any(Object),
      );
      expect(mockedFileSystem.readAsStringAsync).toHaveBeenCalledTimes(1);
    });

    it('should explicitly check result.canceled === true (not truthy)', async () => {
      // Arrange
      const falseyCancelResponse = {
        canceled: 0, // falsy but not true
        assets: [{ uri: FILE_URI, name: 'file.csv' }],
      };
      mockedDocumentPicker.getDocumentAsync.mockResolvedValue(
        falseyCancelResponse as any,
      );
      mockedFileSystem.readAsStringAsync.mockResolvedValue(FILE_CONTENT);

      // Act
      const result = await pickAndReadCsvFile();

      // Assert - Should NOT throw because 0 !== true
      expect(result).toBe(FILE_CONTENT);
    });

    it('should preserve original error message when wrapping file system errors', async () => {
      // Arrange
      const originalMessage = 'Specific file system error: permission denied';
      const originalError = new Error(originalMessage);
      mockedDocumentPicker.getDocumentAsync.mockResolvedValue(SUCCESS_RESPONSE);
      mockedFileSystem.readAsStringAsync.mockRejectedValue(originalError);

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
      mockedDocumentPicker.getDocumentAsync.mockResolvedValue(SUCCESS_RESPONSE);
      mockedFileSystem.readAsStringAsync.mockResolvedValue(csvData);

      // Act
      const result = await pickAndReadCsvFile();

      // Assert
      expect(result).toBe(csvData);
      expect(mockedDocumentPicker.getDocumentAsync).toHaveBeenCalled();
      expect(mockedFileSystem.readAsStringAsync).toHaveBeenCalled();
    });

    it('should handle large CSV files correctly', async () => {
      // Arrange
      const largeContent = 'Header\n' + 'Data\n'.repeat(10000);
      mockedDocumentPicker.getDocumentAsync.mockResolvedValue(SUCCESS_RESPONSE);
      mockedFileSystem.readAsStringAsync.mockResolvedValue(largeContent);

      // Act
      const result = await pickAndReadCsvFile();

      // Assert
      expect(result).toBe(largeContent);
      expect(result.length).toBeGreaterThan(10000);
    });

    it('should handle CSV content with special characters and encodings', async () => {
      // Arrange
      const specialContent = 'Résumé;Naïve\nÄpfel;Öl\n€uro;¥en';
      mockedDocumentPicker.getDocumentAsync.mockResolvedValue(SUCCESS_RESPONSE);
      mockedFileSystem.readAsStringAsync.mockResolvedValue(specialContent);

      // Act
      const result = await pickAndReadCsvFile();

      // Assert
      expect(result).toBe(specialContent);
      expect(result).toContain('Résumé');
      expect(result).toContain('€uro');
    });
  });
});
