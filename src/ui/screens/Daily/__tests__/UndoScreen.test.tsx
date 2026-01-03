
import React from 'react';
import {
  render,
  screen,
  cleanup,
  fireEvent,
  waitFor,
  waitForElementToBeRemoved,
} from '@testing-library/react-native';
import { UndoScreen } from '../UndoScreen';

// ✅ Mock via ALIAS (komt overeen met de import in UndoScreen)
jest.mock('@services/transactionService', () => ({
  TransactionService: {
    getAllTransactions: jest.fn(),
    clearAll: jest.fn(),
  },
}));

import { TransactionService } from '@services/transactionService';
const mockedTx = TransactionService as jest.Mocked<typeof TransactionService>;

// (Optioneel) verhoog suite-timeout iets als je vaker coverage draait:
// jest.setTimeout(15000);

describe('UndoScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(cleanup);

  it(
    'moet transacties laden en de omschrijvingen tonen (met snapshot)',
    async () => {
      const mockData = [
        { id: '1', amount: 12.5, description: 'Boodschappen' },
        { id: '2', amount: 45.0, description: 'Tanken' },
      ];
      mockedTx.getAllTransactions.mockResolvedValueOnce(mockData);

      const { toJSON } = render(<UndoScreen />);

      // ✅ Één waitFor-blok met hogere timeout: voorkomt 5s overschrijding bij coverage
      await waitFor(
        () => {
          expect(screen.getByText(/Boodschappen/i)).toBeTruthy();
          expect(screen.getByText(/Tanken/i)).toBeTruthy();
          expect(screen.getByText(/Laatste transacties:\s*2/i)).toBeTruthy();
        },
        { timeout: 12000 }
      );

      // ✨ Snapshot van de gevulde staat
      expect(toJSON()).toMatchSnapshot();
    },
    15000 // <-- per-test timeout (robust bij coverage)
  );

  it('moet de lege staat tekst tonen (met snapshot)', async () => {
    mockedTx.getAllTransactions.mockResolvedValueOnce([]);

    const { toJSON } = render(<UndoScreen />);

    expect(await screen.findByText(/Geen recente transacties/i)).toBeTruthy();
    expect(screen.getByText(/Laatste transacties:\s*0/i)).toBeTruthy();

    // ✨ Snapshot van lege staat
    expect(toJSON()).toMatchSnapshot();
  });

  it('moet alle transacties verwijderen als op de knop wordt gedrukt (en snapshot na clear)', async () => {
    // 1) Initieel zijn er items
    const mockData = [{ id: '1', description: 'Boodschappen' }];
    mockedTx.getAllTransactions.mockResolvedValueOnce(mockData);
    mockedTx.clearAll.mockResolvedValueOnce(undefined);

    const { toJSON } = render(<UndoScreen />);

    // 2) Wacht tot het item zichtbaar is
    const itemNode = await screen.findByText(/Boodschappen/i);
    expect(itemNode).toBeTruthy();

    // 3) Druk op de knop
    fireEvent.press(screen.getByText(/Verwijder alles/i));

    // 4) Service is aangeroepen
    await waitFor(() => expect(mockedTx.clearAll).toHaveBeenCalled());

    // 5) Wacht totdat *hetzelfde element* verdwijnt (callback + guard)
    const stillThere = screen.queryByText(/Boodschappen/i);
    if (stillThere) {
      await waitForElementToBeRemoved(() => screen.queryByText(/Boodschappen/i), {
        timeout: 3000,
      });
    }

    // 6) Assert teller 0 en snapshot
    expect(await screen.findByText(/Laatste transacties:\s*0/i)).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });
});
