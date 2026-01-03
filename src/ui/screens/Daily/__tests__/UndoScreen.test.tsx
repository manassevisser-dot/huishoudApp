import React from 'react';
import { render, waitFor, screen } from '@testing-library/react-native';
import { UndoScreen } from '../UndoScreen';
import { TransactionService } from '../../../../services/transactionService';

jest.mock('../../../../services/transactionService');
const mockedTxService = TransactionService as jest.Mocked<typeof TransactionService>;

describe('UndoScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('moet transacties laden en het juiste aantal weergeven', async () => {
    // Zorg dat de mock data exact matcht met wat de component verwacht
    const mockData = [
      { id: '1', amount: 100, description: 'Boodschappen' },
      { id: '2', amount: 50, description: 'Tanken' }
    ];
    mockedTxService.getAllTransactions.mockResolvedValue(mockData as any);

    render(<UndoScreen />);

    // Wacht tot de tekst met het aantal verschijnt
    // Dit bevestigt dat de asynchrone call klaar is en de state is bijgewerkt
    await waitFor(() => {
      expect(screen.getByText(/Laatste transacties: 2/i)).toBeTruthy();
    });

    // Als de beschrijvingen nog steeds niet gevonden worden, 
    // checken we of "Boodschappen" ergens in de boom voorkomt (fuzzy match)
    expect(screen.queryByText(/Boodschappen/i)).toBeTruthy();
  });

  it('moet de getAllTransactions call maken bij het openen', async () => {
    mockedTxService.getAllTransactions.mockResolvedValue([]);
    render(<UndoScreen />);
    
    await waitFor(() => {
      expect(mockedTxService.getAllTransactions).toHaveBeenCalledTimes(1);
    });
  });
});