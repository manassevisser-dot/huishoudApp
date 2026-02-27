// src/app/orchestrators/ORCH-SW-001.test.ts
/**
 * TEST: ORCH-SW-001 — updateField schrijft correct naar FormState
 *
 * Patroon: echte reducer-koppeling via stateRef-closure.
 * mockDispatch (jest.fn) updatet de state niet — vervangen door formReducer.
 */
import { FormStateOrchestrator } from './FormStateOrchestrator';
import { formReducer, type FormAction } from '@app/state/formReducer';
import { initialFormState } from '@app/state/initialFormState';
import type { FormState } from '@core/types/core';

// ─── Helper: stateRef-closure met echte reducer ───────────────────────────────

const createOrchestrator = (setupOverrides: Partial<FormState['data']['setup']> = {}) => {
  let stateRef: FormState = {
    ...initialFormState,
    data: {
      ...initialFormState.data,
      setup: {
        ...initialFormState.data.setup,
        ...setupOverrides,
      },
    },
  };

  const getState = () => stateRef;
  const dispatch = (action: FormAction) => {
    stateRef = formReducer(stateRef, action);
  };

  return new FormStateOrchestrator(getState, dispatch);
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('ORCH-SW-001: updateField(fieldId, value)', () => {
  test('updates aantalMensen correctly', () => {
    const orchestrator = createOrchestrator({ aantalMensen: 0 });

    orchestrator.updateField('aantalMensen', 5);

    expect(orchestrator.getValue('aantalMensen')).toBe(5);
  });

  test('updates autoCount correctly', () => {
    const orchestrator = createOrchestrator({ autoCount: 'Geen' });

    orchestrator.updateField('autoCount', 'Twee');

    expect(orchestrator.getValue('autoCount')).toBe('Twee');
  });

  test('updates heeftHuisdieren correctly', () => {
    const orchestrator = createOrchestrator({ heeftHuisdieren: true });

    orchestrator.updateField('heeftHuisdieren', false);

    expect(orchestrator.getValue('heeftHuisdieren')).toBe(false);
  });
});
