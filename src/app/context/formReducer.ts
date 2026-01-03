import { FormState, FormAction } from '../../shared-types/form';
import { deepMerge } from '@utils/objects'; // Zorg dat deze helper bestaat
import { DATA_KEYS } from '@domain/constants/datakeys';

export function formReducer(state: FormState, action: FormAction): FormState {
  const metaUpdate = { ...state.meta, lastModified: new Date().toISOString() };

  switch (action.type) {
    case 'UPDATE_DATA': { 
      return {
        ...state,
        data: deepMerge(state.data, action.payload),
        meta: metaUpdate,
      };
    }

    case 'SET_FIELD': { 
      const { section, field, value } = action.payload;
      return {
        ...state,
        data: {
          ...state.data,
          [section]: {
            ...(state.data as any)[section],
            [field]: value,
          },
        },
        meta: metaUpdate,
      };
    }

    case 'SET_STEP':
      return { ...state, activeStep: action.payload, meta: metaUpdate };

      case 'RESET_APP':
      return {
        ...state,
        data: {
          // SETUP Sectie (Fix Error 2418)
          [DATA_KEYS.SETUP]: { 
            aantalMensen: 1,
            aantalVolwassen: 1,
            autoCount: "Nee",
            heeftHuisdieren: false,
          },
          // HOUSEHOLD Sectie
          household: { 
            members: [] 
          },
          // FINANCE Sectie (Fix Error 2741)
          finance: {
            income: {
              items: [],      // ✅ 'items' is verplicht volgens je shared-types
              totalAmount: 0
            },
            expenses: {
              items: [],      // ✅ Idem voor uitgaven
              totalAmount: 0
            }
          }
        },
        isValid: true,        // ✅ Fixt de falende test
        activeStep: "0",      // ✅ Fixt de string/number mismatch
        meta: metaUpdate,
      };

    default:
      return state;
  }
}