import React from 'react';
import { screen, cleanup } from '@testing-library/react-native';
import { render } from '@test-utils/index';
import { UndoScreen } from '../UndoScreen';
import { createMockState } from 'src/test-utils/factories/stateFactory';

// ADR-01 Handhaving: Geen runtime imports van @domain in de UI-laag
// DATA_KEYS verwijderd om directe domein-afhankelijkheid in tests te verbreken.

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
        // DATA_KEYS.FINANCE vervangen door string literal 'finance'
        finance: {
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

    // Manuele mapping om casting naar domein-types te vermijden
    const financeData = testState.data['finance' as keyof typeof testState.data] as any;
    const transactions = financeData.expenses.items.map((item: any) => ({
      id: item.id as string,
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