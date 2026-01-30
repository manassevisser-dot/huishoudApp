// src/services/__mocks__/transactionService.ts

let _store: any[] = [];

export const TransactionService = {
  // Zorg dat de namen exact matchen met de echte service
  migrate: jest.fn(async () => ({ success: true })),
  undo: jest.fn(async () => undefined),

  clearAll: jest.fn(async () => {
    _store = [];
  }),

  getAllTransactions: jest.fn(async () => {
    return [..._store];
  }),

  // Helper voor in je tests om data te 'faken'
  "_setjest.MockData": (data: any[]) => {
    _store = data;
  },
};
