import { FormState } from '@shared-types/form';
import { deepMerge } from '@utils/objects';
import { DATA_KEYS } from '@domain/constants/datakeys';

/**
 * In lijn met de Orchestrator: UI → façade → boundary → orchestrator.dispatch(FIELD_CHANGED).
 * Deze reducer is puur; parsing/validatie is upstream afgedwongen.
 */
export type FormAction =
  | { type: 'UPDATE_DATA'; payload: Partial<FormState['data']> }
  | { type: 'FIELD_CHANGED'; fieldId: string; value: unknown }
  | { type: 'SET_STEP'; payload: FormState['activeStep'] }
  | { type: 'RESET_APP' };

export function formReducer(state: FormState, action: FormAction): FormState {
  const meta = { ...state.meta, lastModified: new Date().toISOString() };

  switch (action.type) {
    case 'UPDATE_DATA':
      return {
        ...state,
        data: deepMerge(state.data, action.payload),
        meta,
      };

    case 'FIELD_CHANGED':
      return updateViaPaths(state, { fieldId: action.fieldId, value: action.value }, meta);

    case 'SET_STEP':
      return { ...state, activeStep: action.payload, meta };

    case 'RESET_APP':
      return resetAppState(state, meta);

    default:
      return state;
  }
}

/* ──────────────────────────────────────────────────────────────────────────────
 * Dispatcher
 * ──────────────────────────────────────────────────────────────────────────── */

function updateViaPaths(
  state: FormState,
  change: { fieldId: string; value: unknown },
  meta: FormState['meta']
): FormState {
  const simple = updateSetupOrHousehold(state, change, meta);
  if (simple !== null) return simple; // expliciete null-check voor lint

  return updateFinance(state, change, meta);
}

/* ──────────────────────────────────────────────────────────────────────────────
 * Setup & Household (≤30 regels)
 * ──────────────────────────────────────────────────────────────────────────── */

function updateSetupOrHousehold(
  state: FormState,
  { fieldId, value }: { fieldId: string; value: unknown },
  meta: FormState['meta']
): FormState | null {
  // Household direct
  if (fieldId === 'huurtoeslag' || fieldId === 'zorgtoeslag') {
    return updateHouseholdField(state, fieldId, value, meta);
  }

  // Setup direct
  const setupKeys = new Set(['aantalMensen', 'aantalVolwassen', 'autoCount', 'heeftHuisdieren', 'woningType']);
  if (setupKeys.has(fieldId) === true) {
    return updateSetupField(state, fieldId, value, meta);
  }

  return null;
}

function updateHouseholdField(
  state: FormState,
  fieldId: 'huurtoeslag' | 'zorgtoeslag',
  value: unknown,
  meta: FormState['meta']
): FormState {
  return {
    ...state,
    data: {
      ...state.data,
      [DATA_KEYS.HOUSEHOLD]: {
        ...state.data[DATA_KEYS.HOUSEHOLD],
        [fieldId]: value,
      },
    },
    meta,
  };
}

function updateSetupField(
  state: FormState,
  fieldId: string,
  value: unknown,
  meta: FormState['meta']
): FormState {
  return {
    ...state,
    data: {
      ...state.data,
      [DATA_KEYS.SETUP]: {
        ...state.data[DATA_KEYS.SETUP],
        [fieldId]: value,
      },
    },
    meta,
  };
}

/* ──────────────────────────────────────────────────────────────────────────────
 * Finance updates (≤30 regels)
 * ──────────────────────────────────────────────────────────────────────────── */

function updateFinance(
  state: FormState,
  { fieldId, value }: { fieldId: string; value: unknown },
  meta: FormState['meta']
): FormState {
  // Alleen item‑keys via items[] updaten; anders noop (fail‑closed)
  if (isFinanceItemKey(fieldId) !== true) {
    return { ...state, meta };
  }

  // Defensieve coercion (boundary zou al geparsed moeten hebben)
  const parsed = Number(value);
  const amount = Number.isFinite(parsed) ? parsed : 0;

  const nextIncomeItems = updateFinanceList(state.data.finance.income.items, fieldId, amount);
  const nextExpenseItems = updateFinanceList(state.data.finance.expenses.items, fieldId, amount);

  const incomeChanged = nextIncomeItems !== state.data.finance.income.items;
  const expenseChanged = nextExpenseItems !== state.data.finance.expenses.items;

  if (incomeChanged !== true && expenseChanged !== true) {
    return { ...state, meta };
  }

  return {
    ...state,
    data: {
      ...state.data,
      [DATA_KEYS.FINANCE]: {
        ...state.data[DATA_KEYS.FINANCE],
        income: {
          ...state.data.finance.income,
          items: nextIncomeItems as typeof state.data.finance.income.items,
        },
        expenses: {
          ...state.data.finance.expenses,
          items: nextExpenseItems as typeof state.data.finance.expenses.items,
        },
      },
    },
    meta,
  };
}

/* ──────────────────────────────────────────────────────────────────────────────
 * Finance helpers (type‑safe zonder any)
 * ──────────────────────────────────────────────────────────────────────────── */

function isFinanceItemKey(raw: string): boolean {
  // TIP: vul deze set aan met jullie echte organisms‑keys
  const KNOWN: ReadonlySet<string> = new Set([
    // INCOME
    'nettoSalaris', 'werkFrequentie', 'vakantiegeldPerJaar', 'vakantiegeldPerMaand',
    // EXPENSES
    'wegenbelasting', 'ozb', 'energieGas', 'water',
  ]);

  if (KNOWN.has(raw) === true) return true;
  if (raw.startsWith('streaming_') === true) return true; // eenvoudige conventie
  return false;
}

/**
 * Items‑array in core is getypeerd als Record<string, unknown>[].
 * We muteren veilig met structurele checks, geen `any` nodig.
 */
function updateFinanceList(
  items: Array<Record<string, unknown>>,
  targetId: string,
  amount: number
): Array<Record<string, unknown>> {
  const idx = items.findIndex((i) => {
    const id = (i as Record<string, unknown>)?.fieldId;
    return typeof id === 'string' && id === targetId; // expliciete boolean‑return (lint‑proof)
  });

  if (idx === -1) return items;

  const current = items[idx];
  const next = items.slice();
  next[idx] = { ...current, amount }; // amount: number (coerced upstream)
  return next;
}

/* ──────────────────────────────────────────────────────────────────────────────
 * Reset: align met huidige core.ts (totalAmount i.p.v. aggregaten)
 * ──────────────────────────────────────────────────────────────────────────── */

const INITIAL_DATA_RESET: FormState['data'] = {
  [DATA_KEYS.SETUP]: {
    aantalMensen: 1,
    aantalVolwassen: 1,
    autoCount: 'Nee',
    heeftHuisdieren: false,
    woningType: 'Huur',
  },
  [DATA_KEYS.HOUSEHOLD]: {
    members: [],
    huurtoeslag: 0,
    zorgtoeslag: 0,
  },
  [DATA_KEYS.FINANCE]: {
    income: { items: [], totalAmount: 0 },   // ← conform core.ts
    expenses: { items: [], totalAmount: 0 }, // ← conform core.ts
  },
};

function resetAppState(state: FormState, meta: FormState['meta']): FormState {
  return {
    ...state,
    data: INITIAL_DATA_RESET,
    isValid: true,
    activeStep: 'LANDING',
    meta,
  };
}