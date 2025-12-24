// WAI-006A-Hook — AppStatus Orchestrator (FSM)
// --------------------------------------------
// Aliassen (Phoenix): @services, @state, @utils, @ui
// Let op: selectors/context via relatieve paden (geen @selectors alias)

import * as React from 'react';
import StorageShim from '@services/storageShim';
import { FormStateSchema, type FormStateV1 } from '@state/schemas/FormStateSchema';
import { selectIsSpecialStatus } from '../../selectors/householdSelectors';
import { useFormContext } from '@context/FormContext';

export type AppStatus = 'INITIALIZING' | 'HYDRATING' | 'UNBOARDING' | 'READY' | 'ERROR';

export function useAppOrchestration() {
  const { state, dispatch } = useFormContext();
  const [status, setStatus] = React.useState<AppStatus>('INITIALIZING');

  // Eén publieke actie voor ERROR-scherm
  const resetApp = React.useCallback(async () => {
    await StorageShim.clearAll();
    // Na reset starten we als nieuwe gebruiker
    setStatus('UNBOARDING');
    // Reducer cleanup (optioneel): breng state naar minimale vorm
    dispatch({ type: 'RESET_STATE' });
  }, [dispatch]);

  React.useEffect(() => {
    let mounted = true;
    async function hydrate() {
      if (!mounted) return;
      setStatus('HYDRATING');

      // 1) Load via uniforme API (Shim)
      const raw = await StorageShim.loadState();

      // 2) Branches: new user / corrupt / valid v1.0
      if (!raw) {
        if (!mounted) return;
        setStatus('UNBOARDING');
        return;
      }

      // 3) Validatie vóór READY (Zod gate)
      const parse = FormStateSchema.safeParse(raw);
      if (!parse.success) {
        if (!mounted) return;
        setStatus('ERROR');
        return;
      }

      const v1 = parse.data as FormStateV1;

      // 4) Dispatch gevalideerde state naar context
      dispatch({ type: 'LOAD_SAVED_STATE', data: v1 });

      // 5) Shadow flag precies éénmaal bij overgang naar READY
      try {
        const special = selectIsSpecialStatus({ ...state, ...v1 } as any);
        dispatch({ type: 'SET_SPECIAL_STATUS', payload: special });
      } catch {
        // selector niet kritisch; READY blijft leidend
      }

      if (!mounted) return;
      setStatus('READY');
    }

    // INITIALIZING duurt één render-tick
    Promise.resolve().then(hydrate);

    return () => {
      mounted = false;
    };
  }, [dispatch]); // deliberately not depending on 'state' to avoid extra ticks

  return { status, resetApp };
}
