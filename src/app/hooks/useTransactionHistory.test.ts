import { renderHook } from '@testing-library/react-native';
import { useTransactionHistory } from './useTransactionHistory';
import { act } from 'react';

// Lokaal gedefinieerd voor type-safety in tests (hook exporteert dit niet)
interface TransactionRecord {
  id: string;
  amount: number;
  currency: string;
  description: string;
  date: string;
  [key: string]: unknown;
}

// Hulpfunctie voor type-safe toegang tot transactie-eigenschappen
const getTransactionProp = (tx: unknown, prop: string): unknown => {
  return (tx as Record<string, unknown>)[prop];
};

describe('useTransactionHistory', () => {
  const mockTransactions: TransactionRecord[] = [
    {
      id: '1',
      amount: 1500,
      currency: 'EUR',
      description: 'Boodschappen',
      date: '2026-01-05',
    },
    {
      id: '2',
      amount: 4500,
      currency: 'EUR',
      description: 'Tanken',
      date: '2026-01-10',
    },
  ];

  describe('Initialization', () => {
    it('moet initialiseren met lege transacties als geen data wordt meegegeven', () => {
      const { result } = renderHook(() => useTransactionHistory());
      expect(result.current.transactions).toEqual([]);
      expect(result.current.hasError).toBe(false); // Gebruik hasError i.p.v. error
    });

    it('moet initialiseren met de meegegeven transacties', () => {
      const { result } = renderHook(() => useTransactionHistory(mockTransactions));
      expect(result.current.transactions).toHaveLength(2);
      // Type-safe toegang via hulpfunctie
      expect(getTransactionProp(result.current.transactions[0], 'description')).toBe('Boodschappen');
    });
  });

  describe('Defensive Programming (ADR-06)', () => {
    it('moet altijd een array retourneren, zelfs bij corrupte state', () => {
      
      const { result } = renderHook(() => useTransactionHistory(undefined));
      expect(Array.isArray(result.current.transactions)).toBe(true);
      expect(result.current.transactions).toEqual([]);
    });

    it('moet niet crashen bij null als initialData', () => {
      // @ts-expect-error - Test gedrag bij invalid input
      const { result } = renderHook(() => useTransactionHistory(null));
      expect(result.current.transactions).toEqual([]);
    });
  });

  describe('Error Handling (ADR-05)', () => {
    it('moet validatie-fouten signaleren via hasError bij float input', () => {
      const { result } = renderHook(() => useTransactionHistory());
      act(() => {
        result.current.updateTransaction(100.5, 2); // Float niet toegestaan
      });
      expect(result.current.hasError).toBe(true); // Alleen boolean check mogelijk
    });

    it('moet hasError resetten bij succesvolle update', () => {
      const { result } = renderHook(() => useTransactionHistory());

      // Fout veroorzaken
      act(() => {
        result.current.updateTransaction(100.5, 2);
      });
      expect(result.current.hasError).toBe(true);

      // Correcte update
      act(() => {
        result.current.updateTransaction(100, 2); // Integer toegestaan
      });
      expect(result.current.hasError).toBe(false);
    });
  });

  describe('Undo/Redo', () => {
    it('moet undo aanroepen zonder te crashen', () => {
      const { result } = renderHook(() => useTransactionHistory(mockTransactions));
      expect(() => {
        act(() => {
          result.current.undo();
        });
      }).not.toThrow();
    });

    it('moet redo aanroepen zonder te crashen', () => {
      const { result } = renderHook(() => useTransactionHistory(mockTransactions));
      expect(() => {
        act(() => {
          result.current.redo();
        });
      }).not.toThrow();
    });
  });

  describe('Immutability', () => {
    it('moet de originele initialData niet muteren', () => {
      const original = JSON.parse(JSON.stringify(mockTransactions)); // Deep copy voor zekerheid
      renderHook(() => useTransactionHistory(mockTransactions));
      // Geen acties die state wijzigen (clearAll bestaat niet), dus directe vergelijking
      expect(mockTransactions).toEqual(original);
    });
  });
});