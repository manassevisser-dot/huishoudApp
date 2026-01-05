import React from 'react';
import { 
  screen, 
  cleanup, 
  fireEvent, 
  waitFor, 
  
} from '@testing-library/react-native';
import { render } from '@test-utils/index'; // Gebruik je nieuwe render met providers
import { UndoScreen } from '../UndoScreen';
import { TransactionService } from '@services/transactionService';

/**
 * Helper om robuust tekst te vinden, zelfs als React Native deze opsplitst
 * in de Virtual DOM (zoals bij "Boodschappen: € 12.5")
 */
async function waitForTextContaining(
  searchText: string,
  options?: { timeout?: number }
): Promise<void> {
  await waitFor(() => {
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

    // ✅ FIX: Verwijder de handmatige 'await act' om de render heen
    render(<UndoScreen initialData={{ id: "test-123", amount: 1500, currency: "EUR", description: "Boodschappen", date: "2026-01-05" }} />);

    // Wacht tot de data zichtbaar is via de robuuste helper
    await waitForTextContaining('Boodschappen');
    await waitForTextContaining('Tanken');

    // Snapshot is nu veilig omdat de UI 'settled' is
    expect(screen.toJSON()).toMatchSnapshot();
  });

  it('moet omgaan met undefined data van de service', async () => {
    mockedTx.getAllTransactions.mockResolvedValueOnce(undefined as any);
  
    // ✅ FIX: Direct renderen zonder act()
    render(<UndoScreen initialData={{ id: "test-123", amount: 1500, currency: "EUR", description: "Boodschappen", date: "2026-01-05" }} />);
  
    // Gebruik de regex fix voor flexibele witruimte
    const counter = await screen.findByText(/Laatste transacties:\s*0/i);
    expect(counter).toBeTruthy();
    expect(screen.getByText(/Geen recente transacties/i)).toBeTruthy();
  });

  it('moet alle transacties verwijderen als op de knop wordt gedrukt', async () => {
    const mockData = [{ id: '1', description: 'Boodschappen', amount: 10 }];
    mockedTx.getAllTransactions.mockResolvedValueOnce(mockData);
    mockedTx.clearAll.mockResolvedValueOnce(undefined);

    // ✅ FIX: Direct renderen
    render(<UndoScreen initialData={{ id: "test-123", amount: 1500, currency: "EUR", description: "Boodschappen", date: "2026-01-05" }} />);

    // Wacht tot de initiele data is geladen
    await screen.findByText(/Boodschappen/i);

    // Actie: Verwijderen. fireEvent triggert intern de nodige act() calls.
    fireEvent.press(screen.getByRole('button', { name: /Verwijder Alles/i }));

    // Wacht tot de service is aangeroepen EN de UI is bijgewerkt naar 0
    await waitFor(() => {
      expect(mockedTx.clearAll).toHaveBeenCalled();
      expect(screen.getByText(/Laatste transacties:\s*0/i)).toBeTruthy();
    });

    // Controleer of de oude data echt weg is
    expect(screen.queryByText(/Boodschappen/i)).toBeNull();
  });
});