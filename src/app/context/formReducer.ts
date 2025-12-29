import { FormState, FormAction } from '../../shared-types/form';

export const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_VALUE':
    case 'SET_FIELD': {
      const { path, value } = action.payload;
      // We gebruiken een type-cast naar 'any' voor de key om TS te laten weten
      // dat we bewust de top-level properties van FormState indexeren.
      return {
        ...state,
        [path as any]: value,
      };
    }

    case 'SYNC_MEMBERS': {
      // Gebruik DATA_KEYS om consistentie met de Stalen Kern te garanderen
      return {
        ...state,
        household: {
          ...state.household,
          leden: action.payload
        }
      };
    }

    case 'SET_MEMBER_VALUE': {
      const { memberId, key, value } = action.payload;
      const currentFinance = state.finance;
      const currentMember = currentFinance.inkomsten[memberId] || {};

      return {
        ...state,
        finance: {
          ...currentFinance,
          inkomsten: {
            ...currentFinance.inkomsten,
            [memberId]: { ...currentMember, [key]: value }
          }
        }
      };
    }

    case 'RESET_APP':
      return state; // Idealiter keer je hier terug naar een 'initialState'

    default:
      return state;
  }
};