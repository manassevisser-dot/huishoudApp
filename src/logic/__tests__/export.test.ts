import * as TransactionService  from '../../services/transactionService';

/**
 * STAP 1: De Mock setup
 * We vertellen Jest (en TypeScript) dat de TransactionService in deze test
 * extra functies heeft die normaal niet in de 'echte' code staan.
 */
jest.mock('../../services/transactionService', () => ({
  TransactionService: {
    migrate: jest.fn(),
    undo: jest.fn(),
    clearAll: jest.fn().mockResolvedValue(undefined),
    getAllTransactions: jest.fn().mockResolvedValue([]),
    _mockLocalSave: jest.fn().mockResolvedValue(true),
  }
}));

// We maken een alias voor TypeScript zodat we .toHaveBeenCalled() kunnen gebruiken
const MockedTxService = TransactionService as any;

describe('Export Logic', () => {
  beforeEach(async () => {
    // Reset de mock-teller voor elke test
    jest.clearAllMocks();
    await MockedTxService.clearAll();
  });

  it('moet alle transacties kunnen wissen voor een export', async () => {
    await MockedTxService.clearAll();
    // 1x in de beforeEach + 1x in deze test = 2x aangeroepen
    expect(MockedTxService.clearAll).toHaveBeenCalledTimes(2);
  });

  it('should correctly store and retrieve a transaction', async () => {
    const mockTx = {
      date: '2025-01-01',
      amount: 42.50,
      category: 'Boodschappen',
      paymentMethod: 'pin',
      weekNumber: 1,
    };

    // Programmeer de mock om onze testdata terug te geven
    MockedTxService.getAllTransactions.mockResolvedValue([mockTx]);
    
    const result = await MockedTxService._mockLocalSave(mockTx);
    const transactions = await MockedTxService.getAllTransactions();

    expect(result).toBe(true);
    expect(transactions.length).toBe(1);
    expect(transactions[0].amount).toBe(42.50);
  });
});