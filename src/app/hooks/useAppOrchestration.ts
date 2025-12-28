//useAppOrchestration.ts

// FIX A: Namespace import voor compatibiliteit
import * as React from 'react';
// FIX B: Gebruik de specifieke aliassen uit je config
import StorageShim from '@services/storageShim';
import { FormStateSchema } from '@state/schemas/FormStateSchema';
import { selectIsSpecialStatus } from '@selectors/householdSelectors';
import { useFormContext } from '@context/FormContext'; 

// Types
import type { FormStateV1 } from '@state/schemas/FormStateSchema';
export type AppStatus = 'INITIALIZING' | 'HYDRATING' | 'UNBOARDING' | 'READY' | 'ERROR';

export function useAppOrchestration() {
  const { state, dispatch } = useFormContext();
  const [status, setStatus] = React.useState<AppStatus>('INITIALIZING');

  const resetApp = React.useCallback(async () => {
    await StorageShim.clearAll();
    setStatus('UNBOARDING');
    dispatch({ type: 'RESET_STATE' });
  }, [dispatch]);

  React.useEffect(() => {
    let mounted = true;

    async function hydrate() {
      if (!mounted) return;
      setStatus('HYDRATING');

      try {
        const raw = await StorageShim.loadState();

        if (!raw) {
          if (mounted) setStatus('UNBOARDING');
          return;
        }

        const parse = FormStateSchema.safeParse(raw);
        if (!parse.success) {
          console.error('[Orchestrator] Validation failed', parse.error);
          if (mounted) setStatus('ERROR');
          return;
        }

        // Zod data is nu gegarandeerd FormStateV1
        const validatedData = parse.data as FormStateV1;

        dispatch({ type: 'LOAD_SAVED_STATE', payload: validatedData } as any);

        // Shadow flag: bereken op basis van de nieuwe werkelijkheid
        try {
          const special = selectIsSpecialStatus({ ...state, ...validatedData });
          dispatch({ type: 'SET_SPECIAL_STATUS', payload: special });
        } catch (e) {
          console.warn('[Orchestrator] Shadow flag calculation failed', e);
        }

        if (mounted) setStatus('READY');
      } catch (err) {
        console.error('[Orchestrator] Fatal hydration error', err);
        if (mounted) setStatus('ERROR');
      }
    }

    // Tick voor hydration start
    const timer = setTimeout(hydrate, 0);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [dispatch]); // Geen afhankelijkheid van 'state' conform ADR-16

  return { status, resetApp };
}