// src/ui/screens/Daily/__tests__/UndoScreen.test.tsx
import React from 'react';
import { screen, cleanup, } from '@testing-library/react-native';
import { render } from '@test-utils/index';
import { UndoScreen } from '../UndoScreen';
import { createMockState } from 'src/test-utils/factories/stateFactory';
import { DATA_KEYS } from '@domain/constants/datakeys';


// Mock de hook
const mockUseTransactionHistory = jest.fn();
jest.mock('@app/hooks/useTransactionHistory', () => ({
  useTransactionHistory: () => mockUseTransactionHistory(),
}));

describe('UndoScreen Integratie Tests', () => {
  afterEach(() => {
    cleanup();
    mockUseTransactionHistory.mockReset();
  });

  it('moet transacties tonen als de hook ze levert', async () => {
    const testState = createMockState({
      data: {
        [DATA_KEYS.FINANCE]: {
          income: { items: [] },
          expenses: {
            items: [
              { id: '1', description: 'Boodschappen', amountCents: 1250 },
              { id: '2', description: 'Tanken', amountCents: 4500 },
            ],
          },
        },
      },
    });

    // Transformeer naar Transaction[]
// Gebruik geen cast — gebruik directe destructuring
const transactions = testState.data[DATA_KEYS.FINANCE].expenses.items.map(item => ({
  id: item.id as string,               // forceer type (je weet dat het er is)
  description: item.description as string,
  amount: item.amountCents as number,
  currency: 'EUR' as const,
  date: '2026-01-05',
}));

    mockUseTransactionHistory.mockReturnValue({
      transactions,
      undo: jest.fn(),
      redo: jest.fn(),
      clearAll: jest.fn(),
      updateTransaction: null,
      error: null,
      _debugAdapterState: null,
    });

    render(<UndoScreen />);

    expect(await screen.findByText(/Boodschappen/i)).toBeTruthy();
    expect(await screen.findByText(/Tanken/i)).toBeTruthy();
    expect(screen.getByText(/Laatste transacties:\s*2/i)).toBeTruthy();
    expect(screen.toJSON()).toMatchSnapshot();
  });
});
