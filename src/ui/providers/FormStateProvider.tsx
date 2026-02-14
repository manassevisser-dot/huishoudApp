import React, { createContext, useContext, useMemo, useReducer, type ReactNode } from 'react';
import { formReducer, type FormAction } from '@app/state/formReducer';
import type { FormState } from '@core/types/core';
import { initialFormState } from '@app/state/initialFormState';

type FormStateContextType = {
  state: FormState;
  dispatch: (action: FormAction) => void;
};

const FormStateContext = createContext<FormStateContextType | undefined>(undefined);

export function FormStateProvider({
  children,
  initialState = initialFormState,
  mockDispatch,
}: {
  children: ReactNode;
  initialState?: FormState;
  mockDispatch?: (action: FormAction) => void;
}) {
  // 1) useReducer – SSOT voor UI-state
  const [state, reactDispatch] = useReducer(formReducer, initialState);

  // 2) Mockable dispatch (alleen voor tests)
  const dispatch = useMemo(() => (typeof mockDispatch === 'function' ? mockDispatch : reactDispatch), [mockDispatch, reactDispatch]);

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);
  return <FormStateContext.Provider value={value}>{children}</FormStateContext.Provider>;
}

export function useFormState(): FormStateContextType {
  const ctx = useContext(FormStateContext);
  if (ctx === undefined) throw new Error('useFormState must be used within <FormStateProvider>');
  return ctx;
}

// Re-exports for ergonomics
export type { FormState } from '@core/types/core';
export type { FormAction } from '@app/state/formReducer';