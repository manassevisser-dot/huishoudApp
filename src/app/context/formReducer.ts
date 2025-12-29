import { FormState, FormAction } from '../../shared-types/form';

// Initial state voor fallback scenario's
export const initialState: FormState = {
  activeStep: 'LANDING',
  data: {},
  setup: {},
  household: {
    adultsCount: 1,
    members: [],
    leden: []
  },
  finance: {
    inkomsten: {},
    uitgaven: {}
  }
};

export const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_VALUE':
    case 'SET_FIELD': {
      const { path, value } = action.payload;
      return {
        ...state,
        [path as any]: value,
      };
    }

    case 'SYNC_MEMBERS': {
      // We zorgen dat we altijd een object teruggeven dat voldoet aan de interface
      return {
        ...state,
        household: {
          ...state.household,
          adultsCount: action.payload.count || 0,
          members: action.payload.members || [],
          leden: action.payload.members || [] // Dubbele entry voor compatibiliteit
        }
      };
    }

    case 'SET_MEMBER_VALUE': {
      const { memberId, key, value } = action.payload;
      
      // FIX TS18048: Gebruik null-coalescing om zeker te zijn dat finance bestaat
      const currentFinance = state.finance ?? { inkomsten: {}, uitgaven: {} };
      const currentInkomsten = currentFinance.inkomsten ?? {};
      const currentMemberData = currentInkomsten[memberId] ?? {};

      return {
        ...state,
        finance: {
          ...currentFinance,
          inkomsten: {
            ...currentInkomsten,
            [memberId]: { 
              ...currentMemberData, 
              [key]: value 
            }
          },
          // Zorg dat uitgaven ook altijd aanwezig blijft
          uitgaven: currentFinance.uitgaven ?? {}
        }
      };
    }

    case 'RESET_APP':
      return initialState;

    default:
      return state;
  }
};