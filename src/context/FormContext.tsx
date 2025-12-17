// src/context/FormContext.tsx
import * as React from 'react';
import { Storage } from '../services/storage';
import { alignMembers } from '../services/householdAlign';
import { Member } from '../types/household';
import { cleanName } from '../utils/strings';
import { calculateAge } from '../utils/date';

// ============================================================================
// TYPES
// ============================================================================
type PageId = 'C1' | 'C4' | 'C7' | 'C10' | string;

export type FormState = Record<string, any> & {
  isSpecialStatus?: boolean; // Voor huishoudens > 5 volwassenen
};

export type SetPageDataAction = {
  type: 'SET_PAGE_DATA';
  pageId: PageId;
  data: Record<string, any>;
};
export type LoadSavedStateAction = { type: 'LOAD_SAVED_STATE'; data: FormState };
export type SetUserIdAction = { type: 'SET_USER_ID'; userId: string | null };
export type ResetStateAction = { type: 'RESET_STATE' };
export type AlignHouseholdAction = {
  type: 'ALIGN_HOUSEHOLD_MEMBERS';
  payload: { aantalMensen: number; aantalVolwassen: number };
};
export type UpdateMemberFieldAction = {
  type: 'UPDATE_MEMBER_FIELD';
  payload: { index: number; field: keyof Member; value: any };
};

export type FormAction =
  | SetPageDataAction
  | LoadSavedStateAction
  | SetUserIdAction
  | ResetStateAction
  | AlignHouseholdAction
  | UpdateMemberFieldAction; // Puntkomma verwijderd

export type FormContextValue = {
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
};

// Helper om "Speciale Status" te checken (> 5 volwassenen)
const checkSpecialStatus = (leden: Member[]): boolean => {
  const adultCount = leden.filter((m) => m.memberType === 'adult').length;
  return adultCount > 5;
};

// ============================================================================
// REDUCER
// ============================================================================
const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_PAGE_DATA':
      return {
        ...state,
        [action.pageId]: { ...(state[action.pageId] ?? {}), ...action.data },
      };

    case 'UPDATE_MEMBER_FIELD': {
      const { index, field, value } = action.payload;
      const current = Array.isArray(state?.C4?.leden) ? (state.C4.leden as Member[]) : [];
      if (index < 0 || index >= current.length) return state;

      let updatedMember = { ...current[index] };

      if (field === 'naam') {
        updatedMember.naam = cleanName(value, 25);
      } else if (field === 'dateOfBirth') {
        const val = typeof value === 'string' ? value.trim() : '';
        updatedMember.dateOfBirth = val || undefined;
        updatedMember.leeftijd = val ? (calculateAge(val) ?? undefined) : undefined;
      } else {
        (updatedMember as any)[field] = value;
      }

      const nextLeden = current.map((m, i) => (i === index ? updatedMember : m));

      return {
        ...state,
        isSpecialStatus: checkSpecialStatus(nextLeden), // Update status
        C4: { ...(state.C4 ?? {}), leden: nextLeden },
      };
    }

    case 'ALIGN_HOUSEHOLD_MEMBERS': {
      const { aantalMensen, aantalVolwassen } = action.payload;
      const current = state?.C4?.leden;
      const aligned = alignMembers(current, aantalMensen, aantalVolwassen);

      return {
        ...state,
        isSpecialStatus: checkSpecialStatus(aligned), // Update status
        C4: { ...(state.C4 ?? {}), leden: aligned },
      };
    }

    case 'LOAD_SAVED_STATE':
      return { ...state, ...action.data };

    case 'SET_USER_ID':
      return { ...state, userId: action.userId };

    case 'RESET_STATE':
      return { userId: null };

    default:
      return state; // Essentieel!
  }
};

// ============================================================================
// PROVIDER (Blijft grotendeels gelijk, maar met default state {} )
// ============================================================================
const FormContext = React.createContext<FormContextValue | undefined>(undefined);

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(formReducer, {});

  const hasHydratedRef = React.useRef(false);

  React.useEffect(() => {
    let isMounted = true;
    const hydrate = async () => {
      const persisted = await Storage.loadState();
      if (persisted && isMounted) {
        dispatch({ type: 'LOAD_SAVED_STATE', data: persisted });
      }
      if (isMounted) hasHydratedRef.current = true;
    };
    hydrate();
    return () => {
      isMounted = false;
    };
  }, []);

  const saveTimer = React.useRef<any>(null);
  React.useEffect(() => {
    if (!hasHydratedRef.current) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      Storage.saveState(state).catch((e) => __DEV__ && console.warn(e));
    }, 400);
  }, [state]);

  const value = React.useMemo(() => ({ state, dispatch }), [state]);
  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

export const useFormContext = () => {
  const context = React.useContext(FormContext);
  if (!context) throw new Error('useFormContext must be used within FormProvider');
  return context;
};
