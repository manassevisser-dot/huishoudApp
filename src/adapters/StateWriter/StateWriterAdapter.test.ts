// src/adapters/StateWriter/StateWriterAdapter.test.ts

import { StateWriterAdapter } from './StateWriterAdapter';
import { initialFormState } from '@app/state/initialFormState';
import type { FormState } from '@core/types/core';

describe('StateWriterAdapter', () => {
  let mockDispatch: jest.Mock;
  let getState: () => FormState;
  let writer: StateWriterAdapter;

  beforeEach(() => {
    mockDispatch = jest.fn();
    getState = () => JSON.parse(JSON.stringify(initialFormState)) as FormState;
    writer = new StateWriterAdapter(getState, mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Direct Setup Fields', () => {
    it('writes aantalMensen to SETUP section', () => {
      writer.updateField('aantalMensen', 5);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'UPDATE_DATA',
        payload: {
          setup: { ...initialFormState.data.setup, aantalMensen: 5 },
        },
      });
    });

    it('writes autoCount to SETUP section', () => {
      writer.updateField('autoCount', 'Twee');

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'UPDATE_DATA',
        payload: {
          setup: { ...initialFormState.data.setup, autoCount: 'Twee' },
        },
      });
    });
  });

  describe('Direct Household Fields', () => {
    it('writes huurtoeslag to HOUSEHOLD section', () => {
      writer.updateField('huurtoeslag', 120);

      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'UPDATE_DATA',
        payload: {
          household: { ...initialFormState.data.household, huurtoeslag: 120 },
        },
      });
    });
  });

  describe('Dynamic Income Collection', () => {
    it('creates new income item if not exists', () => {
      writer.updateField('nettoSalaris', 2500);

      const expectedIncomeItem = { fieldId: 'nettoSalaris', amount: 2500 };
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'UPDATE_DATA',
        payload: {
          finance: {
            ...initialFormState.data.finance,
            income: {
              ...initialFormState.data.finance.income,
              items: [expectedIncomeItem],
            },
          },
        },
      });
    });

    it('updates existing income item', () => {
      // Simulate existing state with nettoSalaris = 2000
      const stateWithIncome: FormState = JSON.parse(JSON.stringify(initialFormState)) as FormState;
      stateWithIncome.data.finance.income.items = [{ fieldId: 'nettoSalaris', amount: 2000 }];
      getState = () => stateWithIncome;

      writer = new StateWriterAdapter(getState, mockDispatch);
      writer.updateField('nettoSalaris', 2500);

      const updatedItem = { fieldId: 'nettoSalaris', amount: 2500 };
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'UPDATE_DATA',
        payload: {
          finance: {
            ...stateWithIncome.data.finance,
            income: {
              ...stateWithIncome.data.finance.income,
              items: [updatedItem],
            },
          },
        },
      });
    });
  });

  describe('Dynamic Expense Collection', () => {
    it('creates new expense item (wegenbelasting)', () => {
      writer.updateField('wegenbelasting', 45);

      const expectedExpenseItem = { fieldId: 'wegenbelasting', amount: 45 };
      expect(mockDispatch).toHaveBeenCalledWith({
        type: 'UPDATE_DATA',
        payload: {
          finance: {
            ...initialFormState.data.finance,
            expenses: {
              ...initialFormState.data.finance.expenses,
              items: [expectedExpenseItem],
            },
          },
        },
      });
    });
  });

  describe('Fail-Closed Behavior', () => {
    it('ignores unknown field ID', () => {
      writer.updateField('onbestaandVeld', 'waarde');

      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  describe('Type Coercion', () => {
    it('coerces string number to actual number', () => {
      writer.updateField('nettoSalaris', '2500');

      const expectedItem = { fieldId: 'nettoSalaris', amount: 2500 };
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            finance: expect.objectContaining({
              income: expect.objectContaining({
                items: [expectedItem],
              }),
            }),
          }),
        })
      );
    });

    it('coerces invalid number to 0', () => {
      writer.updateField('nettoSalaris', 'abc');

      const expectedItem = { fieldId: 'nettoSalaris', amount: 0 };
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            finance: expect.objectContaining({
              income: expect.objectContaining({
                items: [expectedItem],
              }),
            }),
          }),
        })
      );
    });
  });
});