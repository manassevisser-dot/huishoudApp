/**
 * @file_intent Beheert en distribueert de UI-state van het formulier (zoals `activeStep` en veld-waarden) over de gehele componentenboom. Het fungeert als de "Single Source of Truth" voor de UI-laag.
 * @repo_architecture UI Layer - State Management. Dit is een React Context Provider die gebruikmaakt van een `reducer` (`formReducer`) om state-transities op een voorspelbare manier af te handelen.
 * @term_definition
 *   - `Provider`: Een React-component (`FormStateProvider`) dat de state en een `dispatch`-functie beschikbaar stelt aan alle onderliggende componenten.
 *   - `Hook`: Een custom hook (`useFormState`) die componenten een eenvoudige manier geeft om de state en de `dispatch`-functie te consumeren.
 *   - `Reducer`: Een pure functie (`formReducer`) die de state-logica centraliseert. Het neemt de huidige state en een `action` en retourneert een nieuwe state.
 *   - `Dispatch`: De functie die gebruikt wordt om `actions` naar de `reducer` te sturen, wat de enige manier is om de state te wijzigen.
 *   - `isHydrated`: Boolean die aangeeft of de AsyncStorage-load voltooid is. Zolang false: app toont niets (voorkomt flicker van initialFormState).
 * @contract Componenten binnen de `FormStateProvider` kunnen de `useFormState()` hook aanroepen om de `state` (alleen-lezen) en `dispatch` (schrijf-actie) te verkrijgen. Directe mutatie van de state is onmogelijk; alle wijzigingen moeten via de `dispatch`-functie gaan met een gedefinieerde `FormAction`.
 * @ai_instruction
 *   Hydration gebeurt exact een keer bij mount via useHydration().
 *   Auto-save triggert alleen bij wijzigingen in state.data of state.meta.lastModified via useAutoSave().
 *   Auto-save triggert NIET bij HYDRATE dispatch (isHydrated guard in useAutoSave voorkomt dit).
 *   Bij RESET_APP: PersistenceAdapter.clear() aanroepen zodat opgeslagen state ook gewist wordt.
 *   Om later van AsyncStorage naar MMKV te migreren: alleen PersistenceAdapter.ts aanpassen.
 */
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from 'react';
import { formReducer, type FormAction } from '@app/state/formReducer';
import type { FormState } from '@core/types/core';
import { initialFormState } from '@app/state/initialFormState';
import * as PersistenceAdapter from '@adapters/system/PersistenceAdapter';

type FormStateContextType = {
  state: FormState;
  dispatch: (action: FormAction) => void;
};

const FormStateContext = createContext<FormStateContextType | undefined>(undefined);

// --- Private hooks -----------------------------------------------------------
// Niet geëxporteerd - implementatiedetail van deze module.

/**
 * Laadt opgeslagen state uit AsyncStorage exact een keer bij mount.
 * Bij null (eerste start of corrupt): blijft op initialFormState staan.
 * Markeert isHydratedRef NA dispatch zodat auto-save niet triggert op HYDRATE.
 */
function useHydration(
  dispatch: (action: FormAction) => void,
  isHydratedRef: React.MutableRefObject<boolean>,
): void {
  useEffect(() => {
    let cancelled = false;

    async function hydrate(): Promise<void> {
      const persisted = await PersistenceAdapter.load();

      if (cancelled) return;

      if (persisted !== null) {
        dispatch({
          type: 'HYDRATE',
          payload: {
            data: persisted.data as FormState['data'],
            meta: persisted.meta,
          },
        });
      }

      isHydratedRef.current = true;
    }

    void hydrate();

    return () => {
      cancelled = true;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Bewust leeg: hydration hoort exact een keer te lopen bij mount
}

/**
 * Slaat state op bij elke echte data-mutatie.
 * Triggert NIET bij hydration (isHydratedRef guard) of navigatie-wijzigingen.
 * state.meta.lastModified verandert bij elke reducer-actie - dat is de trigger.
 */
function useAutoSave(
  state: FormState,
  isHydratedRef: React.MutableRefObject<boolean>,
): void {
  useEffect(() => {
    if (!isHydratedRef.current) return;

    void PersistenceAdapter.save(state);
  // Bewust: alleen state.data en state.meta.lastModified als dependency.
  // Navigatie (activeStep, currentScreenId) en viewModels worden niet opgeslagen.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.data, state.meta.lastModified]);
}

// --- Provider ----------------------------------------------------------------

export function FormStateProvider({
  children,
  initialState = initialFormState,
  mockDispatch,
}: {
  children: ReactNode;
  initialState?: FormState;
  mockDispatch?: (action: FormAction) => void;
}) {
  const [state, reactDispatch] = useReducer(formReducer, initialState);

  // Mockable dispatch - alleen voor tests
  const dispatch = useMemo(
    () => (typeof mockDispatch === 'function' ? mockDispatch : reactDispatch),
    [mockDispatch, reactDispatch],
  );

  const isHydratedRef = useRef(false);

  useHydration(dispatch, isHydratedRef);
  useAutoSave(state, isHydratedRef);

  const value = useMemo(() => ({ state, dispatch }), [state, dispatch]);

  return (
    <FormStateContext.Provider value={value}>
      {children}
    </FormStateContext.Provider>
  );
}

// --- Consumer hook -----------------------------------------------------------

export function useFormState(): FormStateContextType {
  const ctx = useContext(FormStateContext);
  if (ctx === undefined) {
    throw new Error('useFormState must be used within <FormStateProvider>');
  }
  return ctx;
}

// Re-exports voor ergonomics
export type { FormState } from '@core/types/core';
export type { FormAction } from '@app/state/formReducer';
