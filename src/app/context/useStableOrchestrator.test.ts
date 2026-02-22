// src/app/context/useStableOrchestrator.test.ts

import { renderHook } from '@testing-library/react-native';
import { useStableOrchestrator } from './useStableOrchestrator';
import { initialFormState } from '@app/state/initialFormState';
import type { FormState } from '@core/types/core';

describe('useStableOrchestrator', () => {
  const mockDispatch = jest.fn();
  const state: FormState = JSON.parse(JSON.stringify(initialFormState));

  it('retourneert een instantie die voldoet aan MasterOrchestratorAPI', () => {
    const { result } = renderHook(() =>
      useStableOrchestrator(state, mockDispatch)
    );

    const orchestrator = result.current;

    // We testen hier de publieke oppervlakte (MasterOrchestratorAPI)
    expect(orchestrator).toBeDefined();
    
    // Test top-level methoden
    expect(typeof orchestrator.updateField).toBe('function');
    expect(typeof orchestrator.handleCsvImport).toBe('function');
    expect(typeof orchestrator.canNavigateNext).toBe('function');
    expect(typeof orchestrator.onNavigateNext).toBe('function');
    expect(typeof orchestrator.onNavigateBack).toBe('function');

    // Test Facades/Sub-interfaces
    expect(orchestrator.ui).toBeDefined();
    expect(orchestrator.theme).toBeDefined();
    expect(orchestrator.navigation).toBeDefined();
  });

  it('behoudt dezelfde referentie bij een re-render van de hook', () => {
    // Definieer de interface voor de props van deze specifieke renderHook
    interface HookProps {
      s: FormState;
      d: jest.Mock;
    }

    const { result, rerender } = renderHook(
      ({ s, d }: HookProps) => useStableOrchestrator(s, d),
      {
        initialProps: { s: state, d: mockDispatch },
      }
    );

    const firstRenderRef = result.current;

    // Forceer een re-render met een 'nieuwe' state (maar zelfde dispatch)
    rerender({ s: { ...state }, d: mockDispatch });

    // De referentie moet exact hetzelfde zijn (stabiliteit check)
    expect(result.current).toBe(firstRenderRef);
  });

  it('geeft calls door aan het onderliggende systeem (updateField)', () => {
    const localDispatch = jest.fn();
    const { result } = renderHook(() =>
      useStableOrchestrator(state, localDispatch)
    );

    // Actie: update een veld
    result.current.updateField('aantalMensen', 10);

    // Verifieer: Is de dispatch aangeroepen? 
    // (Dit bewijst dat de "bedrading" in de file werkt)
    expect(localDispatch).toHaveBeenCalled();
  });

  it('leest na rerender de actuele state via de stabiele orchestrator-instantie', () => {
    interface HookProps {
      s: FormState;
      d: jest.Mock;
    }

    const firstState: FormState = JSON.parse(JSON.stringify(initialFormState));
    const secondState: FormState = {
      ...firstState,
      data: {
        ...firstState.data,
        setup: {
          ...firstState.data.setup,
          aantalMensen: 42,
        },
      },
    };

    const { result, rerender } = renderHook(
      ({ s, d }: HookProps) => useStableOrchestrator(s, d),
      {
        initialProps: { s: firstState, d: mockDispatch },
      }
    );

    const firstRef = result.current;
    rerender({ s: secondState, d: mockDispatch });

    expect(result.current).toBe(firstRef);

    const withInternals = result.current as unknown as {
      fso: { getState: () => FormState };
    };
    expect(withInternals.fso.getState().data.setup.aantalMensen).toBe(42);
  });
});
