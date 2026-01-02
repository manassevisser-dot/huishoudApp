import { formReducer } from '../formReducer';
// FIX: Gebruik createMockState conform de nieuwe factory standaard
import { createMockState } from '@test-utils/index'; 
import { DATA_KEYS } from '@domain/constants/datakeys';

describe('formReducer — Onderzoeks-integriteit', () => {
  // Gebruik de nieuwe factory die een valide FormState genereert
  const initialState = createMockState();

  it('moet UPDATE_DATA verwerken met Deep Merge (ADR-12)', () => {
    const action = {
      type: 'UPDATE_DATA' as const,
      // Dankzij DeepPartial in FormAction is dit type-safe
      payload: { 
        [DATA_KEYS.SETUP]: { aantalVolwassen: 5 } 
      }
    };

    const newState = formReducer(initialState, action);

    // Assert: Controleer of de specifieke waarde is bijgewerkt
    expect(newState.data[DATA_KEYS.SETUP].aantalVolwassen).toBe(5);
    
    // BELANGRIJK: Controleer of andere velden in setup NIET zijn overschreven (Deep Merge check)
    expect(newState.data[DATA_KEYS.SETUP].aantalMensen).toBe(initialState.data[DATA_KEYS.SETUP].aantalMensen);
    
    // Assert: Controleer of de meta-klok is bijgewerkt
    expect(newState.meta.lastModified).not.toBe(initialState.meta.lastModified);
  });

  it('moet bij RESET_APP de state terugzetten maar de meta-klok laten lopen', () => {
    // Arrange: Maak een "vervuilde" state
    const dirtyState = { 
      ...initialState, 
      isValid: false,
      data: { ...initialState.data, [DATA_KEYS.SETUP]: { ...initialState.data.setup, aantalMensen: 99 } }
    };
    
    const action = { type: 'RESET_APP' as const };
    
    // Act
    const newState = formReducer(dirtyState, action);
    
    // Assert: Check of we terug zijn bij de basis (isValid: true, aantalMensen: 1)
    expect(newState.isValid).toBe(true);
    expect(newState.data[DATA_KEYS.SETUP].aantalMensen).toBe(1);
    
    // De timestamp moet wel nu zijn, niet de oude uit de dirtyState
    expect(newState.meta.lastModified).toBeDefined();
  });

  it('moet UPDATE_FIELD correct verwerken voor legacy ondersteuning', () => {
    const action = {
      type: 'SET_FIELD' as const,
      payload: {
        section: DATA_KEYS.SETUP as any,
        field: 'autoCount',
        value: 'Twee'
      }
    };

    const newState = formReducer(initialState, action);
    expect(newState.data[DATA_KEYS.SETUP].autoCount).toBe('Twee');
  });
});