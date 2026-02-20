// src/app/context/FormContext.tsx
/**
 * @file_intent Integreert de globale applicatiestate met de React component-boom via de Context API.
 * @repo_architecture Mobile Industry (MI) - State Infrastructure Layer.
 * @term_definition FormProvider = De root-component die state en orchestrators beschikbaar stelt. useStableOrchestrator = Hook die garandeert dat de orchestrator-instantie stabiel blijft over renders heen.
 * @contract Beheert de lifecycle van de 'Single Source of Truth' (SSOT) middels useReducer. Exposeert zowel de ruwe state als de orchestrator-laag naar de UI-componenten.
 * @ai_instruction Dit is de lijm tussen de UI en de logica. Wijzigingen in de state-structuur of actie-types moeten hier worden gereflecteerd in de ContextType-definitie. Ondersteunt mockDispatch voor test-scenario's.
 */

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

  const orchestrator = useStableOrchestrator(state, dispatch);

  const value = useMemo(
    () => ({ state, dispatch, orchestrator }),
    [state, dispatch, orchestrator]
  );

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within FormProvider');
  }
  return context;
};

export type { FormState } from '@core/types/core';
export type { FormAction } from '@app/state/formReducer';