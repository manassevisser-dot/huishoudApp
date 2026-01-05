import { useState, useEffect, useMemo } from 'react';

/** Phoenix envelope v2 + V1.0 schema */
type PhoenixEnvelopeV2 = {
  version: 2;
  state: {
    schemaVersion: '1.0';
    data?: {
      setup?: { aantalMensen?: number; aantalVolwassen?: number };
      household?: { members?: Array<any> };
      finance?: Record<string, unknown>;
    };
  };
};

/** Legacy state definitie */
type LegacyStateLike = {
  schemaVersion?: string;
  data?: {
    setup?: { aantalMensen?: number; aantalVolwassen?: number };
    household?: { members?: Array<any> };
    finance?: Record<string, unknown>;
  };
} | null;

/** Status types — 'ONBOARDING' vervangt 'UNBOARDING' voor consistentie */
type OrchestrationStatus = 'HYDRATING' | 'ONBOARDING' | 'READY' | 'ERROR';

export type SyncPayload = {
  aantalMensen: number;
  aantalVolwassen: number;
};

/** Type guards voor veilige state detectie */
const isPhoenixV2 = (x: unknown): x is PhoenixEnvelopeV2 =>
  !!x && typeof x === 'object' && (x as any).version === 2 && (x as any).state?.schemaVersion === '1.0';

const isLegacyV1State = (x: unknown): x is LegacyStateLike =>
  !!x && typeof x === 'object' && (x as any).schemaVersion === '1.0';

export const useAppOrchestration = (
  loadState: PhoenixEnvelopeV2 | LegacyStateLike | undefined,
  dispatch?: (action: { type: string; payload?: unknown }) => void
) => {
  const [status, setStatus] = useState<OrchestrationStatus>('HYDRATING');

  /** * Memoized payload voor huishoud-synchronisatie. 
   * Haalt data op uit zowel de v2 envelope als legacy v1 state.
   */
  const syncPayload: SyncPayload = useMemo(() => {
    const setup = (
      isPhoenixV2(loadState) ? loadState.state.data?.setup : 
      (loadState && isLegacyV1State(loadState)) ? loadState.data?.setup : 
      undefined
    ) ?? {};

    return {
      aantalMensen: Number(setup.aantalMensen ?? 0),
      aantalVolwassen: Number(setup.aantalVolwassen ?? 0),
    };
  }, [loadState]);

  useEffect(() => {
    // 1. Wachten op data (Hydrating)
    if (typeof loadState === 'undefined') {
      setStatus('HYDRATING');
      return;
    }

    try {
      // 2. Geen opgeslagen data gevonden -> Start Onboarding
      if (loadState === null) {
        setStatus('ONBOARDING');
        return;
      }

      // 3. Valideer Phoenix v2 of Legacy v1 State
      if (isPhoenixV2(loadState) || isLegacyV1State(loadState)) {
        setStatus('READY');
        
        // Trigger automatische synchronisatie als de dispatch beschikbaar is
        if (dispatch) {
          dispatch({ type: 'SYNC_HOUSEHOLD', payload: syncPayload });
        }
        return;
      }

      // 4. Fallback bij onbekend formaat
      setStatus('ERROR');
    } catch (e) {
      setStatus('ERROR');
    }
  }, [loadState, dispatch, syncPayload]);

  /** Expliciete init functie voor handmatige controle */
  const init = () => {
    if (isPhoenixV2(loadState) || isLegacyV1State(loadState)) {
      setStatus('READY');
      if (dispatch) dispatch({ type: 'SYNC_HOUSEHOLD', payload: syncPayload });
    } else if (loadState === null) {
      setStatus('ONBOARDING');
    } else {
      setStatus(typeof loadState === 'undefined' ? 'HYDRATING' : 'ERROR');
    }
  };

  return { status, init, syncPayload };
};