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
});
