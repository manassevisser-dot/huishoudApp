import { selectIsSpecialStatus } from '../../selectors/householdSelectors';
import { DATA_KEYS } from '@domain/constants/datakeys';
import { createMockState } from '@test-utils/index'; // ✅ Gebruik de centrale factory

describe('WAI-003: Household Selectors', () => {
  /**
   * ✅ UNIFIED FIX: We gebruiken createMockState om de hiërarchie te bewaken.
   * Dit zorgt ervoor dat we alleen de velden hoeven te overschrijven die 
   * relevant zijn voor de test (DeepPartial support).
   */
  const setupTestState = (aantalVolwassen: number) => {
    return createMockState({
      data: {
        [DATA_KEYS.SETUP]: { 
          aantalMensen: aantalVolwassen, // Zorg dat totaal matcht met volwassenen
          aantalVolwassen: aantalVolwassen,
          autoCount: 'Nee' 
        },
        [DATA_KEYS.HOUSEHOLD]: {
          members: Array(aantalVolwassen).fill(null).map((_, i) => ({
            entityId: `m${i}`,
            naam: `Lid ${i + 1}`,
            memberType: 'adult',
          }))
        }
      }
    });
  };

  it('moet true teruggeven voor 6 adults (Project Eis 2025)', () => {
    // Arrange
    const mockState = setupTestState(6);
    
    // Act & Assert
    expect(selectIsSpecialStatus(mockState)).toBe(true);
  });

  it('moet false teruggeven voor 2 adults', () => {
    // Arrange
    const mockState = setupTestState(2);
    
    // Act & Assert
    expect(selectIsSpecialStatus(mockState)).toBe(false);
  });

  it('moet false teruggeven bij een lege state', () => {
    // Arrange
    const mockState = setupTestState(0);
    
    // Act & Assert
    expect(selectIsSpecialStatus(mockState)).toBe(false);
  });
});