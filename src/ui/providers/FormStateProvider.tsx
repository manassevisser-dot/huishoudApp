/**
 * @file_intent Beheert en distribueert de UI-state van het formulier (zoals `activeStep` en veld-waarden) over de gehele componentenboom. Het fungeert als de "Single Source of Truth" voor de UI-laag.
 * @repo_architecture UI Layer - State Management. Dit is een React Context Provider die gebruikmaakt van een `reducer` (`formReducer`) om state-transities op een voorspelbare manier af te handelen.
 * @term_definition
 *   - `Provider`: Een React-component (`FormStateProvider`) dat de state en een `dispatch`-functie beschikbaar stelt aan alle onderliggende componenten.
 *   - `Hook`: Een custom hook (`useFormState`) die componenten een eenvoudige manier geeft om de state en de `dispatch`-functie te consumeren.
 *   - `Reducer`: Een pure functie (`formReducer`) die de state-logica centraliseert. Het neemt de huidige state en een `action` en retourneert een nieuwe state.
 *   - `Dispatch`: De functie die gebruikt wordt om `actions` naar de `reducer` te sturen, wat de enige manier is om de state te wijzigen.
 * @contract Componenten binnen de `FormStateProvider` kunnen de `useFormState()` hook aanroepen om de `state` (alleen-lezen) en `dispatch` (schrijf-actie) te verkrijgen. Directe mutatie van de state is onmogelijk; alle wijzigingen moeten via de `dispatch`-functie gaan met een gedefinieerde `FormAction`.
 * @ai_instruction Om toegang te krijgen tot de formulier-state in een component, gebruik je de `useFormState` hook. Om de state te wijzigen, `dispatch` je een `action`. Voeg nieuwe state-properties toe aan de `FormState` type-definitie en handel de bijbehorende acties af in de `formReducer`. Dit bestand zelf hoeft zelden gewijzigd te worden; de logica zit in de `formReducer` en de `initialFormState`.
 */
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