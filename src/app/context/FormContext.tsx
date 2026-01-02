import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { FormState, FormAction } from '../../shared-types/form';
import { formReducer } from './formReducer';

/**
 * Initial State conform de nieuwe SSOT (Single Source of Truth)
 */
export const initialState: FormState = {
  schemaVersion: '1.0',
  activeStep: 'LANDING',
  currentPageId: 'setup',
  isValid: true,
  data: {
    setup: { 
      aantalMensen: 1,
      aantalVolwassen: 1, 
      autoCount: 'Nee' 
    },
    household: { 
      members: [] 
    },
    finance: {
      income: { items: [], totalAmount: 0 },
      expenses: { items: [], totalAmount: 0 }
    }
  },
  meta: {
    lastModified: new Date().toISOString(),
    version: 1
  }
};

/**
 * Context definitie
 */
/**
 * Context definitie (Nu geëxporteerd voor test-utils)
 */
export const FormContext = createContext<{
  state: FormState;
  dispatch: React.Dispatch<FormAction>;
} | undefined>(undefined);

/**
 * Provider Component
 */
export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(formReducer, initialState);

  return (
    <FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>
  );
};

/**
 * Hooks & Exports
 */
export const useForm = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};

// De gevraagde alias voor legacy code ondersteuning
export const useFormContext = useForm;