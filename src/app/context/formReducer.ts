import { FormState, FormAction } from '../../shared-types/form';
import { deepMerge } from '@utils/objects'; // Zorg dat deze helper bestaat

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
      return { ...state, data: { ...state.data }, meta: metaUpdate };

    default:
      return state;
  }
}