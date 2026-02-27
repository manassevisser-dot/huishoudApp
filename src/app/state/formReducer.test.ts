// src/app/state/formReducer.test.ts
import { formReducer, FormAction } from './formReducer';
import { initialFormState } from './initialFormState';
import type { FormState, TransactionRecord } from '@core/types/core';
import { DATA_KEYS } from '@domain/constants/datakeys';
describe('formReducer', () => {
  let state: FormState;

  beforeEach(() => {
    state = JSON.parse(JSON.stringify(initialFormState)); // Diepe copy
  });

  describe('UPDATE_DATA', () => {
    it('should merge data payload into state', () => {
      const action: FormAction = {
        type: 'UPDATE_DATA',
        payload: {
          [DATA_KEYS.SETUP]: {
            aantalMensen: 5,
          },
        },
      };

      const newState = formReducer(state, action);

      expect(newState.data[DATA_KEYS.SETUP].aantalMensen).toBe(5);
      expect(newState.data[DATA_KEYS.SETUP].aantalVolwassen).toBe(1); // ongewijzigd
      expect(newState.meta.lastModified).not.toBe(state.meta.lastModified);
    });

    it('should handle nested updates', () => {
      const action: FormAction = {
        type: 'UPDATE_DATA',
        payload: {
          [DATA_KEYS.FINANCE]: {
            income: {
              items: [{ id: '1', amount: 1000 }],
            },
          },
        },
      };

      const newState = formReducer(state, action);

      expect(newState.data[DATA_KEYS.FINANCE].income.items).toHaveLength(1);
      expect(newState.data[DATA_KEYS.FINANCE].expenses.items).toHaveLength(0); // ongewijzigd
    });
  });

  describe('UPDATE_VIEWMODEL', () => {
    it('should merge viewModels payload', () => {
      const action: FormAction = {
        type: 'UPDATE_VIEWMODEL',
        payload: {
          financialSummary: {
            totalIncomeDisplay: '€ 1.000',
            totalExpensesDisplay: '€ 500',
            netDisplay: '€ 500',
          },
        },
      };

      const newState = formReducer(state, action);

      expect(newState.viewModels?.financialSummary).toBeDefined();
      expect(newState.viewModels?.financialSummary?.totalIncomeDisplay).toBe('€ 1.000');
    });

    it('should handle undefined existing viewModels', () => {
      state.viewModels = undefined;
      
      const action: FormAction = {
        type: 'UPDATE_VIEWMODEL',
        payload: { financialSummary: { totalIncomeDisplay: 'test', totalExpensesDisplay: 'test', netDisplay: 'test' } },
      };

      const newState = formReducer(state, action);
      expect(newState.viewModels).toEqual({ 
  financialSummary: { 
    totalIncomeDisplay: 'test', 
    totalExpensesDisplay: 'test', 
    netDisplay: 'test' 
  } 
});
    });
  });

  describe('UPDATE_CSV_IMPORT', () => {
    it('should update csvImport state', () => {
      const csvPayload = {
        transactions: [],
        importedAt: new Date().toISOString(),
        period: { from: '2024-01-01', to: '2024-01-31' },
        status: 'parsed' as const,
        sourceBank: 'ING',
        fileName: 'test.csv',
        transactionCount: 10,
      };

      const action: FormAction = {
        type: 'UPDATE_CSV_IMPORT',
        payload: csvPayload,
      };

      const newState = formReducer(state, action);

      expect(newState.data.csvImport).toEqual(csvPayload);
    });
  });

  describe('SET_STEP', () => {
    it('should update activeStep', () => {
      const action: FormAction = {
        type: 'SET_STEP',
        payload: 'DASHBOARD',
      };

      const newState = formReducer(state, action);
      expect(newState.activeStep).toBe('DASHBOARD');
    });
  });

  describe('SET_CURRENT_SCREEN_ID', () => {
    it('should update currentScreenId', () => {
      const action: FormAction = {
        type: 'SET_CURRENT_SCREEN_ID',
        payload: 'dashboard',
      };

      const newState = formReducer(state, action);
      expect(newState.currentScreenId).toBe('dashboard');
    });
  });

  describe('PUSH_TRANSACTION', () => {
    const transaction: TransactionRecord = {
      id: '1',
      date: '2024-01-15',
      description: 'Test',
      amountCents: 4250,
      currency: 'EUR',
      category: 'Boodschappen',
      paymentMethod: 'pin',
    };

    it('should push first transaction', () => {
      const action: FormAction = {
        type: 'PUSH_TRANSACTION',
        payload: transaction,
      };

      const newState = formReducer(state, action);

      expect(newState.data.transactionHistory?.past).toEqual([]);
      expect(newState.data.transactionHistory?.present).toEqual(transaction);
      expect(newState.data.transactionHistory?.future).toEqual([]);
    });

    it('should move current present to past when pushing new transaction', () => {
      // Eerste transactie
      state = formReducer(state, { type: 'PUSH_TRANSACTION', payload: transaction });

      // Tweede transactie
      const transaction2: TransactionRecord = {
        ...transaction,
        id: '2',
        description: 'Test 2',
      };

      const newState = formReducer(state, { type: 'PUSH_TRANSACTION', payload: transaction2 });

      expect(newState.data.transactionHistory?.past).toHaveLength(1);
      expect(newState.data.transactionHistory?.past[0]).toEqual(transaction);
      expect(newState.data.transactionHistory?.present).toEqual(transaction2);
    });

    it('should handle undefined history', () => {
      state.data.transactionHistory = undefined;
      
      const newState = formReducer(state, { type: 'PUSH_TRANSACTION', payload: transaction });
      
      expect(newState.data.transactionHistory).toBeDefined();
      expect(newState.data.transactionHistory?.present).toEqual(transaction);
    });
  });

  describe('UNDO_TRANSACTION', () => {
    it('should undo to previous transaction', () => {
      // Setup: twee transacties
      const t1: TransactionRecord = { id: '1', date: '', description: '', amountCents: 100, category: '', currency: 'EUR' , paymentMethod: '' };
      const t2: TransactionRecord = { id: '2', date: '', description: '', amountCents: 200, category: '', currency: 'EUR' , paymentMethod: '' };
      
      state = formReducer(state, { type: 'PUSH_TRANSACTION', payload: t1 });
      state = formReducer(state, { type: 'PUSH_TRANSACTION', payload: t2 });

      // Undo
      const newState = formReducer(state, { type: 'UNDO_TRANSACTION' });

      expect(newState.data.transactionHistory?.present).toEqual(t1);
      expect(newState.data.transactionHistory?.past).toEqual([]);
      expect(newState.data.transactionHistory?.future).toHaveLength(1);
      expect(newState.data.transactionHistory?.future[0]).toEqual(t2);
    });

    it('should do nothing when no history', () => {
      const newState = formReducer(state, { type: 'UNDO_TRANSACTION' });
      expect(newState).toEqual(state);
    });

    it('should do nothing when past is empty', () => {
      state = formReducer(state, { type: 'PUSH_TRANSACTION', payload: { id: '1', date: '', description: '', amountCents: 100, category: '', currency: 'EUR' , paymentMethod: '' } });
      
      const newState = formReducer(state, { type: 'UNDO_TRANSACTION' });
      expect(newState).toEqual(state);
    });
  });

  describe('REDO_TRANSACTION', () => {
    it('should redo after undo', () => {
      // Setup: twee transacties en undo
      const t1: TransactionRecord = { id: '1', date: '', description: '', amountCents: 100, category: '', currency: 'EUR' , paymentMethod: '' };
      const t2: TransactionRecord = { id: '2', date: '', description: '', amountCents: 200, category: '', currency: 'EUR' , paymentMethod: '' };
      
      state = formReducer(state, { type: 'PUSH_TRANSACTION', payload: t1 });
      state = formReducer(state, { type: 'PUSH_TRANSACTION', payload: t2 });
      state = formReducer(state, { type: 'UNDO_TRANSACTION' });

      // Redo
      const newState = formReducer(state, { type: 'REDO_TRANSACTION' });

      expect(newState.data.transactionHistory?.present).toEqual(t2);
      expect(newState.data.transactionHistory?.past).toHaveLength(1);
      expect(newState.data.transactionHistory?.past[0]).toEqual(t1);
      expect(newState.data.transactionHistory?.future).toEqual([]);
    });

    it('should do nothing when future is empty', () => {
      state = formReducer(state, { type: 'PUSH_TRANSACTION', payload: { id: '1', date: '', description: '', amountCents: 100, category: '', currency: 'EUR' , paymentMethod: '' } });
      
      const newState = formReducer(state, { type: 'REDO_TRANSACTION' });
      expect(newState).toEqual(state);
    });
  });

  describe('CLEAR_TRANSACTIONS', () => {
    it('should clear all transactions', () => {
      // Setup: voeg transacties toe
      state = formReducer(state, { type: 'PUSH_TRANSACTION', payload: { id: '1', date: '', description: '', amountCents: 100, category: '', currency: 'EUR' , paymentMethod: '' } });

      // Clear
      const newState = formReducer(state, { type: 'CLEAR_TRANSACTIONS' });

      expect(newState.data.transactionHistory?.past).toEqual([]);
      expect(newState.data.transactionHistory?.present).toBeNull();
      expect(newState.data.transactionHistory?.future).toEqual([]);
    });
  });

  describe('RESET_APP', () => {
    it('should reset to initial state', () => {
      // Eerst wat wijzigingen aanbrengen
      state = formReducer(state, { type: 'SET_STEP', payload: 'DASHBOARD' });
      state = formReducer(state, { 
        type: 'UPDATE_DATA', 
        payload: { [DATA_KEYS.SETUP]: { aantalMensen: 5 } } 
      });

      // Reset
      const newState = formReducer(state, { type: 'RESET_APP' });

      expect(newState.activeStep).toBe('LANDING');
      expect(newState.currentScreenId).toBe('landing');
      expect(newState.isValid).toBe(true);
      expect(newState.data[DATA_KEYS.SETUP].aantalMensen).toBe(1);
      expect(newState.viewModels).toEqual({});
    });
  });

  describe('HYDRATE', () => {
    it('should hydrate state with persisted data', () => {
      const persistedData = {
        data: {
          [DATA_KEYS.SETUP]: {
            aantalMensen: 3,
            aantalVolwassen: 2,
            autoCount: '1',
            heeftHuisdieren: true,
            woningType: 'Koop',
            dob: '',
          },
          [DATA_KEYS.HOUSEHOLD]: { members: [], huurtoeslag: 0, zorgtoeslag: 0 },
          [DATA_KEYS.FINANCE]: { income: { items: [], totalAmount: 0 }, expenses: { items: [], totalAmount: 0 } },
          latestTransaction: {
            latestTransactionDate: new Date().toISOString().split('T')[0],
            latestTransactionAmount: 0,
            latestTransactionCategory: null,
            latestTransactionDescription: '',
            latestPaymentMethod: 'pin',
          },
          [DATA_KEYS.CSV_IMPORT]: {
            transactions: [],
            importedAt: '',
            period: null,
            status: 'idle' as const,
            sourceBank: undefined,
            fileName: '',
            transactionCount: 0,
          },
          transactionHistory: { past: [], present: null, future: [] },
        },
        meta: { lastModified: new Date().toISOString(), version: 2 },
      };

      const action: FormAction = {
        type: 'HYDRATE',
        payload: persistedData,
      };

      const newState = formReducer(state, action);

      expect(newState.data[DATA_KEYS.SETUP].aantalMensen).toBe(3);
      expect(newState.activeStep).toBe('LANDING'); // Wordt gereset naar LANDING
      expect(newState.currentScreenId).toBe('landing');
      expect(newState.viewModels).toEqual({});
      expect(newState.meta.version).toBe(2);
    });
  });

  describe('default case', () => {
    it('should return state unchanged for unknown action', () => {
      const action = { type: 'UNKNOWN' } as any;
      const newState = formReducer(state, action);
      expect(newState).toBe(state);
    });
  });

  describe('meta updates', () => {
    it('should update lastModified on every action', () => {
      const originalDate = state.meta.lastModified;
      
      // Wacht 1ms om timestamp verschil te garanderen
      jest.useFakeTimers();
      jest.advanceTimersByTime(1);

      const newState = formReducer(state, { type: 'SET_STEP', payload: 'DASHBOARD' });

      expect(newState.meta.lastModified).not.toBe(originalDate);
      expect(new Date(newState.meta.lastModified).getTime()).toBeGreaterThan(
        new Date(originalDate).getTime()
      );

      jest.useRealTimers();
    });
  });
});