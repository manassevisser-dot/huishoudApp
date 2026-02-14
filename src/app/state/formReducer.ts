import type { FormState} from '@core/types/core';
import { deepMerge } from '@utils/objects';
import { DATA_KEYS } from '@domain/constants/datakeys';

/**
 * FormReducer – Pure State Mutator
 *
 * Verantwoordelijkheden:
 * ✅ Puur stempelen van wijzigingen (immutabel)
 * ✅ Type‑safe updates
 *
 * Niet verantwoordelijk voor:
 * ❌ Validatie (gebeurt aan de boundary in de Orchestrator)
 * ❌ Business/routing logica (gebeurt in de StateWriterAdapter)
 *
 * Architectuur:
 * - Pure functie: (state, action) => newState
 * - Geen side‑effects
 * - Immutable updates
 * - Fail‑closed voor onbekende acties
 */

export type FormAction =
  | { type: 'UPDATE_DATA'; payload: Partial<FormState['data']> }
  | { type: 'SET_STEP'; payload: FormState['activeStep'] }
  | { type: 'RESET_APP' }
  | { type: 'UPDATE_VIEWMODEL'; payload: Partial<NonNullable<FormState['viewModels']>> }
  | { type: 'SET_CURRENT_PAGE_ID'; payload: string };

export function formReducer(state: FormState, action: FormAction): FormState {
  const meta = { ...state.meta, lastModified: new Date().toISOString() };

  switch (action.type) {
    case 'UPDATE_DATA': {
      // Patch van de StateWriterAdapter immutabel toepassen
      const nextData = deepMerge(state.data, action.payload);
      return { ...state, data: nextData, meta };
    }
    case 'UPDATE_VIEWMODEL': {
      // ESLint-proof: expliciete check in plaats van ||
      const currentVM = (state.viewModels !== undefined && state.viewModels !== null)
        ? state.viewModels
        : {};

      return {
        ...state,
        viewModels: {
          ...currentVM,
          ...action.payload,
        },
        meta
      };
    }
    case 'SET_STEP':
      return { ...state, activeStep: action.payload, meta };

    case 'SET_CURRENT_PAGE_ID':
      return { ...state, currentPageId: action.payload, meta };

    case 'RESET_APP':
      return resetAppState(state, meta);

    default:
      return state;
  }
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