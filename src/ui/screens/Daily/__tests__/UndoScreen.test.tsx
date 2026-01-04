import React from 'react';
import { 
  render, 
  screen, 
  cleanup, 
  fireEvent, 
  waitFor 
} from '@testing-library/react-native';
import { UndoScreen } from '../UndoScreen';
import { TransactionService } from '@services/transactionService';

// De helper die je eerder hebt aangemaakt 
async function waitForTextContaining(
  searchText: string,
  options?: { timeout?: number }
): Promise<void> {
  await waitFor(() => {
    // We gebruiken de interne tree van screen om tekst te extraheren
    const allTexts = screen.toJSON();
    const stringified = JSON.stringify(allTexts);
    expect(stringified).toContain(searchText);
  }, options);
}

// 1. Mock de service
jest.mock('@services/transactionService', () => ({
  TransactionService: {
    getAllTransactions: jest.fn(),
    clearAll: jest.fn(),
  },
}));

const mockedTx = TransactionService as jest.Mocked<typeof TransactionService>;

describe('UndoScreen Integratie Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(cleanup);

  it('moet transacties laden en de omschrijvingen tonen (met snapshot)', async () => {
    const mockData = [
      { id: '1', amount: 12.5, description: 'Boodschappen' },
      { id: '2', amount: 45.0, description: 'Tanken' },
    ];
    mockedTx.getAllTransactions.mockResolvedValueOnce(mockData);

    const { toJSON } = render(<UndoScreen />);

    // Wacht tot de tekst verschijnt met de robuuste helper [cite: 56, 60]
    await waitForTextContaining('Boodschappen');
    await waitForTextContaining('Tanken');

    // Snapshot pas maken als de UI 'settled' is [cite: 64, 84]
    expect(toJSON()).toMatchSnapshot();
  });

  it('moet omgaan met undefined data van de service', async () => {
    mockedTx.getAllTransactions.mockResolvedValueOnce(undefined as any);
  
    render(<UndoScreen />);
  
    // Gebruik findBy om te wachten op de useEffect afhandeling [cite: 68, 77]
    const counter = await screen.findByText(/Laatste transacties:\s*0/i);
    expect(counter).toBeTruthy();
    expect(screen.getByText(/Geen recente transacties/i)).toBeTruthy();
  });

  it('moet alle transacties verwijderen als op de knop wordt gedrukt', async () => {
    const mockData = [{ id: '1', description: 'Boodschappen', amount: 10 }];
    mockedTx.getAllTransactions.mockResolvedValueOnce(mockData);
    mockedTx.clearAll.mockResolvedValueOnce(undefined);

    render(<UndoScreen />);

    // Wacht tot initieel geladen [cite: 66, 77]
    await screen.findByText(/Boodschappen/i);

    // Actie: Verwijderen [cite: 63]
    fireEvent.press(screen.getByRole('button', { name: /Verwijder Alles/i }));

    // Wacht tot de service is aangeroepen EN de UI is bijgewerkt naar 0 [cite: 63, 66]
    await waitFor(() => {
      expect(mockedTx.clearAll).toHaveBeenCalled();
      expect(screen.getByText(/Laatste transacties:\s*0/i)).toBeTruthy();
    });

    expect(screen.queryByText(/Boodschappen/i)).toBeNull();
  });
});