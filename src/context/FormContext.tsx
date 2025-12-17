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
type PageId = 'C1' | 'C4' | 'C7' | 'C10' | (string & {});

export type FormState = Record<string, any> & {
  isSpecialStatus?: boolean; // >5 volwassenen
  userId?: string | null;
};

export type SetPageDataAction = {
  type: 'SET_PAGE_DATA';
  pageId: PageId;
  data: Record<string, any>;
};

<<<<<<< Updated upstream
export type LoadSavedStateAction = { 
  type: 'LOAD_SAVED_STATE'; 
  data: FormState 
};

export type SetUserIdAction = { 
  type: 'SET_USER_ID'; 
  userId: string | null 
};

export type ResetStateAction = { 
  type: 'RESET_STATE' 
};
=======
export type LoadSavedStateAction = {
  type: 'LOAD_SAVED_STATE';
  data: FormState;
};

export type SetUserIdAction = {
  type: 'SET_USER_ID';
  userId: string | null;
};

export type ResetStateAction = { type: 'RESET_STATE' };
>>>>>>> Stashed changes

export type AlignHouseholdAction = {
  type: 'ALIGN_HOUSEHOLD_MEMBERS';
  payload: { aantalMensen: number; aantalVolwassen: number };
};

export type UpdateMemberFieldAction = {
  type: 'UPDATE_MEMBER_FIELD';
  payload: {
    index: number;
    field: keyof Member;
    value: any;
    meta?: { phase?: 'change' | 'blur' };
  };
};


export type FormAction =
  | SetPageDataAction
  | LoadSavedStateAction
  | SetUserIdAction
  | ResetStateAction
  | AlignHouseholdAction
  | UpdateMemberFieldAction;

export type FormContextValue = {
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
};

// Helper: speciale status bij >5 adults
const checkSpecialStatus = (leden: Member[]): boolean => {
  const adultCount = leden.filter((m) => m.memberType === 'adult').length;
  return adultCount > 5;
};

// ============================================================================
// REDUCER
// ============================================================================
const formReducer: React.Reducer<FormState, FormAction> = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_PAGE_DATA': {
           const { pageId, data } = action;
      return {
        ...state,
        [pageId]: {
          ...(state[pageId] ?? {}),
          ...data,
        },
      };
    }

<<<<<<< Updated upstream
    

      case 'UPDATE_MEMBER_FIELD': {
        const { index, field, value, meta } = action.payload;
        const current = Array.isArray(state?.C4?.leden) ? (state.C4!.leden as Member[]) : [];
        if (index < 0 || index >= current.length) return state;
      
        const isBlur = meta?.phase === 'blur';
        let updatedMember = { ...current[index] };
      
        if (field === 'naam') {
          // onChange: rauw opslaan; onBlur: schoon opslaan
          updatedMember.naam = isBlur ? cleanName(value, 25) : String(value ?? '');
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
          isSpecialStatus: checkSpecialStatus(nextLeden),
          C4: { ...(state.C4 ?? {}), leden: nextLeden },
        };
      }
      

=======
    case 'UPDATE_MEMBER_FIELD': {
      const { index, field, value, meta } = action.payload;
      const current = Array.isArray(state?.C4?.leden) ? (state.C4!.leden as Member[]) : [];
      if (index < 0 || index >= current.length) return state;
<<<<<<< Updated upstream
    
      const isBlur = meta?.phase === 'blur';
      let updatedMember = { ...current[index] };
    
      if (field === 'naam') {
        // onChange: rauw opslaan; onBlur: schoon opslaan
=======

      const isBlur = meta?.phase === 'blur';
      let updatedMember: Member = { ...current[index] };

      if (field === 'naam') {
        // onChange -> rauw opslaan (cursor blijft stabiel)
        // onBlur -> schoon opslaan (emoji/whitespace/trim)
>>>>>>> Stashed changes
        updatedMember.naam = isBlur ? cleanName(value, 25) : String(value ?? '');
      } else if (field === 'dateOfBirth') {
        const val = typeof value === 'string' ? value.trim() : '';
        updatedMember.dateOfBirth = val || undefined;
        updatedMember.leeftijd = val ? (calculateAge(val) ?? undefined) : undefined;
      } else {
        (updatedMember as any)[field] = value;
      }
    
      const nextLeden = current.map((m, i) => (i === index ? updatedMember : m));
<<<<<<< Updated upstream
    
=======
>>>>>>> Stashed changes
      return {
        ...state,
        isSpecialStatus: checkSpecialStatus(nextLeden),
        C4: { ...(state.C4 ?? {}), leden: nextLeden },
      };
    }
>>>>>>> Stashed changes

    case 'ALIGN_HOUSEHOLD_MEMBERS': {
      const { aantalMensen, aantalVolwassen } = action.payload;
      const current = state?.C4?.leden;
      const aligned = alignMembers(current, aantalMensen, aantalVolwassen);
<<<<<<< Updated upstream

      console.log('[REDUCER] ALIGN start', {
        currentLen: Array.isArray(current) ? current.length : 0,
        payload: { aantalMensen, aantalVolwassen }
      });

      console.log('[REDUCER] ALIGN done', {
        alignedLen: aligned.length,
        adultsCount: aligned.filter(m => m.memberType === 'adult').length,
        childrenCount: aligned.filter(m => m.memberType === 'child').length
      });

=======
>>>>>>> Stashed changes
      return {
        ...state,
        isSpecialStatus: checkSpecialStatus(aligned),
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
      return state;
  }
};

// ============================================================================
// PROVIDER
// ============================================================================
const FormContext = React.createContext<FormContextValue | undefined>(undefined);

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  const [state, dispatch] = React.useReducer<FormState, FormAction>(formReducer, {} as FormState);
=======
  const [state, dispatch] = React.useReducer(formReducer, {} as FormState);
>>>>>>> Stashed changes
=======
  const [state, dispatch] = React.useReducer(formReducer, {} as FormState);
>>>>>>> Stashed changes

  const hasHydratedRef = React.useRef(false);

  // 1) Hydrate
  React.useEffect(() => {
    let isMounted = true;
    const hydrate = async () => {
      try {
        const persisted = await Storage.loadState();
        if (persisted && isMounted) {
          dispatch({ type: 'LOAD_SAVED_STATE', data: persisted });
        }
      } finally {
        if (isMounted) hasHydratedRef.current = true;
      }
    };
    hydrate();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2) Persist (debounced)
  const saveTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(() => {
    if (!hasHydratedRef.current) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      Promise.resolve()
        .then(() => Storage.saveState(state))
        .catch((e) => {
          if (__DEV__) console.warn('Storage.saveState failed:', e);
        });
    }, 400);
    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
        saveTimer.current = null;
      }
    };
  }, [state]);

  const value = React.useMemo<FormContextValue>(() => ({ state, dispatch }), [state]);
  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

// ============================================================================
// HOOK
// ============================================================================
export const useFormContext = (): FormContextValue => {
  const context = React.useContext(FormContext);
  if (!context) throw new Error('useFormContext must be used within FormProvider');
  return context;
};