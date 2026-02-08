/**
 * TEST: FSM Enforcement (CU-P2-01)
 * Doel: Valideer dat alle state-wijzigingen via dispatch/reducer gaan.
 * Geen directe mutaties toegestaan.
 */
import { FormStateOrchestrator } from '../FormStateOrchestrator';
import { initialFormState } from '@context/initialFormState';

// 🔥 FIX: type van initialFormState automatisch afleiden
type InitialFormState = typeof initialFormState;

describe('FSM Enforcement', () => {
  let initialState: InitialFormState;
  let orchestrator: FormStateOrchestrator;

  beforeEach(() => {
    initialState = {
      ...initialFormState,                 // behoud volledige vorm
      schemaVersion: '1.0',
      activeStep: 'setup',
      currentPageId: 'page1',
      isValid: true,
      data: {
        ...initialFormState.data,
        setup: {
          ...initialFormState.data.setup,
          aantalMensen: 1,
          aantalVolwassen: 1,
          autoCount: 'Geen',
          heeftHuisdieren: false,
        },
        household: {
          members: [],
        },
        finance: {
          income: { items: [] },
          expenses: { items: [] },
        },
      },
      meta: {
        lastModified: new Date().toISOString(),
        version: 1,
      },
    };

    orchestrator = new FormStateOrchestrator(() => initialState, () => {});
  });

  it('moet state ongewijzigd laten bij leesoperatie (getValue)', () => {
    const before = orchestrator.getValue('aantalMensen');
    const after = orchestrator.getValue('aantalMensen');
    expect(before).toBe(after);
  });

  it('moet state immutabel updaten via dispatch (aantalMensen)', () => {
    const originalStateRef = (orchestrator as any).state;

    (orchestrator as any).dispatch({
      type: 'FIELD_CHANGED',
      fieldId: 'aantalMensen',
      value: 3,
    });

    const newStateRef = (orchestrator as any).state;
    const updatedValue = orchestrator.getValue('aantalMensen');

    expect(newStateRef).not.toBe(originalStateRef);
    expect(updatedValue).toBe(3);
  });

  it('moet pad-resolutie via façade gebruiken (autoCount)', () => {
    const originalStateRef = (orchestrator as any).state;

    (orchestrator as any).dispatch({
      type: 'FIELD_CHANGED',
      fieldId: 'autoCount',
      value: 'Twee',
    });

    const newStateRef = (orchestrator as any).state;
    const updatedValue = orchestrator.getValue('autoCount');

    expect(newStateRef).not.toBe(originalStateRef);
    expect(updatedValue).toBe('Twee');
  });

  it('moet fail-closed bij onbekend fieldId', () => {
    const originalStateRef = (orchestrator as any).state;

    (orchestrator as any).dispatch({
      type: 'FIELD_CHANGED',
      fieldId: 'onbekendVeld',
      value: 'test',
    });

    const newStateRef = (orchestrator as any).state;

    // State mag niet veranderen
    expect(newStateRef).toBe(originalStateRef);
  });
});