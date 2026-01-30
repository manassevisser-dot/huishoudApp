// src/app/context/FormContext.tsx
import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
} from 'react';

import { formReducer } from './formReducer';

// Re-export FormState type (SSOT voor het formuliertype)
export type { FormState } from '@shared-types/form';
import type { FormState } from '@shared-types/form';

/**
 * Belangrijk:
 * - GEEN FormAction importeren uit elders.
 * - Leid het action-type direct af uit je eigen reducer, zodat
 *   context/Provider/mocks *altijd* hetzelfde type gebruiken.
 */
type ReducerAction = Parameters<typeof formReducer>[1];   // = FormAction uit formReducer
type AppDispatch = (action: ReducerAction) => void;

// ─────────────────────────────────────────────────────────────────────────────
// SSOT: initialFormState (Landing als startpunt; wizard pas na user-actie)
// Let op: vorm sluit aan op je huidige core-typen (income/expenses met items[]).
// ─────────────────────────────────────────────────────────────────────────────
export const initialFormState: FormState = {
  schemaVersion: '1.0',
  activeStep: 'LANDING',
  currentPageId: 'landing',
  isValid: true,
  data: {
    setup: {
      aantalMensen: 1,
      aantalVolwassen: 1,
      autoCount: 'Nee',
      heeftHuisdieren: false,
      // woningType kan hier later worden toegevoegd als het in de core-typen staat
    },
    household: {
      members: [],
      // huurtoeslag/zorgtoeslag kun je toevoegen als dit in je FormState-type staat
    },
    finance: {
      income: { items: [] },
      expenses: { items: [] }, // sluit aan op core.ts (items en evt. optioneel totalAmount)
    },
  },
  meta: {
    lastModified: new Date().toISOString(),
    version: 1,
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Context definitie
// ─────────────────────────────────────────────────────────────────────────────
interface FormContextType {
  state: FormState;
  dispatch: AppDispatch;
}

export const FormContext = createContext<FormContextType | undefined>(undefined);

// ─────────────────────────────────────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────────────────────────────────────
export const FormProvider: React.FC<{
  children: ReactNode;
  initialState: FormState;
  /** Optionele mock in tests; mag afwijken qua interne functie-signature. */
  mockDispatch?: AppDispatch;
}> = ({ children, initialState, mockDispatch }) => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  // ✅ ESLint: strict-boolean-expressions — expliciete null/undefined check
  const hasMock = typeof mockDispatch === 'function';
  const activeDispatch: AppDispatch = hasMock
    ? (action) => (mockDispatch as AppDispatch)(action)
    : (action) => dispatch(action);

  return (
    <FormContext.Provider value={{ state, dispatch: activeDispatch }}>
      {children}
    </FormContext.Provider>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────────────────────────────────────
export const useForm = () => {
  const context = useContext(FormContext);
  // ✅ ESLint: strict-boolean-expressions — expliciete undefined check
  if (context === undefined) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};