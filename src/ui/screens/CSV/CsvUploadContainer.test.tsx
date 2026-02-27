// src/ui/screens/csv/CsvUploadContainer.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { CsvUploadContainer } from './CsvUploadContainer';
import { useMaster } from '@ui/providers/MasterProvider';
import { pickAndReadCsvFile, ANNULERING_MESSAGE } from '@adapters/system/FilePickerAdapter';
import { useAppStyles } from '@ui/styles/useAppStyles';

// Expo native modules — moeten voor de FilePickerAdapter auto-mock staan,
// anders probeert Jest de onderliggende module te parsen en crasht het
// omdat expo-document-picker niet in transformIgnorePatterns staat.
jest.mock('expo-document-picker', () => ({
  getDocumentAsync: jest.fn(),
}));
jest.mock('expo-file-system', () => ({
  readAsStringAsync: jest.fn(),
}));

// Mock dependencies
jest.mock('@ui/providers/MasterProvider');
jest.mock('@adapters/system/FilePickerAdapter');
jest.mock('@ui/styles/useAppStyles');
jest.mock('./CsvUploadScreen', () => ({
  CsvUploadScreen: jest.fn(({ onPickFile, isUploading }) => {
    const { View, TouchableOpacity, Text } = require('react-native');
    return (
      <View testID="mock-csv-upload-screen">
        <TouchableOpacity testID="pick-file-button" onPress={() => onPickFile()}>
          <Text>Pick File</Text>
        </TouchableOpacity>
        {isUploading && <Text testID="uploading-indicator">Uploading...</Text>}
      </View>
    );
  }),
}));

describe('CsvUploadContainer', () => {
  // Mocks
  const mockNavigateToCsvAnalysis = jest.fn();
  const mockHandleCsvImport = jest.fn().mockResolvedValue(undefined);
  const mockMaster = {
    handleCsvImport: mockHandleCsvImport,
    navigation: {
      goToCsvAnalysis: mockNavigateToCsvAnalysis,
    },
  };

  const mockStyles = {
    screenContainer: { flex: 1, padding: 20 },
  };

  const mockColors = {
    error: '#FF0000',
  };

  const mockTokens = {
    Space: {
      sm: 8,
      md: 16,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    (useMaster as jest.Mock).mockReturnValue(mockMaster);
    (useAppStyles as jest.Mock).mockReturnValue({
      styles: mockStyles,
      colors: mockColors,
      Tokens: mockTokens,
    });
    (pickAndReadCsvFile as jest.Mock).mockResolvedValue({
      text: 'date,amount,description\n2024-01-01,42.50,Test',
      fileName: 'test.csv',
      detectedBank: 'ING',
    });
  });

  it('should render CsvUploadScreen with correct props', () => {
    const { getByTestId } = render(<CsvUploadContainer />);

    expect(getByTestId('mock-csv-upload-screen')).toBeTruthy();
    expect(useMaster).toHaveBeenCalled();
    expect(useAppStyles).toHaveBeenCalled();
  });

  it('should handle successful file pick and import', async () => {
    const { getByTestId, queryByTestId } = render(<CsvUploadContainer />);

    // Simuleer knop druk
    fireEvent.press(getByTestId('pick-file-button'));

    // Check loading state
    expect(getByTestId('uploading-indicator')).toBeTruthy();

    await waitFor(() => {
      expect(pickAndReadCsvFile).toHaveBeenCalledTimes(1);
    });

    expect(mockHandleCsvImport).toHaveBeenCalledWith({
      csvText: 'date,amount,description\n2024-01-01,42.50,Test',
      fileName: 'test.csv',
      bank: 'ING',
    });

    expect(mockNavigateToCsvAnalysis).toHaveBeenCalledTimes(1);

    // Loading state zou weg moeten zijn
    expect(queryByTestId('uploading-indicator')).toBeNull();
    expect(queryByTestId('error-banner')).toBeNull();
  });

  it('should handle errors during file pick', async () => {
    const errorMessage = 'File picker failed';
    (pickAndReadCsvFile as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    const { getByTestId, getByText } = render(<CsvUploadContainer />);

    fireEvent.press(getByTestId('pick-file-button'));

    await waitFor(() => {
      expect(getByText(errorMessage)).toBeTruthy();
    });
  });

  it('should handle errors during CSV import', async () => {
    const errorMessage = 'Import failed';
    mockHandleCsvImport.mockRejectedValueOnce(new Error(errorMessage));

    const { getByTestId, getByText } = render(<CsvUploadContainer />);

    fireEvent.press(getByTestId('pick-file-button'));

    await waitFor(() => {
      expect(getByText(errorMessage)).toBeTruthy();
    });
  });

  it('should ignore annulering errors', async () => {
    (pickAndReadCsvFile as jest.Mock).mockRejectedValueOnce(new Error(ANNULERING_MESSAGE));

    const { getByTestId, queryByText } = render(<CsvUploadContainer />);

    fireEvent.press(getByTestId('pick-file-button'));

    // Wacht even om te zien of error banner verschijnt
    await waitFor(() => {
      expect(queryByText(ANNULERING_MESSAGE)).toBeNull();
    });
  });

  it('should clear error when starting new upload', async () => {
    // Eerste keer: error
    (pickAndReadCsvFile as jest.Mock).mockRejectedValueOnce(new Error('First error'));

    const { getByTestId, getByText, queryByText } = render(<CsvUploadContainer />);

    // Eerste poging met error
    fireEvent.press(getByTestId('pick-file-button'));
    await waitFor(() => {
      expect(getByText('First error')).toBeTruthy();
    });

    // Tweede poging zonder error
    (pickAndReadCsvFile as jest.Mock).mockResolvedValueOnce({
      text: 'test',
      fileName: 'test.csv',
      detectedBank: 'ING',
    });

    fireEvent.press(getByTestId('pick-file-button'));

    await waitFor(() => {
      expect(queryByText('First error')).toBeNull();
    });
  });

  it('should handle non-Error objects in error handler', async () => {
    (pickAndReadCsvFile as jest.Mock).mockRejectedValueOnce('String error');

    const { getByTestId, getByText } = render(<CsvUploadContainer />);

    fireEvent.press(getByTestId('pick-file-button'));

    await waitFor(() => {
      expect(getByText('Onbekende fout bij importeren')).toBeTruthy();
    });
  });

  describe('ErrorBanner', () => {
    it('should render error banner with correct styling when error state is set', async () => {
      // Simuleer een error tijdens import
      (pickAndReadCsvFile as jest.Mock).mockRejectedValueOnce(new Error('Test error'));
      
      const { getByTestId, getByText } = render(<CsvUploadContainer />);
      
      fireEvent.press(getByTestId('pick-file-button'));
      
      await waitFor(() => {
        expect(getByText('Test error')).toBeTruthy();
        
        // Check dat de banner de juiste styling heeft
        const banner = getByTestId('error-banner');
        expect(banner).toBeTruthy();
        expect(banner.props.style).toMatchObject({
          marginHorizontal: mockTokens.Space.md,
          marginTop: mockTokens.Space.sm,
          padding: mockTokens.Space.md,
          borderRadius: 8,
        });
      });
    });

    it('should not render error banner when error is null', () => {
      const { queryByTestId } = render(<CsvUploadContainer />);
      expect(queryByTestId('error-banner')).toBeNull();
    });
  });

  describe('component structure', () => {
    it('should render container with correct styles', () => {
      const { getByTestId } = render(<CsvUploadContainer />);
      
      const container = getByTestId('csv-upload-container');
      expect(container).toBeTruthy();
      expect(container.props.style).toEqual(mockStyles.screenContainer);
    });
  });
});