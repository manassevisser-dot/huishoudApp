// 1. Imports
import {
  selectIsSpecialStatus,
  selectHouseholdTypeLabel,
  HOUSEHOLD_STATUS,
  selectHouseholdDataIntegrityStatus,
} from '@selectors/householdSelectors';
import { DATA_KEYS } from '@domain/constants/datakeys';
import { createMockState } from '@test-utils/index';

// 2. Top-level helper
const setupTestState = (aantalVolwassen: number) => {
  return createMockState({
    data: {
      [DATA_KEYS.SETUP]: {
        aantalMensen: aantalVolwassen,
        aantalVolwassen: aantalVolwassen,
        autoCount: 'Nee',
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

// 3. De Tests
describe('WAI-003: Household Selectors', () => {
  describe('Special Status Logic', () => {
    it('moet true teruggeven voor 6 adults (Project Eis 2025)', () => {
      const mockState = setupTestState(6);
      expect(selectIsSpecialStatus(mockState)).toBe(true);
    });

    it('moet false teruggeven voor 2 adults', () => {
      const mockState = setupTestState(2);
      expect(selectIsSpecialStatus(mockState)).toBe(false);
    });

    it('moet false teruggeven bij een lege state', () => {
      const mockState = setupTestState(0);
      expect(selectIsSpecialStatus(mockState)).toBe(false);
    });
  });

  describe('Household Label Selector', () => {
    it('moet het juiste label tonen voor partners (2 volwassenen)', () => {
      const state = setupTestState(2);
      expect(selectHouseholdTypeLabel(state)).toBe(HOUSEHOLD_STATUS.PARTNERS);
    });

    it('moet het label SPECIAL tonen bij meer dan 5 volwassenen', () => {
      const state = setupTestState(10);
      expect(selectHouseholdTypeLabel(state)).toBe(HOUSEHOLD_STATUS.SPECIAL);
    });

    it('moet het label SINGLE tonen bij 1 volwassene', () => {
      const state = setupTestState(1);
      expect(selectHouseholdTypeLabel(state)).toBe(HOUSEHOLD_STATUS.SINGLE);
    });
  });
});
describe('Data Integrity Selector', () => {
  it('moet de integriteitsstatus ophalen voor de aanwezige leden (Regel 47)', () => {
    // We maken een state met 3 leden
    const state = setupTestState(3);

    const status = selectHouseholdDataIntegrityStatus(state);

    // De selector geeft de resultaten van getHouseholdStatus terug
    // We verwachten dat er in ieder geval een resultaat uitkomt (bijv. 'VALID' of een object)
    expect(status).toBeDefined();
  });
});
describe('GM-010: Household Selector Snapshots', () => {
  it('moet een consistente mapping van stats en labels behouden', () => {
    const scenarios = [0, 1, 2, 5, 6, 10];

    const results = scenarios.map((count) => {
      const state = setupTestState(count);
      return {
        adultCount: count,
        isSpecial: selectIsSpecialStatus(state),
        label: selectHouseholdTypeLabel(state),
        // We checken ook de integriteitsscore structuur
        integrity: selectHouseholdDataIntegrityStatus(state),
      };
    });

    expect(results).toMatchSnapshot();
  });
});
