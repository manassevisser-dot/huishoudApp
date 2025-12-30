import { FormState, FormAction } from '../../shared-types/form';

/**
 * De initiële state volgens de nieuwe Phoenix-structuur
 */
export const initialState: FormState = {
  currentPageId: 'setup',
  activeStep: 0,
  data: {
    setup: {},
    household: {
      members: [],
    },
    finance: {},
  },
  isValid: false,
};

export function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_PAGE':
      return {
        ...state,
        currentPageId: action.pageId,
      };

    case 'SET_VALUE':
      // Voor algemene setup velden
      return {
        ...state,
        data: {
          ...state.data,
          setup: { ...state.data.setup, ...action.payload },
        },
      };

    case 'SET_FIELD':
      // Specifieke veld-updates op basis van fieldId
      return {
        ...state,
        data: {
          ...state.data,
          setup: { ...state.data.setup, [action.fieldId]: action.value },
        },
      };

    case 'UPDATE_MEMBER':
      const updatedMembers = [...state.data.household.members];
      if (updatedMembers[action.index]) {
        updatedMembers[action.index] = {
          ...updatedMembers[action.index],
          ...action.member,
        };
      }
      return {
        ...state,
        data: {
          ...state.data,
          household: { ...state.data.household, members: updatedMembers },
        },
      };

    case 'SET_MEMBER_VALUE':
      const membersForValue = [...state.data.household.members];
      if (membersForValue[action.index]) {
        membersForValue[action.index] = {
          ...membersForValue[action.index],
          [action.field]: action.value,
        };
      }
      return {
        ...state,
        data: {
          ...state.data,
          household: { ...state.data.household, members: membersForValue },
        },
      };

    case 'SYNC_HOUSEHOLD':
      // Hier vangen we de resultaten op van de alignment logic
      // We gaan ervan uit dat de sync-logica elders de members al heeft voorbereid
      return {
        ...state,
        data: {
          ...state.data,
          setup: {
            ...state.data.setup,
            aantalMensen: action.aantalMensen,
            aantalVolwassen: action.aantalVolwassen,
          },
        },
      };

    case 'SYNC_MEMBERS':
      return {
        ...state,
        data: {
          ...state.data,
          household: { ...state.data.household, members: action.payload },
        },
      };

    case 'RESET_APP':
      return initialState;

    default:
      return state;
  }
}