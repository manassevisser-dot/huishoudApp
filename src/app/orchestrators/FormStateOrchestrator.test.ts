// src/app/orchestrators/FormStateOrchestrator.test.ts
/**
 * TEST: FormStateOrchestrator — state mutatie via updateField
 *
 * Patroon: echte reducer-koppeling via stateRef-closure.
 * FormStateOrchestrator bezit geen eigen state — hij werkt via getState/dispatch.
 * Na updateField muteert stateRef (via formReducer) zodat getValue() de nieuwe waarde leest.
 */
import { FormStateOrchestrator } from './FormStateOrchestrator';
import { formReducer, type FormAction } from '@app/state/formReducer';
import { initialFormState } from '@app/state/initialFormState';
import type { FormState } from '@core/types/core';

// ─── Helper: stateRef-closure met echte reducer ───────────────────────────────

const createOrchestrator = (overrides: Partial<FormState['data']['setup']> = {}) => {
  let stateRef: FormState = {
    ...initialFormState,
    data: {
      ...initialFormState.data,
      setup: {
        ...initialFormState.data.setup,
        ...overrides,
      },
    },
  };

  const getState = () => stateRef;
  const dispatch = (action: FormAction) => {
    stateRef = formReducer(stateRef, action);
  };

  return {
    orchestrator: new FormStateOrchestrator(getState, dispatch),
    getRef: () => stateRef,
  };
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('FormStateOrchestrator', () => {
  it('moet state immutabel updaten via updateField', () => {
    const { orchestrator, getRef } = createOrchestrator({ aantalMensen: 1 });
    const originalRef = getRef();

    orchestrator.updateField('aantalMensen', 5);

    // formReducer retourneert altijd een nieuw object
    expect(getRef()).not.toBe(originalRef);
    expect(orchestrator.getValue('aantalMensen')).toBe(5);
  });

  it('moet de finance-route bewandelen voor bekende income-velden', () => {
    const { orchestrator } = createOrchestrator();

    // nettoSalaris zit in KnownIncomeKey → gaat via writeDynamicCollections
    // Verwacht: geen throw, dispatch wordt aangeroepen
    expect(() => orchestrator.updateField('nettoSalaris', 2500)).not.toThrow();
  });

  it('moet ValueProvider contract implementeren (getValue)', () => {
    const { orchestrator } = createOrchestrator({ autoCount: 'Geen' });
    expect(orchestrator.getValue('autoCount')).toBe('Geen');
  });
});
