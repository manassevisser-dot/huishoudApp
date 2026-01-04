import { formReducer } from '../formReducer';
import { createMockState } from '@test-utils/index'; 
import { DATA_KEYS } from '@domain/constants/datakeys';

describe('formReducer — Onderzoeks-integriteit', () => {
  // We definiëren de mockState één keer bovenaan binnen de describe
  const initialState = createMockState();

  it('moet UPDATE_DATA verwerken met Deep Merge (ADR-12)', () => {
    const action = {
      type: 'UPDATE_DATA' as const,
      payload: { 
        [DATA_KEYS.SETUP]: { aantalVolwassen: 5 } 
      }
    };
    const newState = formReducer(initialState, action as any);
    expect(newState.data[DATA_KEYS.SETUP].aantalVolwassen).toBe(5);
    expect(newState.meta.lastModified).not.toBe(initialState.meta.lastModified);
  });

  it('moet bij RESET_APP de state terugzetten naar default', () => {
    const dirtyState = { 
      ...initialState, 
      data: { ...initialState.data, [DATA_KEYS.SETUP]: { aantalMensen: 99 } }
    };
    const action = { type: 'RESET_APP' as const };
    const newState = formReducer(dirtyState as any, action as any);
    
    expect(newState.data[DATA_KEYS.SETUP].aantalMensen).toBe(1);
  });

  it('moet SYNC_MEMBERS verwerken (Regel 33)', () => {
    // Branch 1: Geldige payload
    const actionWithData = { 
      type: 'SYNC_MEMBERS' as const, 
      payload: [{ id: 'm1', name: 'Nieuw Lid' }] 
    };
    const stateWithData = formReducer(initialState, actionWithData as any);
    expect(stateWithData).toBeDefined();

    // Branch 2: Missende payload (om die laatste branch op regel 33 te vangen)
    const actionEmpty = { type: 'SYNC_MEMBERS' as const, payload: undefined };
    const stateEmpty = formReducer(initialState, actionEmpty as any);
    expect(stateEmpty).toEqual(initialState);
  });

  it('moet de huidige state retourneren bij een onbekend actietype (Default Branch)', () => {
    const action = { type: 'INVALID_ACTION' };
    const state = formReducer(initialState, action as any);
    expect(state).toBe(initialState);
  });
  it('moet SET_STEP verwerken en de meta-klok laten tikken (Regel 33)', () => {
    const action = { 
      type: 'SET_STEP' as const, 
      payload: 2 
    };

    const newState = formReducer(initialState, action as any);

    // Assert: Stap moet aangepast zijn
    expect(newState.activeStep).toBe(2);
    
    // Assert: Hier wordt meta wél bijgewerkt!
    expect(newState.meta.lastModified).not.toBe(initialState.meta.lastModified);
  });
  it('moet UPDATE_FIELD verwerken voor legacy ondersteuning', () => {
    const action = {
      type: 'SET_FIELD' as const,
      payload: {
        section: DATA_KEYS.SETUP,
        field: 'autoCount',
        value: 'Twee'
      }
    };
    const newState = formReducer(initialState, action as any);
    expect(newState.data[DATA_KEYS.SETUP].autoCount).toBe('Twee');
  });
});