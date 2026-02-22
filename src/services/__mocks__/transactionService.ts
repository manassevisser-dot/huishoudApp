/**
 * @file_intent Mocks the TransactionService for testing purposes.
 * @repo_architecture Services Layer - Mocks. This file provides a mock implementation of the TransactionService, allowing for isolated testing of components that depend on it.
 * @term_definition
 *   - `_store`: A private in-memory array to simulate the database of transactions.
 *   - `TransactionService`: The mocked service object.
 * @contract The mocked `TransactionService` provides the same interface as the real service, but its methods are Jest mock functions (`jest.fn()`). It uses an in-memory store (`_store`) to simulate data persistence. The `_setjest.MockData` function is a test helper to populate this store.
 * @ai_instruction To use this mock, import it in your test file. You can then use `TransactionService._setjest.MockData` to set up initial data for your tests. The mock functions (`migrate`, `undo`, `clearAll`, `getAllTransactions`) can be spied on or have their implementations overridden for specific test cases.
 */
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
