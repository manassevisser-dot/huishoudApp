import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { CsvUploadScreen } from '../CsvUploadScreen';
import { Logger } from '@/adapters/audit/AuditLoggerAdapter';

// 1. Mock de Logger (onze verkeerstoren)
jest.mock('@/adapters/audit/AuditLoggerAdapter', () => ({
  Logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

// 2. Veilige mock voor react-native onderdelen indien nodig
// We laten react-native met rust om 'DevMenu' errors te voorkomen, 
// tenzij we expliciet iets als NativeModules moeten mocken.

describe('CsvUploadScreen Integration', () => {
  const mockOrchestrator = {
    importCsvData: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('stuurt succesvolle import door naar de Logger verkeerstoren', async () => {
    const mockResult = { transactions: [{ id: '1', amount: 10, description: 'Test' }] };
    mockOrchestrator.importCsvData.mockResolvedValueOnce(mockResult);

    const { getByPlaceholderText, getByTestId } = render(
      <CsvUploadScreen formStateOrchestrator={mockOrchestrator} />
    );

    const input = getByPlaceholderText('Plak CSV-gegevens hier...');
    const button = getByTestId('Verwerk CSV');

    fireEvent.changeText(input, 'datum,bedrag,omschrijving\n2023-01-01,10,Test');
    fireEvent.press(button);

    await waitFor(() => {
      // Check of de orchestrator is aangeroepen
      expect(mockOrchestrator.importCsvData).toHaveBeenCalled();
      
      // Check of de Logger de UI-instructies heeft ontvangen
      expect(Logger.info).toHaveBeenCalledWith(
        'CSV_IMPORT_SUCCESS',
        expect.objectContaining({
          uiTitle: 'Bevestig Upload',
          count: 1
        })
      );
    });
  });

  it('logt een waarschuwing bij een lege import', async () => {
    mockOrchestrator.importCsvData.mockResolvedValueOnce({ transactions: [] });

    const { getByPlaceholderText, getByTestId } = render(
      <CsvUploadScreen formStateOrchestrator={mockOrchestrator} />
    );

    fireEvent.changeText(getByPlaceholderText('Plak CSV-gegevens hier...'), 'leeg');
    fireEvent.press(getByTestId('Verwerk CSV'));

    await waitFor(() => {
      expect(Logger.warn).toHaveBeenCalledWith(
        'CSV_IMPORT_EMPTY',
        expect.objectContaining({
          uiTitle: 'Geen resultaat'
        })
      );
    });
  });

  it('logt een error bij een crash in de orchestrator', async () => {
    mockOrchestrator.importCsvData.mockRejectedValueOnce(new Error('Syntax Fout'));

    const { getByPlaceholderText, getByTestId } = render(
      <CsvUploadScreen formStateOrchestrator={mockOrchestrator} />
    );

    fireEvent.changeText(getByPlaceholderText('Plak CSV-gegevens hier...'), 'foute data');
    fireEvent.press(getByTestId('Verwerk CSV'));

    await waitFor(() => {
      expect(Logger.error).toHaveBeenCalledWith(
        'CSV_IMPORT_FAILED',
        expect.objectContaining({
          error: 'Syntax Fout'
        })
      );
    });
  });
});