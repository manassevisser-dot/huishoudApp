
// src/services/__mocks__/transactionService.ts
let _store: any[] = [];

export const TransactionService = {
  clearAll: jest.fn(async () => {
    _store = [];
  }),

  _mockLocalSave: jest.fn(async (data: any) => {
    _store.push(data);
    return true;
  }),

  getAllTransactions: jest.fn(async () => {
    return [..._store];
  }),

  migrate: jest.fn(async () => undefined),
  undo: jest.fn(async () => undefined),
};

// Handige resetter voor test-suites die veel doorlopen:
export function __resetTxMock() {
  _store = [];
  jest.clearAllMocks();
}
