// src/app/orchestrators/factory/TransactionHistoryVMFactory.test.ts
import { TransactionHistoryVMFactory, TransactionItemVM } from './TransactionHistoryVMFactory';
import type { TransactionHistory, TransactionRecord } from '@core/types/core';

// Mock WizStrings
jest.mock('@config/WizStrings', () => ({
  undo: {
    screenTitle: 'Transactiegeschiedenis',
    listTitle: 'Recente transacties',
    emptyTitle: 'Geen transacties',
    emptyMessage: 'Sla een dagelijkse transactie op om de geschiedenis te zien.',
    undoAction: 'Ongedaan maken',
    redoAction: 'Opnieuw uitvoeren',
    clearAllAction: 'Alles wissen',
  },
}));

describe('TransactionHistoryVMFactory', () => {
  const mockTransaction: TransactionRecord = {
    id: 'tx1',
    date: '2024-01-15',
    description: 'Test transactie',
    amountCents: 12345,
    currency: 'EUR',
    category: 'Boodschappen',
    paymentMethod: 'Pin',
  };

  const mockTransaction2: TransactionRecord = {
    id: 'tx2',
    date: '2024-01-14',
    description: 'Salaris',
    amountCents: 250000,
    currency: 'EUR',
    category: 'Inkomen',
    paymentMethod: 'Overschrijving',
  };

  const mockHistory: TransactionHistory = {
    past: [mockTransaction2],
    present: mockTransaction,
    future: [],
  };

  describe('build with empty history', () => {
    it('should return empty VM when history is undefined', () => {
      const result = TransactionHistoryVMFactory.build(undefined);

      expect(result.isEmpty).toBe(true);
      expect(result.emptyTitle).toBe('Geen transacties');
      expect(result.emptyMessage).toBe('Sla een dagelijkse transactie op om de geschiedenis te zien.');
      expect(result.title).toBe('Transactiegeschiedenis');
      expect(result.present).toBeNull();
      expect(result.pastItems).toEqual([]);
      expect(result.canUndo).toBe(false);
      expect(result.canRedo).toBe(false);
    });

    it('should return empty VM when history has no present and empty past', () => {
      const emptyHistory: TransactionHistory = {
        past: [],
        present: null,
        future: [],
      };

      const result = TransactionHistoryVMFactory.build(emptyHistory);

      expect(result.isEmpty).toBe(true);
      expect(result.present).toBeNull();
      expect(result.pastItems).toEqual([]);
    });

    it('should return non-empty VM when present exists', () => {
      const historyWithPresent: TransactionHistory = {
        past: [],
        present: mockTransaction,
        future: [],
      };

      const result = TransactionHistoryVMFactory.build(historyWithPresent);

      expect(result.isEmpty).toBe(false);
      expect(result.present).not.toBeNull();
      expect(result.present?.id).toBe('tx1');
      expect(result.pastItems).toEqual([]);
      expect(result.canUndo).toBe(false);
      expect(result.canRedo).toBe(false);
    });
  });

  describe('build with non-empty history', () => {
    it('should transform present transaction correctly', () => {
      const result = TransactionHistoryVMFactory.build(mockHistory);

      expect(result.isEmpty).toBe(false);
      expect(result.present).toEqual({
        id: 'tx1',
        date: '2024-01-15',
        description: 'Test transactie',
        amountDisplay: '€ 123,45',
        category: 'Boodschappen',
        paymentMethod: 'Pin',
      });
    });

    it('should transform past transactions in reverse order (newest first)', () => {
      const historyWithMultiplePast: TransactionHistory = {
        past: [mockTransaction2, mockTransaction], // oud: tx2 (14 jan), tx1 (15 jan)
        present: null,
        future: [],
      };

      const result = TransactionHistoryVMFactory.build(historyWithMultiplePast);

      expect(result.pastItems).toHaveLength(2);
      // Nieuwste eerst (tx1 is newer)
      expect(result.pastItems[0].id).toBe('tx1');
      expect(result.pastItems[0].date).toBe('2024-01-15');
      expect(result.pastItems[1].id).toBe('tx2');
      expect(result.pastItems[1].date).toBe('2024-01-14');
    });

    it('should handle null category and paymentMethod', () => {
      const transactionWithNulls: TransactionRecord = {
        id: 'tx3',
        date: '2024-01-16',
        description: 'Transactie zonder categorie',
        amountCents: 5000,
        currency: 'EUR',
        category: null,
        paymentMethod: undefined,
      };

      const history: TransactionHistory = {
        past: [],
        present: transactionWithNulls,
        future: [],
      };

      const result = TransactionHistoryVMFactory.build(history);

      expect(result.present?.category).toBe('');
      expect(result.present?.paymentMethod).toBe('');
    });

    it('should calculate canUndo/canRedo correctly', () => {
      // Met past items
      const historyWithPast: TransactionHistory = {
        past: [mockTransaction2],
        present: mockTransaction,
        future: [],
      };
      expect(TransactionHistoryVMFactory.build(historyWithPast).canUndo).toBe(true);
      expect(TransactionHistoryVMFactory.build(historyWithPast).canRedo).toBe(false);

      // Met future items
      const historyWithFuture: TransactionHistory = {
        past: [],
        present: mockTransaction,
        future: [mockTransaction2],
      };
      expect(TransactionHistoryVMFactory.build(historyWithFuture).canUndo).toBe(false);
      expect(TransactionHistoryVMFactory.build(historyWithFuture).canRedo).toBe(true);

      // Met beide
      const historyWithBoth: TransactionHistory = {
        past: [mockTransaction2],
        present: mockTransaction,
        future: [mockTransaction],
      };
      expect(TransactionHistoryVMFactory.build(historyWithBoth).canUndo).toBe(true);
      expect(TransactionHistoryVMFactory.build(historyWithBoth).canRedo).toBe(true);
    });
  });

  describe('formatCentsToEuro', () => {
    it('should format positive amounts correctly', () => {
      const result = TransactionHistoryVMFactory.build({
        past: [],
        present: { ...mockTransaction, amountCents: 1234 },
        future: [],
      });

      expect(result.present?.amountDisplay).toBe('€ 12,34');
    });

    it('should format negative amounts correctly', () => {
      const result = TransactionHistoryVMFactory.build({
        past: [],
        present: { ...mockTransaction, amountCents: -1234 },
        future: [],
      });

      expect(result.present?.amountDisplay).toBe('€ -12,34');
    });

    it('should format zero correctly', () => {
      const result = TransactionHistoryVMFactory.build({
        past: [],
        present: { ...mockTransaction, amountCents: 0 },
        future: [],
      });

      expect(result.present?.amountDisplay).toBe('€ 0,00');
    });

    it('should format large amounts correctly', () => {
      const result = TransactionHistoryVMFactory.build({
        past: [],
        present: { ...mockTransaction, amountCents: 123456789 },
        future: [],
      });

      expect(result.present?.amountDisplay).toBe('€ 1.234.567,89');
    });
  });

  describe('toItemVM', () => {
    it('should transform all fields correctly', () => {
      // Indirect getest via build, maar we kunnen het direct testen
      const record: TransactionRecord = {
        id: 'test-id',
        date: '2024-02-20',
        description: 'Test beschrijving',
        amountCents: 98765,
        currency: 'EUR',
        category: 'Test Categorie',
        paymentMethod: 'Test Methode',
      };

      const result = TransactionHistoryVMFactory.build({
        past: [],
        present: record,
        future: [],
      });

      expect(result.present).toEqual({
        id: 'test-id',
        date: '2024-02-20',
        description: 'Test beschrijving',
        amountDisplay: '€ 987,65',
        category: 'Test Categorie',
        paymentMethod: 'Test Methode',
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty string values', () => {
      const record: TransactionRecord = {
        id: 'empty',
        date: '',
        description: '',
        amountCents: 0,
        currency: 'EUR',
        category: '',
        paymentMethod: '',
      };

      const result = TransactionHistoryVMFactory.build({
        past: [],
        present: record,
        future: [],
      });

      expect(result.present).toEqual({
        id: 'empty',
        date: '',
        description: '',
        amountDisplay: '€ 0,00',
        category: '',
        paymentMethod: '',
      });
    });

    it('should handle present null with past items', () => {
      const history: TransactionHistory = {
        past: [mockTransaction, mockTransaction2],
        present: null,
        future: [],
      };

      const result = TransactionHistoryVMFactory.build(history);

      expect(result.isEmpty).toBe(false);
      expect(result.present).toBeNull();
      expect(result.pastItems).toHaveLength(2);
      expect(result.canUndo).toBe(true); // past heeft items
    });

    it('should handle undefined history same as empty', () => {
      const undefinedResult = TransactionHistoryVMFactory.build(undefined);
      const nullPresentResult = TransactionHistoryVMFactory.build({
        past: [],
        present: null,
        future: [],
      });

      expect(undefinedResult).toEqual(nullPresentResult);
    });
  });

  describe('contract verification', () => {
    it('should always return a TransactionHistoryVM (never null)', () => {
      const result1 = TransactionHistoryVMFactory.build(undefined);
      const result2 = TransactionHistoryVMFactory.build({
        past: [],
        present: null,
        future: [],
      });
      const result3 = TransactionHistoryVMFactory.build(mockHistory);

      expect(result1).toBeDefined();
      expect(result2).toBeDefined();
      expect(result3).toBeDefined();
    });

    it('should be pure - same input returns same output', () => {
      const input: TransactionHistory = {
        past: [mockTransaction],
        present: mockTransaction2,
        future: [],
      };

      const result1 = TransactionHistoryVMFactory.build(input);
      const result2 = TransactionHistoryVMFactory.build(input);

      expect(result1).toEqual(result2);
      expect(result1).not.toBe(result2); // Different instances
    });

    it('should use WizStrings.undo for all text', () => {
      const result = TransactionHistoryVMFactory.build(undefined);

      expect(result.emptyTitle).toBe('Geen transacties');
      expect(result.emptyMessage).toBe('Sla een dagelijkse transactie op om de geschiedenis te zien.');
      expect(result.title).toBe('Transactiegeschiedenis');
    });
  });

  describe('type safety', () => {
    it('should maintain correct types in pastItems array', () => {
      const history: TransactionHistory = {
        past: [mockTransaction, mockTransaction2],
        present: null,
        future: [],
      };

      const result = TransactionHistoryVMFactory.build(history);

      // TypeScript zou dit moeten accepteren
      const firstItem: TransactionItemVM = result.pastItems[0];
      expect(firstItem.id).toBeDefined();
      expect(firstItem.amountDisplay).toMatch(/^€ /);
    });
  });
});