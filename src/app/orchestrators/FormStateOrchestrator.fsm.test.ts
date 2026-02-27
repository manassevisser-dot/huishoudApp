// src/app/orchestrators/FormStateOrchestrator.fsm.test.ts
/**
 * TEST: FSM Enforcement (CU-P2-01)
 * Doel: Valideer dat alle state-wijzigingen via dispatch/reducer gaan.
 *
 * Patroon: stateRef-closure met echte formReducer.
 * - FormStateOrchestrator bezit geen .state property — vergelijking via captured ref.
 * - Directe dispatch met FIELD_CHANGED bestaat niet in reducer → updateField() gebruiken.
 * - Geen side-effects buiten de closure.
 */
import { FormStateOrchestrator } from '@app/orchestrators/FormStateOrchestrator';
import { formReducer, type FormAction } from '@app/state/formReducer';
import { initialFormState } from '@app/state/initialFormState';
import type { FormState } from '@core/types/core';

// ─── Setup ────────────────────────────────────────────────────────────────────

describe('FSM Enforcement', () => {
  let stateRef: FormState;
  let orchestrator: FormStateOrchestrator;

  beforeEach(() => {
    stateRef = {
      ...initialFormState,
      data: {
        ...initialFormState.data,
        setup: {
          ...initialFormState.data.setup,
          aantalMensen: 1,
          aantalVolwassen: 1,
          autoCount: 'Geen',
          heeftHuisdieren: false,
        },
        household: { members: [] },
        finance: {
          income: { items: [] },
          expenses: { items: [] },
        },
      },
    };

    const getState = () => stateRef;
    const dispatch = (action: FormAction) => {
      stateRef = formReducer(stateRef, action);
    };

    orchestrator = new FormStateOrchestrator(getState, dispatch);
  });

  // ─── Tests ─────────────────────────────────────────────────────────────────

  it('moet state ongewijzigd laten bij leesoperatie (getValue)', () => {
    const before = orchestrator.getValue('aantalMensen');
    const after = orchestrator.getValue('aantalMensen');
    expect(before).toBe(after);
  });

  it('moet state immutabel updaten via dispatch (aantalMensen)', () => {
    const originalRef = stateRef;

    orchestrator.updateField('aantalMensen', 3);

    // formReducer retourneert een nieuw object → stateRef is vervangen
    expect(stateRef).not.toBe(originalRef);
    expect(orchestrator.getValue('aantalMensen')).toBe(3);
  });

  it('moet pad-resolutie via façade gebruiken (autoCount)', () => {
    const originalRef = stateRef;

    orchestrator.updateField('autoCount', 'Twee');

    expect(stateRef).not.toBe(originalRef);
    expect(orchestrator.getValue('autoCount')).toBe('Twee');
  });

  it('moet fail-closed bij onbekend fieldId', () => {
    const originalRef = stateRef;

    // Onbekend veld → StateWriterAdapter dispatcht niets → stateRef ongewijzigd
    orchestrator.updateField('onbekendVeld_xyz', 'test');

    expect(stateRef).toBe(originalRef);
  });
});
