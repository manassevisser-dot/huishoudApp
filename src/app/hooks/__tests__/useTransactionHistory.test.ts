import { renderHook } from '@testing-library/react-native';
import { useTransactionHistory, Transaction } from '../useTransactionHistory';
import { act } from 'react';
/**
 * Unit Tests voor useTransactionHistory Hook
 *
 * @benefits
 * 1. Test logica geïsoleerd van UI
 * 2. Sneller dan component tests (geen rendering)
 * 3. Betere error messages (direct van de hook)
 * 4. Makkelijker edge cases testen
 */

describe('useTransactionHistory', () => {
  const mockTransactions: Transaction[] = [
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
      expect(result.current.error).toBeNull();
    });

    it('moet initialiseren met de meegegeven transacties', () => {
      const { result } = renderHook(() => useTransactionHistory(mockTransactions));

      expect(result.current.transactions).toHaveLength(2);
      expect(result.current.transactions[0].description).toBe('Boodschappen');
    });
  });

  describe('Defensive Programming (ADR-06)', () => {
    it('moet altijd een array retourneren, zelfs bij corrupte state', () => {
      const { result } = renderHook(() => useTransactionHistory(undefined as any));

      // Zelfs met undefined input moet de hook een lege array geven
      expect(Array.isArray(result.current.transactions)).toBe(true);
      expect(result.current.transactions).toEqual([]);
    });

    it('moet niet crashen bij null als initialData', () => {
      const { result } = renderHook(() => useTransactionHistory(null as any));

      expect(result.current.transactions).toEqual([]);
    });
  });

  describe('clearAll Action', () => {
    it('moet alle transacties verwijderen', () => {
      const { result } = renderHook(() => useTransactionHistory(mockTransactions));

      expect(result.current.transactions).toHaveLength(2);

      act(() => {
        result.current.clearAll();
      });

      expect(result.current.transactions).toHaveLength(0);
    });
  });

  describe('Error Handling (ADR-05)', () => {
    it('moet ZodError afvangen bij float input', () => {
      const { result } = renderHook(() => useTransactionHistory());

      act(() => {
        result.current.updateTransaction(100.5, 2); // Float, not allowed
      });

      expect(result.current.error).toContain('Integers only');
    });

    it('moet error state clearen bij succesvolle update', () => {
      const { result } = renderHook(() => useTransactionHistory());

      // Eerst een fout veroorzaken
      act(() => {
        result.current.updateTransaction(100.5, 2);
      });
      expect(result.current.error).toBeTruthy();

      // Dan een correcte update
      act(() => {
        result.current.updateTransaction(100, 2); // Integer, allowed
      });

      expect(result.current.error).toBeNull();
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

  describe('Debug State', () => {
    it('moet debug state exposen voor development', () => {
      const { result } = renderHook(() => useTransactionHistory(mockTransactions));

      expect(result.current._debugAdapterState).toBeDefined();
      expect(Array.isArray(result.current._debugAdapterState)).toBe(true);
    });
  });

  describe('Immutability', () => {
    it('moet de originele initialData niet muteren', () => {
      const original = [...mockTransactions];
      const { result } = renderHook(() => useTransactionHistory(mockTransactions));

      act(() => {
        result.current.clearAll();
      });

      // Original array mag niet veranderd zijn
      expect(mockTransactions).toEqual(original);
    });
  });
});
