// src/app/context/FormContext.tsx
import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  ReactNode,
} from 'react';

import { formReducer, type FormAction } from '@app/state/formReducer';
import { useStableOrchestrator } from './useStableOrchestrator';
import type { FormState } from '@core/types/core';
import { initialFormState } from '@app/state/initialFormState';

/**
 * FormContext - React State Integration
 * * VERANTWOORDELIJKHEDEN:
 * ✅ useReducer als Single Source of Truth
 * ✅ Orchestrator instantiatie met getState + dispatch
 * ✅ Orchestrator exposen via context
 */

interface FormContextType {
  state: FormState;
  dispatch: (action: FormAction) => void;
  orchestrator: ReturnType<typeof useStableOrchestrator>;
}

export const FormContext = createContext<FormContextType | undefined>(undefined);

interface FormProviderProps {
  children: ReactNode;
  initialState?: FormState;
  mockDispatch?: (action: FormAction) => void;
}

export const FormProvider: React.FC<FormProviderProps> = ({
  children,
  initialState = initialFormState,
  mockDispatch,
}) => {
  // 1) useReducer (SSOT)
  const [state, reactDispatch] = useReducer(formReducer, initialState);

  // 2) Mockable dispatch
  const dispatch = useMemo(() => {
    if (typeof mockDispatch === 'function') return mockDispatch;
    return reactDispatch;
  }, [mockDispatch]);

  // 3) Stabiele orchestrator
  // VERWIJDERD: 'styles' argument. De orchestrator haalt zijn regels 
  // nu zelf uit het domein via de SectionStyleFactory.
  const orchestrator = useStableOrchestrator(state, dispatch);

  // 4) Context value
  const value = useMemo(
    () => ({ state, dispatch, orchestrator }),
    [state, dispatch, orchestrator]
  );

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

// Hook
export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within FormProvider');
  }
  return context;
};

// Re-exports
export type { FormState } from '@core/types/core';
export type { FormAction } from '@app/state/formReducer';