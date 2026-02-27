// src/domain/rules/householdRules.test.ts
import { 
  isHouseholdComplete, 
  getHouseholdStatus, 
  isSpecialInvestigationRequired,
} from './householdRules';
import type { Member } from '@core/types/core';

describe('householdRules', () => {
  // Definieer constanten lokaal (omdat ze niet geëxporteerd zijn)
  const SPECIAL_THRESHOLD = 5;
  const PARTNER_THRESHOLD = 2;

  // Helper om members te maken met type-safe null/undefined — gedeeld door alle describe-blokken
  const createMember = (overrides: Partial<Member>): Member => {
    const base: Member = {
      entityId: '1',
      name: 'Jan',
      dob: '1990-01-01',
      age: 34,
      gender: 'man',
      burgerlijkeStaat: 'gehuwd',
      nettoSalaris: 3000,
    } as Member;
    return { ...base, ...overrides };
  };

  // =========================================================================
  // isHouseholdComplete
  // =========================================================================

  describe('isHouseholdComplete', () => {
    it('should return false for null members', () => {
      expect(isHouseholdComplete(null as any)).toBe(false);
    });

    it('should return false for undefined members', () => {
      expect(isHouseholdComplete(undefined as any)).toBe(false);
    });

    it('should return false for empty members array', () => {
      expect(isHouseholdComplete([])).toBe(false);
    });

    it('should return true when all members have name and dob', () => {
      const members: Member[] = [
        createMember({ entityId: '1', name: 'Jan', dob: '1990-01-01' }),
        createMember({ entityId: '2', name: 'Piet', dob: '1985-05-15' }),
      ];

      expect(isHouseholdComplete(members)).toBe(true);
    });

    it('should return false when a member has empty name', () => {
      const members: Member[] = [
        createMember({ entityId: '1', name: 'Jan', dob: '1990-01-01' }),
        createMember({ entityId: '2', name: '', dob: '1985-05-15' }),
      ];

      expect(isHouseholdComplete(members)).toBe(false);
    });

    it('should return false when a member has null name', () => {
      const members: Member[] = [
        createMember({ entityId: '1', name: 'Jan', dob: '1990-01-01' }),
        createMember({ entityId: '2', name: null as any, dob: '1985-05-15' }),
      ];

      expect(isHouseholdComplete(members)).toBe(false);
    });

    it('should return false when a member has undefined name', () => {
      const members: Member[] = [
        createMember({ entityId: '1', name: 'Jan', dob: '1990-01-01' }),
        createMember({ entityId: '2', name: undefined, dob: '1985-05-15' }),
      ];

      expect(isHouseholdComplete(members)).toBe(false);
    });

    it('should return false when a member has empty dob', () => {
      const members: Member[] = [
        createMember({ entityId: '1', name: 'Jan', dob: '1990-01-01' }),
        createMember({ entityId: '2', name: 'Piet', dob: '' }),
      ];

      expect(isHouseholdComplete(members)).toBe(false);
    });

    it('should return false when a member has null dob', () => {
      const members: Member[] = [
        createMember({ entityId: '1', name: 'Jan', dob: '1990-01-01' }),
        createMember({ entityId: '2', name: 'Piet', dob: null as any }),
      ];

      expect(isHouseholdComplete(members)).toBe(false);
    });

    it('should return false when a member has undefined dob', () => {
      const members: Member[] = [
        createMember({ entityId: '1', name: 'Jan', dob: '1990-01-01' }),
        createMember({ entityId: '2', name: 'Piet', dob: undefined }),
      ];

      expect(isHouseholdComplete(members)).toBe(false);
    });

    it('should filter out members with null entityId', () => {
      const members: Member[] = [
        createMember({ entityId: '1', name: 'Jan', dob: '1990-01-01' }),
        createMember({ entityId: null as any, name: 'Piet', dob: '1985-05-15' }),
      ];

      expect(isHouseholdComplete(members)).toBe(true);
    });

    it('should filter out members with undefined entityId', () => {
      const members: Member[] = [
        createMember({ entityId: '1', name: 'Jan', dob: '1990-01-01' }),
        createMember({ entityId: undefined, name: 'Piet', dob: '1985-05-15' }),
      ];

      expect(isHouseholdComplete(members)).toBe(true);
    });
  });

  // =========================================================================
  // getHouseholdStatus
  // =========================================================================

  describe('getHouseholdStatus', () => {
    it('should return "default" for null members', () => {
      expect(getHouseholdStatus(null as any)).toBe('default');
    });

    it('should return "default" for undefined members', () => {
      expect(getHouseholdStatus(undefined as any)).toBe('default');
    });

    it('should return "default" for empty array', () => {
      expect(getHouseholdStatus([])).toBe('default');
    });

    it('should return "default" for 1 member', () => {
      const members: Member[] = [createMember({ entityId: '1' })];
      expect(getHouseholdStatus(members)).toBe('default');
    });

    it(`should return "partner" for exactly ${PARTNER_THRESHOLD} members`, () => {
      const members: Member[] = [
        createMember({ entityId: '1' }),
        createMember({ entityId: '2' }),
      ];
      expect(getHouseholdStatus(members)).toBe('partner');
    });

    it('should return "partner" for 3 members', () => {
      const members: Member[] = [
        createMember({ entityId: '1' }),
        createMember({ entityId: '2' }),
        createMember({ entityId: '3' }),
      ];
      expect(getHouseholdStatus(members)).toBe('partner');
    });

    it('should return "partner" for 4 members', () => {
      const members: Member[] = [
        createMember({ entityId: '1' }),
        createMember({ entityId: '2' }),
        createMember({ entityId: '3' }),
        createMember({ entityId: '4' }),
      ];
      expect(getHouseholdStatus(members)).toBe('partner');
    });

    it(`should return "special" for exactly ${SPECIAL_THRESHOLD} members`, () => {
      const members: Member[] = [
        createMember({ entityId: '1' }),
        createMember({ entityId: '2' }),
        createMember({ entityId: '3' }),
        createMember({ entityId: '4' }),
        createMember({ entityId: '5' }),
      ];
      expect(getHouseholdStatus(members)).toBe('special');
    });

    it('should return "special" for more than SPECIAL_THRESHOLD members', () => {
      const members: Member[] = [
        createMember({ entityId: '1' }),
        createMember({ entityId: '2' }),
        createMember({ entityId: '3' }),
        createMember({ entityId: '4' }),
        createMember({ entityId: '5' }),
        createMember({ entityId: '6' }),
      ];
      expect(getHouseholdStatus(members)).toBe('special');
    });
  });

  // =========================================================================
  // isSpecialInvestigationRequired
  // =========================================================================

  describe('isSpecialInvestigationRequired', () => {
    it('should return 0 for count below threshold', () => {
      expect(isSpecialInvestigationRequired(SPECIAL_THRESHOLD - 1)).toBe(0);
    });

    it('should return 0 for count 0', () => {
      expect(isSpecialInvestigationRequired(0)).toBe(0);
    });

    it('should return 0 for negative count', () => {
      expect(isSpecialInvestigationRequired(-5)).toBe(0);
    });

    it(`should return ${SPECIAL_THRESHOLD} for count exactly threshold`, () => {
      expect(isSpecialInvestigationRequired(SPECIAL_THRESHOLD)).toBe(SPECIAL_THRESHOLD);
    });

    it('should return count for count above threshold', () => {
      expect(isSpecialInvestigationRequired(10)).toBe(10);
    });

    it('should return count for large numbers', () => {
      expect(isSpecialInvestigationRequired(100)).toBe(100);
    });
  });

  // =========================================================================
  // Constante verificatie
  // =========================================================================

  describe('constants', () => {
    it('should have correct SPECIAL_THRESHOLD value', () => {
      expect(SPECIAL_THRESHOLD).toBe(5);
    });

    it('should have correct PARTNER_THRESHOLD value', () => {
      expect(PARTNER_THRESHOLD).toBe(2);
    });
  });
});