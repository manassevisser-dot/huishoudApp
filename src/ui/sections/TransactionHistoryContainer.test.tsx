// src/ui/sections/TransactionHistoryContainer.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { TransactionHistoryContainer } from './TransactionHistoryContainer';
import { useFormState } from '@ui/providers/FormStateProvider';
import { useAppStyles } from '@ui/styles/useAppStyles';
import { TransactionHistoryVMFactory } from '@app/orchestrators/factory/TransactionHistoryVMFactory';
import type { TransactionHistoryVM } from '@app/orchestrators/factory/TransactionHistoryVMFactory';

// Mock dependencies
jest.mock('@ui/providers/FormStateProvider');
jest.mock('@ui/styles/useAppStyles');
jest.mock('@app/orchestrators/factory/TransactionHistoryVMFactory');

// Mock Swipeable: rendert zowel children als renderRightActions zodat
// DeleteAction (met testID) zichtbaar is in de test-tree.
jest.mock('react-native-gesture-handler', () => ({
  Swipeable: jest.fn(({ children, renderRightActions }) => (
    <>
      {children}
      {renderRightActions?.()}
    </>
  )),
}));

describe('TransactionHistoryContainer', () => {
  // Mock data
  const mockHistory = {
    past: [
      { id: '1', date: '2024-01-01', description: 'Transaction 1', amountDisplay: '€ 10,00', category: 'Food', paymentMethod: 'Cash' },
      { id: '2', date: '2024-01-02', description: 'Transaction 2', amountDisplay: '€ 20,00', category: 'Transport', paymentMethod: 'Card' },
    ],
    present: { id: '3', date: '2024-01-03', description: 'Transaction 3', amountDisplay: '€ 30,00', category: 'Shopping', paymentMethod: 'Pin' },
    future: [],
  };

  const mockEmptyVM: TransactionHistoryVM = {
    isEmpty: true,
    emptyTitle: 'Geen transacties',
    emptyMessage: 'Sla een transactie op om de geschiedenis te zien',
    title: '',
    present: null,
    pastItems: [],
    canUndo: false,
    canRedo: false,
  };

  const mockFilledVM: TransactionHistoryVM = {
    isEmpty: false,
    emptyTitle: '',
    emptyMessage: '',
    title: 'Transactiegeschiedenis',
    present: mockHistory.present,
    pastItems: mockHistory.past,
    canUndo: true,
    canRedo: false,
  };

  const mockStyles = {
    summaryDetail: { padding: 16 },
    screenTitle: { fontSize: 20, fontWeight: 'bold' },
    summaryLabel: { fontSize: 14, color: '#666' },
    description: { fontSize: 16 },
    details: { fontSize: 12, color: '#999' },
    button: { padding: 10 },
    deleteButton: { backgroundColor: 'red' },
    buttonText: { color: 'white' },
  };

  const mockDispatch = jest.fn();
  const mockState = {
    data: {
      transactionHistory: mockHistory,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    (useFormState as jest.Mock).mockReturnValue({
      state: mockState,
      dispatch: mockDispatch,
    });

    (useAppStyles as jest.Mock).mockReturnValue({
      styles: mockStyles,
    });

    (TransactionHistoryVMFactory.build as jest.Mock).mockReturnValue(mockFilledVM);
  });

  describe('rendering', () => {
    it('should render empty state when VM isEmpty is true', () => {
      (TransactionHistoryVMFactory.build as jest.Mock).mockReturnValueOnce(mockEmptyVM);

      const { getByText } = render(<TransactionHistoryContainer />);

      expect(getByText('Geen transacties')).toBeTruthy();
      expect(getByText('Sla een transactie op om de geschiedenis te zien')).toBeTruthy();
    });

    it('should render filled state with all transactions', () => {
      const { getByText } = render(<TransactionHistoryContainer />);

      expect(getByText('Transactiegeschiedenis')).toBeTruthy();
      expect(getByText('Transaction 3')).toBeTruthy(); // present
      expect(getByText('Transaction 1')).toBeTruthy(); // past
      expect(getByText('Transaction 2')).toBeTruthy(); // past
      
      // Check formatted details
      expect(getByText(/€ 30,00 · 2024-01-03 · Shopping/)).toBeTruthy();
      expect(getByText(/€ 10,00 · 2024-01-01 · Food/)).toBeTruthy();
      expect(getByText(/€ 20,00 · 2024-01-02 · Transport/)).toBeTruthy();
    });

    it('should handle transaction without category', () => {
      const vmWithoutCategory = {
        ...mockFilledVM,
        present: { ...mockHistory.present, category: '' },
        pastItems: [{ ...mockHistory.past[0], category: '' }],
      };
      (TransactionHistoryVMFactory.build as jest.Mock).mockReturnValueOnce(vmWithoutCategory);

      const { getByText } = render(<TransactionHistoryContainer />);

      expect(getByText(/€ 30,00 · 2024-01-03/)).toBeTruthy(); // geen category
      expect(getByText(/€ 10,00 · 2024-01-01/)).toBeTruthy(); // geen category
    });
  });

  describe('delete functionality', () => {
    it('should not dispatch when history is undefined', () => {
      (useFormState as jest.Mock).mockReturnValueOnce({
        state: { data: {} },
        dispatch: mockDispatch,
      });

      render(<TransactionHistoryContainer />);
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('should dispatch UPDATE_DATA with correct payload when deleting a past item', () => {
      // Arrange
      const mockDispatch = jest.fn();
      (useFormState as jest.Mock).mockReturnValue({
        state: {
          data: {
            transactionHistory: {
              past: [{ id: '1', description: 'Past item' }],
              present: { id: '2', description: 'Present item', amountDisplay: '€ 10', date: '2024-01-01' }, 
              future: [],
            },
          },
        },
        dispatch: mockDispatch,
      });

      (TransactionHistoryVMFactory.build as jest.Mock).mockReturnValue({
        isEmpty: false,
        title: 'History',
        present: { id: '2', description: 'Present item', amountDisplay: '€ 10', date: '2024-01-01' },
        pastItems: [{ id: '1', description: 'Past item', amountDisplay: '€ 5', date: '2024-01-02' }],
      });

      const { getByTestId } = render(<TransactionHistoryContainer />);
      
      // Verwijder past item met id '1'
      fireEvent.press(getByTestId('delete-1'));

      // Assert
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'UPDATE_DATA',
        payload: {
          transactionHistory: expect.objectContaining({
            past: [], // Item '1' is verwijderd
            present: expect.objectContaining({ id: '2' }), // Present blijft
            future: [],
          }),
        },
      });
    });

    it('should promote last past item when deleting present item', () => {
      // Arrange
      const mockDispatch = jest.fn();
      (useFormState as jest.Mock).mockReturnValue({
        state: {
          data: {
            transactionHistory: {
              past: [
                { id: '1', description: 'Past item 1' }, 
                { id: '2', description: 'Past item 2' }
              ],
              present: { id: '3', description: 'Present item' },
              future: [],
            },
          },
        },
        dispatch: mockDispatch,
      });

      (TransactionHistoryVMFactory.build as jest.Mock).mockReturnValue({
        isEmpty: false,
        title: 'History',
        present: { id: '3', description: 'Present item', amountDisplay: '€ 10', date: '2024-01-01' },
        pastItems: [
          { id: '1', description: 'Past item 1', amountDisplay: '€ 5', date: '2024-01-02' },
          { id: '2', description: 'Past item 2', amountDisplay: '€ 8', date: '2024-01-03' },
        ],
      });

      const { getByTestId } = render(<TransactionHistoryContainer />);
      
      // Verwijder present item met id '3'
      fireEvent.press(getByTestId('delete-3'));

      // Assert
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'UPDATE_DATA',
        payload: {
          transactionHistory: expect.objectContaining({
            past: [{ id: '1', description: 'Past item 1' }], // Item '2' is gepromoveerd
            present: expect.objectContaining({ id: '2' }), // Nieuwe present
            future: [],
          }),
        },
      });
    });
  });
});