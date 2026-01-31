/**
 * TEST: FSM Enforcement (CU-P2-01)
 * Doel: Valideer dat alle state-wijzigingen via dispatch/reducer gaan.
 * Geen directe mutaties toegestaan.
 */
import { FormStateOrchestrator } from '../FormStateOrchestrator';
import type { FormState } from '@shared-types/form';

describe('FSM Enforcement', () => {
  let initialState: FormState;
  let orchestrator: FormStateOrchestrator;

  beforeEach(() => {
    initialState = {
      schemaVersion: '1.0.0', // Toegevoegd
      activeStep: 'setup',    // Toegevoegd
      currentPageId: 'page1', // Toegevoegd
      isValid: true,          // Toegevoegd
      data: {
        setup: {
          aantalMensen: 1,
          aantalVolwassen: 1,
          autoCount: 'Nee',
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
      meta: { lastModified: new Date().toISOString(), version: 1 }, // Toegevoegd
    };
    orchestrator = new FormStateOrchestrator(initialState);
  });

  it('moet state ongewijzigd laten bij leesoperatie (getValue)', () => {
    const before = orchestrator.getValue('aantalMensen');
    const after = orchestrator.getValue('aantalMensen');
    expect(before).toBe(after);
    // Geen mutatie → object identity mag gelijk zijn
  });

  it('moet state immutabel updaten via dispatch (aantalMensen)', () => {
    const originalStateRef = (orchestrator as any).state;

    // Act
    (orchestrator as any).dispatch({
      type: 'FIELD_CHANGED',
      fieldId: 'aantalMensen',
      value: 3,
    });

    const newStateRef = (orchestrator as any).state;
    const updatedValue = orchestrator.getValue('aantalMensen');

    // Assert
    expect(newStateRef).not.toBe(originalStateRef); // Immutability
    expect(updatedValue).toBe(3);
  });

  it('moet pad-resolutie via façade gebruiken (autoCount)', () => {
    // Arrange
    const originalStateRef = (orchestrator as any).state;

    // Act
    (orchestrator as any).dispatch({
      type: 'FIELD_CHANGED',
      fieldId: 'autoCount',
      value: 'Twee',
    });

    const newStateRef = (orchestrator as any).state;
    const updatedValue = orchestrator.getValue('autoCount');

    // Assert
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