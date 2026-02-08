import { selectHouseholdStats } from "@ui/selectors/householdSelectors";
import { DATA_KEYS } from "@domain/constants/datakeys";
import { createMockState } from "@test-utils/index";

// 2. Top-level helper
const setupTestState = (aantalVolwassen: number) => {
  return createMockState({
    data: {
      [DATA_KEYS.SETUP]: {
        aantalMensen: aantalVolwassen,
        aantalVolwassen: aantalVolwassen,
        autoCount: 'Geen',
      },
      [DATA_KEYS.HOUSEHOLD]: {
        members: Array(aantalVolwassen)
          .fill(null)
          .map((_, i) => ({
            entityId: `m${i}`,
            naam: `Lid ${i + 1}`,
            memberType: 'adult',
          })),
      },
    },
  });
};

describe('WAI-003: Household Selectors', () => {
  it('moet de geconsolideerde household stats ophalen', () => {
    const state = setupTestState(2);
    const stats = selectHouseholdStats(state);
    expect(stats).toBeDefined();
    // Voeg hier nieuwe asserts toe voor selectHouseholdStats
  });

  /* TODO: Migreren naar nieuwe architectuur. 
  De onderstaande selectors zijn verhuisd of hernoemd naar het Domain.

  describe('Special Status Logic', () => {
    it('moet true teruggeven voor 6 adults (Project Eis 2025)', () => {
      const mockState = setupTestState(6);
      // expect(selectIsSpecialStatus(mockState)).toBe(true);
    });
  });

  describe('Household Label Selector', () => {
    it('moet het juiste label tonen voor partners', () => {
      const state = setupTestState(2);
      // expect(selectHouseholdTypeLabel(state)).toBe(HOUSEHOLD_STATUS.PARTNERS);
    });
  });
  */
});
