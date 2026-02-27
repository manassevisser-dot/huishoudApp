// src/kernel/finance/mappers.test.ts
import { mapTransactions } from './mappers';
import type { CsvItem } from '@core/types/research';

describe('finance mappers', () => {
  describe('mapTransactions', () => {
    // Helper om CsvItem objecten te maken
    const createCsvItem = (overrides: Partial<CsvItem> = {}): CsvItem => ({
      id: '1',
      date: '2024-01-15',
      description: 'Boodschappen',
      amount: -42.50,
      amountCents: -4250,
      category: 'Boodschappen',
      original: {
        rawDigest: 'abc123',
        schemaVersion: '1.0',
        importedAt: new Date().toISOString(),
        columnMapVersion: '1.0',
        flags: [],
      },
      ...overrides,
    });

    it('should return the same transactions array (identity function)', () => {
      // Arrange
      const transactions: CsvItem[] = [
        createCsvItem({ id: '1', description: 'Boodschappen', amount: -42.50 }),
        createCsvItem({ id: '2', description: 'Salaris', amount: 2500.00, amountCents: 250000 }),
      ];

      // Act
      const result = mapTransactions(transactions);

      // Assert
      expect(result).toBe(transactions); // Same reference (identity)
      expect(result).toEqual(transactions); // Same content
    });

    it('should handle empty array', () => {
      // Arrange
      const transactions: CsvItem[] = [];

      // Act
      const result = mapTransactions(transactions);

      // Assert
      expect(result).toEqual([]);
    });

    it('should handle single transaction', () => {
      // Arrange
      const transactions: CsvItem[] = [
        createCsvItem({
          id: '1',
          description: 'Test transactie',
          amount: 100.00,
          amountCents: 10000,
        }),
      ];

      // Act
      const result = mapTransactions(transactions);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0]).toBe(transactions[0]);
    });

    it('should preserve all transaction properties', () => {
      // Arrange
      const transaction = createCsvItem({
        id: '1',
        date: '2024-01-15',
        description: 'Complexe transactie',
        amount: -99.99,
        amountCents: -9999,
        category: 'Uitgaven',
      });

      const transactions = [transaction];

      // Act
      const result = mapTransactions(transactions);

      // Assert
      expect(result[0].id).toBe('1');
      expect(result[0].date).toBe('2024-01-15');
      expect(result[0].description).toBe('Complexe transactie');
      expect(result[0].amount).toBe(-99.99);
      expect(result[0].amountCents).toBe(-9999);
      expect(result[0].category).toBe('Uitgaven');
      expect(result[0].original).toBeDefined();
    });

    it('should handle transactions with optional fields', () => {
      // Arrange
      const transaction = createCsvItem();
      // Verwijder category (optioneel)
      delete (transaction as any).category;

      const transactions = [transaction];

      // Act
      const result = mapTransactions(transactions);

      // Assert
      expect(result[0].id).toBe('1');
      expect(result[0].category).toBeUndefined();
    });

    it('should be a pure function - no side effects', () => {
  // Arrange
  const transactions: CsvItem[] = [
    createCsvItem(),
  ];
  const originalCopy = JSON.parse(JSON.stringify(transactions));

  // Act
  const result = mapTransactions(transactions);

  // Assert
  expect(JSON.stringify(transactions)).toEqual(JSON.stringify(originalCopy)); // Original unchanged
  expect(result).toBe(transactions); // ✅ IDENTITY FUNCTIE: zelfde referentie
});

    it('should handle large arrays efficiently', () => {
      // Arrange
      const largeArray: CsvItem[] = Array.from({ length: 1000 }, (_, i) => 
        createCsvItem({
          id: `${i}`,
          description: `Transactie ${i}`,
          amount: i * 10,
          amountCents: i * 1000,
        })
      );

      // Act
      const start = performance.now();
      const result = mapTransactions(largeArray);
      const end = performance.now();

      // Assert
      expect(result).toHaveLength(1000);
      expect(end - start).toBeLessThan(50); // Zou snel moeten zijn (<50ms)
    });

    it('should handle transactions with negative amounts', () => {
      // Arrange
      const transactions: CsvItem[] = [
        createCsvItem({
          amount: -150.75,
          amountCents: -15075,
        }),
      ];

      // Act
      const result = mapTransactions(transactions);

      // Assert
      expect(result[0].amount).toBe(-150.75);
      expect(result[0].amountCents).toBe(-15075);
    });

    it('should handle transactions with zero amount', () => {
      // Arrange
      const transactions: CsvItem[] = [
        createCsvItem({
          amount: 0,
          amountCents: 0,
        }),
      ];

      // Act
      const result = mapTransactions(transactions);

      // Assert
      expect(result[0].amount).toBe(0);
      expect(result[0].amountCents).toBe(0);
    });
  });
});