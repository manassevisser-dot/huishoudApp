// src/app/state/formReducer.ts
/**
 * @file_intent FormReducer – Pure State Mutator
 * @repo_architecture Mobile Industry (MI) - Core State Management Layer.
 * @term_definition deepMerge = Utility voor onveranderlijke updates van geneste objecten. FormAction = Discriminated union van alle toegestane mutaties op de globale state.
 * @contract Verantwoordelijkheden:
 * ✅ Puur stempelen van wijzigingen (onveranderlijk)
 * ✅ Type‑safe updates
 * * Niet verantwoordelijk voor:
 * ❌ Validatie (gebeurt aan de boundary in de Orchestrator)
 * ❌ Business/routing logica (gebeurt in de StateWriterAdapter)
 * * Architectuur: Pure functie: (state, action) => newState, Geen side‑effects, Immutable updates, Fail‑closed voor onbekende acties
 * @ai_instruction Deze reducer vormt de Single Source of Truth. Gebruik 'UPDATE_DATA' voor domein-data en 'UPDATE_VIEWMODEL' voor UI-specifieke state. Bij uitbreiding van de state-structuur moeten zowel de FormAction union als de INITIAL_DATA_RESET template worden bijgewerkt.
 */
import type { FormState, DeepPartial, CsvImportState, TransactionRecord } from '@core/types/core';
import { deepMerge } from '@utils/objects';
import { DATA_KEYS } from '@domain/constants/datakeys';

export type FormAction =
  | { type: 'UPDATE_DATA'; payload: DeepPartial<FormState['data']> }
  | { type: 'SET_STEP'; payload: FormState['activeStep'] }
  | { type: 'RESET_APP' }
  | { type: 'RESET_SETUP' }
  | { type: 'UPDATE_VIEWMODEL'; payload: Partial<NonNullable<FormState['viewModels']>> }
  | { type: 'SET_CURRENT_SCREEN_ID'; payload: string }
  | { type: 'UPDATE_CSV_IMPORT'; payload: CsvImportState }
  | { type: 'PUSH_TRANSACTION'; payload: TransactionRecord }
  | { type: 'UNDO_TRANSACTION' }
  | { type: 'REDO_TRANSACTION' }
  | { type: 'CLEAR_TRANSACTIONS' }
  | {
      type: 'HYDRATE';
      payload: {
        data: FormState['data'];
        meta: FormState['meta'];
      };
    };

export function formReducer(state: FormState, action: FormAction): FormState {
  const meta = { ...state.meta, lastModified: new Date().toISOString() };

  switch (action.type) {
    case 'UPDATE_DATA':
      return { ...state, data: deepMerge(state.data, action.payload), meta };
    case 'UPDATE_VIEWMODEL': {
      const currentVM = state.viewModels ?? {};
      return { ...state, viewModels: { ...currentVM, ...action.payload }, meta };
    }
    case 'UPDATE_CSV_IMPORT':
      return { ...state, data: { ...state.data, csvImport: action.payload }, meta };
    case 'SET_STEP':
      return { ...state, activeStep: action.payload, meta };
    case 'SET_CURRENT_SCREEN_ID':
      return { ...state, currentScreenId: action.payload, meta };
    case 'PUSH_TRANSACTION': return pushTransaction(state, action.payload, meta);
    case 'UNDO_TRANSACTION':  return undoTransaction(state, meta);
    case 'REDO_TRANSACTION':  return redoTransaction(state, meta);
    case 'CLEAR_TRANSACTIONS': return clearTransactions(state, meta);
    case 'RESET_APP':
      return resetAppState(state, meta);
    case 'RESET_SETUP':
      return resetSetupState(state, meta);
    case 'HYDRATE':
      return {
        ...state,
        data: action.payload.data,
        viewModels: {},
        activeStep: 'LANDING',
        currentScreenId: 'landing',
        meta: action.payload.meta,
      };
    default:
      return state;
  }
}

// ─── Undo/Redo helpers [Fase 7] ──────────────────────────────────────────────

function pushTransaction(
  state: FormState,
  record: TransactionRecord,
  meta: FormState['meta'],
): FormState {
  const history = state.data.transactionHistory ?? { past: [], present: null, future: [] };
  const updatedPast = history.present !== null
    ? [...history.past, history.present]
    : [...history.past];
  const updated: TransactionHistorySlice = { past: updatedPast, present: record, future: [] };
  return { ...state, data: { ...state.data, transactionHistory: updated }, meta };
}

type TransactionHistorySlice = NonNullable<FormState['data']['transactionHistory']>;

function undoTransaction(state: FormState, meta: FormState['meta']): FormState {
  const history = state.data.transactionHistory;
  if (history === undefined || history.past.length === 0) return state;

  const past = [...history.past];
  const newPresent: TransactionRecord | undefined = past.pop();
  const updatedFuture: TransactionRecord[] =
    history.present !== null
      ? [history.present, ...history.future]
      : [...history.future];

  const updated: TransactionHistorySlice = {
    past,
    present: newPresent ?? null,
    future: updatedFuture,
  };

  return { ...state, data: { ...state.data, transactionHistory: updated }, meta };
}

function redoTransaction(state: FormState, meta: FormState['meta']): FormState {
  const history = state.data.transactionHistory;
  if (history === undefined || history.future.length === 0) return state;

  const [newPresent, ...remainingFuture] = history.future;
  const updatedPast: TransactionRecord[] =
    history.present !== null
      ? [...history.past, history.present]
      : [...history.past];

  const updated: TransactionHistorySlice = {
    past: updatedPast,
    present: newPresent ?? null,
    future: remainingFuture,
  };

  return { ...state, data: { ...state.data, transactionHistory: updated }, meta };
}

function clearTransactions(state: FormState, meta: FormState['meta']): FormState {
  const cleared: TransactionHistorySlice = { past: [], present: null, future: [] };
  return { ...state, data: { ...state.data, transactionHistory: cleared }, meta };
}

/** Initial state template voor RESET_APP (align met FormState schema) */
const INITIAL_DATA_RESET: FormState['data'] = {
  [DATA_KEYS.SETUP]: {
    aantalMensen: 1,
    aantalVolwassen: 1,
    autoCount: 'Geen',
    heeftHuisdieren: false,
    woningType: 'Huur',
    dob: '',
  },
  [DATA_KEYS.HOUSEHOLD]: {
    members: [],
    huurtoeslag: 0,
    zorgtoeslag: 0,
  },
  [DATA_KEYS.FINANCE]: {
    income: { items: [], totalAmount: 0 },
    expenses: { items: [], totalAmount: 0 },
  },
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
};

/**
 * RESET_SETUP: wist setup, household en finance. Behoudt transactionHistory,
 * csvImport en latestTransaction. Navigeert terug naar de wizard.
 * Tegenhanger van RESET_APP — minder destructief.
 */
function resetSetupState(state: FormState, meta: FormState['meta']): FormState {
  return {
    ...state,
    data: {
      ...state.data,                                       // behoudt: transactionHistory, csvImport, latestTransaction
      [DATA_KEYS.SETUP]:     INITIAL_DATA_RESET[DATA_KEYS.SETUP],
      [DATA_KEYS.HOUSEHOLD]: INITIAL_DATA_RESET[DATA_KEYS.HOUSEHOLD],
      [DATA_KEYS.FINANCE]:   INITIAL_DATA_RESET[DATA_KEYS.FINANCE],
    },
    isValid: true,
    activeStep: 'WIZARD_SETUP_HOUSEHOLD',
    currentScreenId: 'WIZARD_SETUP_HOUSEHOLD',
    viewModels: {},
    meta,
  };
}

function resetAppState(state: FormState, meta: FormState['meta']): FormState {
  return {
    ...state,
    data: INITIAL_DATA_RESET,
    isValid: true,
    activeStep: 'LANDING',
    currentScreenId: 'landing',
    viewModels: {},
    meta,
  };
}
