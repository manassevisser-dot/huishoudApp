// src/app/hooks/useAppOrchestration.ts
import { useEffect, useMemo } from 'react'; // Voeg useMemo toe
import { useForm } from '@context/FormContext';
import { storage } from '@adapters/storage/storage';

export interface PhoenixEnvelopeV2 {
  version: string;
  payload: any;
  timestamp: string;
}

/**
 * Orchestrator Hook: Beheert de initiële data-load en synchronisatie.
 * Fix 1: Voorkomt infinite loops door specifiek op de payload te monitoren.
 */
export const useAppOrchestration = (envelope?: PhoenixEnvelopeV2) => {
  const { state, dispatch } = useForm();

  useEffect(() => {
    const initApp = async () => {
      if (envelope?.payload) {
        dispatch({ type: 'UPDATE_DATA', payload: envelope.payload });
        return;
      }

      const saved = await storage.loadState();
      if (saved) {
        const dataToLoad = (saved as any).data || saved;
        dispatch({ type: 'UPDATE_DATA', payload: dataToLoad });
      }
    };

    initApp();
  }, [dispatch, envelope?.payload]);

  /**
   * Verbeterde Status Logica
   * 1. HYDRATING: We hebben nog geen schemaversie (app start net op).
   * 2. ONBOARDING: Geen data OF setup niet voltooid (activeStep is niet 'COMPLETED').
   * 3. READY: Setup is voltooid en data is valide.
   */
  const status = useMemo(() => {
    // A. Laden
    if (!state.schemaVersion) {
      return 'HYDRATING';
    }

    // B. Check of we data van buitenaf hebben (Envelope)
    // Als er een envelope is met payload, beschouwen we de setup als voltooid
    const isExternalData = !!envelope?.payload;

    // C. Check of de interne setup voltooid is
    const isInternalSetupDone =
      state.data?.household?.members?.length > 0 &&
      (state.activeStep === 'dashboard' || state.activeStep === 'completed');

    // Als geen van beide waar is -> ONBOARDING
    if (!isExternalData && !isInternalSetupDone) {
      return 'ONBOARDING';
    }

    // D. Is de data bruikbaar?
    return state.isValid ? 'READY' : 'INCOMPLETE';
  }, [
    state.schemaVersion,
    state.data?.household?.members,
    state.activeStep,
    state.isValid,
    envelope?.payload,
  ]);

  return {
    state,
    dispatch,
    status,
  };
};
