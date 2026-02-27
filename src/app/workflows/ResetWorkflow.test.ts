// src/app/workflows/__tests__/ResetWorkflow.test.ts
/**
 * Tests voor de ResetWorkflow + de gewijzigde onderdelen van het reset-pad.
 *
 * Dekt:
 *   1. ResetWorkflow — 'full': dispatcht RESET_APP + roept PersistenceAdapter.clear() aan
 *   2. ResetWorkflow — 'full': logt via Logger.info
 *   3. ResetWorkflow — 'setup': dispatcht RESET_SETUP
 *   4. ResetWorkflow — 'setup': roept PersistenceAdapter.clear() NIET aan
 *   5. ResetWorkflow — 'setup': logt via Logger.info
 *   6. formReducer RESET_APP — navigeert naar LANDING, wist alle data
 *   7. formReducer RESET_SETUP — navigeert naar WIZARD_SETUP_HOUSEHOLD
 *   8. formReducer RESET_SETUP — behoudt transactionHistory
 *   9. formReducer RESET_SETUP — behoudt csvImport
 *  10. formReducer RESET_SETUP — behoudt latestTransaction
 *  11. formReducer RESET_SETUP — wist setup, household, finance
 */

import { ResetWorkflow } from './ResetWorkflow';
import { Logger } from '@adapters/audit/AuditLoggerAdapter';
import { formReducer } from '@app/state/formReducer';
import type { FormState, TransactionRecord } from '@core/types/core';
import type { FormAction } from '@app/state/formReducer';

// ─── Mocks ────────────────────────────────────────────────────────────────────

jest.mock('@adapters/audit/AuditLoggerAdapter', () => ({
  Logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('@adapters/system/PersistenceAdapter', () => ({
  clear: jest.fn().mockResolvedValue(undefined),
  save:  jest.fn().mockResolvedValue(undefined),
  load:  jest.fn().mockResolvedValue(null),
}));

// ─── FSO mock-helper ──────────────────────────────────────────────────────────

function makeMockFso() {
  return {
    dispatch: jest.fn(),
    getState: jest.fn(),
    getValue: jest.fn(),
    updateField: jest.fn(),
    getValidationError: jest.fn(),
  };
}

// ─── FormState test-fixture ───────────────────────────────────────────────────

const sampleTransaction: TransactionRecord = {
  id: 'tx_001',
  amountCents: 1500,      // ← correct (1500 cent = €15,00)
  currency: 'EUR', 
  category: 'boodschappen',
  description: 'AH',
  paymentMethod: 'pin',
  date: '2026-02-25',
};

function makeTestState(overrides: Partial<FormState['data']> = {}): FormState {
  return {
    activeStep: 'RESET',
    currentScreenId: 'RESET',
    isValid: true,
    viewModels: {},
    meta: { lastModified: '2026-02-25T10:00:00.000Z', schemaVersion: '1.0' },
    data: {
      setup: {
        aantalMensen: 3,
        aantalVolwassen: 2,
        autoCount: 'Eén',
        heeftHuisdieren: true,
        woningType: 'Koop',
        dob: '1985-01-01',
      },
      household: {
        members: [{ id: 'm1', naam: 'Jan', geboortedatum: '1985-01-01', gender: 'Man' }],
        huurtoeslag: 12000,
        zorgtoeslag: 9600,
      },
      finance: {
        income:   { items: [{ fieldId: 'inc1', amount: 250000 }], totalAmount: 250000 },
        expenses: { items: [{ fieldId: 'exp1', amount: 80000,  category: 'huur', description: '', paymentMethod: 'pin', date: '2026-02-01' }], totalAmount: 80000 },
      },
      latestTransaction: {
        latestTransactionDate:        '2026-02-25',
        latestTransactionAmount:      4500,
        latestTransactionCategory:    'boodschappen',
        latestTransactionDescription: 'supermarkt',
        latestPaymentMethod:          'pin',
      },
      csvImport: {
        transactions:    [sampleTransaction],
        importedAt:      '2026-02-24T09:00:00.000Z',
        period:          { start: '2026-01-01', end: '2026-02-24' },
        status:          'success' as const,
        sourceBank:      undefined,
        fileName:        'export.csv',
        transactionCount: 1,
      },
      transactionHistory: {
        past:    [sampleTransaction],
        present: sampleTransaction,
        future:  [],
      },
      ...overrides,
    },
  } as unknown as FormState;
}

// ═════════════════════════════════════════════════════════════════════════════

describe('ResetWorkflow', () => {
  let workflow: ResetWorkflow;
  let mockFso: ReturnType<typeof makeMockFso>;
  let persistenceAdapter: { clear: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();
    workflow = new ResetWorkflow();
    mockFso = makeMockFso();
    persistenceAdapter = jest.requireMock('@adapters/system/PersistenceAdapter');
  });

  // ─── Groep 1: full reset ──────────────────────────────────────────────────

  describe("execute('full')", () => {
    it('dispatcht RESET_APP', () => {
      workflow.execute('full', mockFso as never);

      expect(mockFso.dispatch).toHaveBeenCalledWith({ type: 'RESET_APP' });
    });

    it('roept PersistenceAdapter.clear() aan', () => {
      workflow.execute('full', mockFso as never);

      expect(persistenceAdapter.clear).toHaveBeenCalledTimes(1);
    });

    it('logt reset_completed met type "full"', () => {
      workflow.execute('full', mockFso as never);

      expect(Logger.info).toHaveBeenCalledWith('reset_completed', expect.objectContaining({
        workflow: 'reset',
        type: 'full',
      }));
    });
  });

  // ─── Groep 2: setup reset ─────────────────────────────────────────────────

  describe("execute('setup')", () => {
    it('dispatcht RESET_SETUP', () => {
      workflow.execute('setup', mockFso as never);

      expect(mockFso.dispatch).toHaveBeenCalledWith({ type: 'RESET_SETUP' });
    });

    it('roept PersistenceAdapter.clear() NIET aan', () => {
      workflow.execute('setup', mockFso as never);

      expect(persistenceAdapter.clear).not.toHaveBeenCalled();
    });

    it('logt reset_completed met type "setup"', () => {
      workflow.execute('setup', mockFso as never);

      expect(Logger.info).toHaveBeenCalledWith('reset_completed', expect.objectContaining({
        workflow: 'reset',
        type: 'setup',
      }));
    });
  });
});

// ═════════════════════════════════════════════════════════════════════════════

describe('formReducer — RESET_APP', () => {
  it('navigeert activeStep naar LANDING', () => {
    const state  = makeTestState();
    const result = formReducer(state, { type: 'RESET_APP' } as FormAction);

    expect(result.activeStep).toBe('LANDING');
  });

  it('wist finance.income.items', () => {
    const state  = makeTestState();
    const result = formReducer(state, { type: 'RESET_APP' } as FormAction);

    expect(result.data.finance.income.items).toEqual([]);
  });

  it('wist transactionHistory', () => {
    const state  = makeTestState();
    const result = formReducer(state, { type: 'RESET_APP' } as FormAction);

    expect(result.data.transactionHistory?.past).toEqual([]);
    expect(result.data.transactionHistory?.present).toBeNull();
  });
});

// ═════════════════════════════════════════════════════════════════════════════

describe('formReducer — RESET_SETUP', () => {
  it('navigeert activeStep naar WIZARD_SETUP_HOUSEHOLD', () => {
    const state  = makeTestState();
    const result = formReducer(state, { type: 'RESET_SETUP' } as FormAction);

    expect(result.activeStep).toBe('WIZARD_SETUP_HOUSEHOLD');
  });

  it('navigeert currentScreenId naar WIZARD_SETUP_HOUSEHOLD', () => {
    const state  = makeTestState();
    const result = formReducer(state, { type: 'RESET_SETUP' } as FormAction);

    expect(result.currentScreenId).toBe('WIZARD_SETUP_HOUSEHOLD');
  });

  it('wist setup — aantalMensen reset naar 1', () => {
    const state  = makeTestState();
    const result = formReducer(state, { type: 'RESET_SETUP' } as FormAction);

    expect(result.data.setup.aantalMensen).toBe(1);
  });

  it('wist household.members', () => {
    const state  = makeTestState();
    const result = formReducer(state, { type: 'RESET_SETUP' } as FormAction);

    expect(result.data.household.members).toEqual([]);
  });

  it('wist finance.income.items', () => {
    const state  = makeTestState();
    const result = formReducer(state, { type: 'RESET_SETUP' } as FormAction);

    expect(result.data.finance.income.items).toEqual([]);
  });

  it('wist finance.expenses.items', () => {
    const state  = makeTestState();
    const result = formReducer(state, { type: 'RESET_SETUP' } as FormAction);

    expect(result.data.finance.expenses.items).toEqual([]);
  });

  it('BEHOUDT transactionHistory.past', () => {
    const state  = makeTestState();
    const result = formReducer(state, { type: 'RESET_SETUP' } as FormAction);

    expect(result.data.transactionHistory?.past).toHaveLength(1);
    expect(result.data.transactionHistory?.past[0]).toEqual(sampleTransaction);
  });

  it('BEHOUDT transactionHistory.present', () => {
    const state  = makeTestState();
    const result = formReducer(state, { type: 'RESET_SETUP' } as FormAction);

    expect(result.data.transactionHistory?.present).toEqual(sampleTransaction);
  });

  it('BEHOUDT csvImport.transactions', () => {
    const state  = makeTestState();
    const result = formReducer(state, { type: 'RESET_SETUP' } as FormAction);

    expect(result.data.csvImport?.transactions).toHaveLength(1);
  });

  it('BEHOUDT csvImport.fileName', () => {
    const state  = makeTestState();
    const result = formReducer(state, { type: 'RESET_SETUP' } as FormAction);

    expect(result.data.csvImport?.fileName).toBe('export.csv');
  });

  it('BEHOUDT latestTransaction.latestTransactionAmount', () => {
    const state  = makeTestState();
    const result = formReducer(state, { type: 'RESET_SETUP' } as FormAction);

    // latestTransaction wordt niet aangeraakt door RESET_SETUP
    expect(result.data.latestTransaction?.latestTransactionAmount).toBe(4500);
  });

  it('reset viewModels naar leeg object', () => {
    const state  = makeTestState();
    const result = formReducer(state, { type: 'RESET_SETUP' } as FormAction);

    expect(result.viewModels).toEqual({});
  });

  it('isValid wordt teruggezet naar true', () => {
    const state  = { ...makeTestState(), isValid: false };
    const result = formReducer(state, { type: 'RESET_SETUP' } as FormAction);

    expect(result.isValid).toBe(true);
  });
});
