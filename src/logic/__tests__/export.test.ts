import { TransactionService } from '../../services/transactionService';

describe('Export Logic', () => {
  beforeEach(() => {
    TransactionService.clearAll();
  });

  it('should correctly store and retrieve a transaction', async () => {
    const mockTx = {
      date: '2025-01-01',
      amount: 42.50,
      category: 'Boodschappen',
      paymentMethod: 'pin',
      weekNumber: 1
    };

    const result = await TransactionService._mockLocalSave(mockTx);
    const transactions = await TransactionService.getAllTransactions();

    expect(result).toBe(true);
    expect(transactions.length).toBe(1);
    expect(transactions[0].amount).toBe(42.50);
  });
});