import * as React from 'react';
import { Storage } from '../services/storage';
import { alignMembers } from '../services/householdAlign';
import { Member } from '../types/OUDhousehold';
import { cleanName } from '../utils/strings';
import { calculateAge } from '../utils/date';
import { selectIsSpecialStatus } from '../selectors/householdSelectors';

// ============================================================================
// TYPES
// ============================================================================
type PageId = 'C1' | 'C4' | 'C7' | 'C10' | (string & {});

export type FormState = Record<string, any> & {
  isSpecialStatus?: boolean;
  userId?: string | null;
};

export type SetPageDataAction = {
  type: 'SET_PAGE_DATA';
  pageId: PageId;
  data: Record<string, any>;
};
export type LoadSavedStateAction = { type: 'LOAD_SAVED_STATE'; data: FormState };
export type SetUserIdAction = { type: 'SET_USER_ID'; userId: string | null };
export type ResetStateAction = { type: 'RESET_STATE' };
export type SetSpecialStatusAction = { type: 'SET_SPECIAL_STATUS'; payload: boolean };
export type AlignHouseholdAction = {
  type: 'ALIGN_HOUSEHOLD_MEMBERS';
  payload: { aantalMensen: number; aantalVolwassen: number };
};
export type UpdateMemberFieldAction = {
  type: 'UPDATE_MEMBER_FIELD';
  payload: { index: number; field: keyof Member; value: any; meta?: { phase?: 'change' | 'blur' } };
};

export type FormAction =
  | SetPageDataAction
  | LoadSavedStateAction
  | SetUserIdAction
  | ResetStateAction
  | AlignHouseholdAction
  | UpdateMemberFieldAction
  | SetSpecialStatusAction;

export type FormContextValue = { state: FormState; dispatch: React.Dispatch<FormAction> };

// ============================================================================
// REDUCER (Dumb per ADR-14)
// ============================================================================
const formReducer: React.Reducer<FormState, FormAction> = (state, action): FormState => {
  switch (action.type) {
    case 'SET_PAGE_DATA':
      return { ...state, [action.pageId]: { ...(state[action.pageId] ?? {}), ...action.data } };
    case 'SET_SPECIAL_STATUS':
      return { ...state, isSpecialStatus: action.payload };
    case 'LOAD_SAVED_STATE':
      return { ...state, ...action.data };
    case 'UPDATE_MEMBER_FIELD': {
      const { index, field, value, meta } = action.payload;
      const current = Array.isArray(state?.C4?.leden) ? (state.C4!.leden as Member[]) : [];
      if (index < 0 || index >= current.length) return state;
      const updated = {
        ...current[index],
        [field]: meta?.phase === 'blur' && field === 'naam' ? cleanName(value, 25) : value,
      };
      return {
        ...state,
        C4: { ...(state.C4 ?? {}), leden: current.map((m, i) => (i === index ? updated : m)) },
      };
    }
    case 'ALIGN_HOUSEHOLD_MEMBERS':
      return {
        ...state,
        C4: {
          ...(state.C4 ?? {}),
          leden: alignMembers(
            state?.C4?.leden,
            action.payload.aantalMensen,
            action.payload.aantalVolwassen,
          ),
        },
      };
    case 'SET_USER_ID':
      return { ...state, userId: action.userId };
    case 'RESET_STATE':
      return { userId: null };
    default:
      return state;
  }
};

// ============================================================================
// PROVIDER
// ============================================================================
const FormContext = React.createContext<FormContextValue | undefined>(undefined);

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(formReducer, {} as FormState);
  const hasHydratedRef = React.useRef(false);

  React.useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const persisted = await Storage.loadState();
        if (persisted && isMounted) {
          dispatch({ type: 'LOAD_SAVED_STATE', data: persisted });
          const isSpecial = selectIsSpecialStatus(persisted as any);
          dispatch({ type: 'SET_SPECIAL_STATUS', payload: isSpecial });
        }
      } finally {
        if (isMounted) hasHydratedRef.current = true;
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  React.useEffect(() => {
    if (!hasHydratedRef.current) return;
    const t = setTimeout(() => Storage.saveState(state).catch(() => {}), 400);
    return () => clearTimeout(t);
  }, [state]);

  return (
    <FormContext.Provider value={React.useMemo(() => ({ state, dispatch }), [state])}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const c = React.useContext(FormContext);
  if (!c) throw new Error('useFormContext must be used within FormProvider');
  return c;
};
