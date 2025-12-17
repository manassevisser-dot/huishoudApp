// src/context/FormContext.tsx
import * as React from 'react';
import { Storage } from '../services/storage';
import { alignMembers } from '../services/householdAlign';

// React Native runtime note: use __DEV__ for dev-only logs; setTimeout/clearTimeout are globals.

// ============================================================================
// TYPES
// ============================================================================
type PageId = 'C1' | 'C4' | 'C7' | 'C10' | string;

export type SetPageDataAction = {
  type: 'SET_PAGE_DATA';
  pageId: PageId;
  data: Record<string, any>;
};

export type LoadSavedStateAction = {
  type: 'LOAD_SAVED_STATE';
  data: FormState;
};

export type SetUserIdAction = {
  type: 'SET_USER_ID';
  userId: string | null;
};

export type ResetStateAction = {
  type: 'RESET_STATE';
};

export type FormState = Record<string, any>;

export type FormContextValue = {
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
};

// (b) Voeg nieuw actietype toe en breid de union uit:
export type AlignHouseholdAction = {
  type: 'ALIGN_HOUSEHOLD_MEMBERS';
  payload: { aantalMensen: number; aantalVolwassen: number };
};

export type FormAction =
  | SetPageDataAction
  | LoadSavedStateAction
  | SetUserIdAction
  | ResetStateAction
  | AlignHouseholdAction;
// ============================================================================
// REDUCER
// ============================================================================
const formReducer = (state: FormState, action: FormAction): FormState => {
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

    case 'LOAD_SAVED_STATE':
      // Bewust shallow-merge: bestaande defaults blijven intact
      return { ...state, ...action.data };

    case 'SET_USER_ID':
      return { ...state, userId: action.userId };

    case 'RESET_STATE':
      // Reset betekent ook: lege basis
      return { userId: null };

    // (c) Voeg reducer-case toe in formReducer (boven default):
    case 'ALIGN_HOUSEHOLD_MEMBERS': {
      const { aantalMensen, aantalVolwassen } = action.payload;
      const current = state?.C4?.leden;
      const aligned = alignMembers(current, aantalMensen, aantalVolwassen);
      return {
        ...state,
        C4: { ...(state.C4 ?? {}), leden: aligned },
      };
    }

    default:
      return state;
  }
};

// ============================================================================
// CONTEXT & PROVIDER
// ============================================================================
const FormContext = React.createContext<FormContextValue | undefined>(undefined);

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = React.useReducer(formReducer, {} as FormState);

  // Guard tegen pre-hydrate saves
  const hasHydratedRef = React.useRef(false);

  /**
   * 1) Hydrate from storage (exact één keer bij mount)
   * Let op: in React 18 StrictMode kan useEffect 2x lopen in dev.
   * De hasHydratedRef + isMounted mitigeren dubbele writes.
   */
  React.useEffect(() => {
    let isMounted = true;

    const hydrate = async () => {
      try {
        const persisted = await Storage.loadState();
        if (persisted && isMounted) {
          dispatch({ type: 'LOAD_SAVED_STATE', data: persisted });
        }
      } finally {
        if (isMounted) {
          hasHydratedRef.current = true;
        }
      }
    };

    hydrate();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * 2) Persist on state change (na hydrate), met lichte debounce
   * - Fire-and-forget, zodat UI niet blokkeert
   * - Minimalistische error logging (alleen in dev)
   */
  const saveTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  React.useEffect(() => {
    if (!hasHydratedRef.current) return;

    // Debounce (~400ms): reduce I/O bij snelle updates
    if (saveTimer.current) {
      clearTimeout(saveTimer.current as ReturnType<typeof setTimeout>);
    }
    saveTimer.current = setTimeout(() => {
      // Fire-and-forget; geen await om UI responsief te houden
      Promise.resolve()
        .then(() => Storage.saveState(state))
        .catch((e) => {
          if (__DEV__) {
            console.warn('Storage.saveState failed:', e);
          }
        });
    }, 400);

    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current as ReturnType<typeof setTimeout>);
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
  if (!context) {
    throw new Error('useFormContext must be used within FormProvider');
  }
  return context;
};
