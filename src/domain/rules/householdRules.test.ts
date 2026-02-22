// src/domain/rules/householdRules.test.ts
import {
    getHouseholdStatus,
    HOUSEHOLD_CLASSIFICATION,
    classifyHouseholdType,
    isSpecialInvestigationRequired,
  } from './householdRules';
  
  // Minimal Member-like type voor deze tests (we willen core types niet binnenhalen)
  type MemberLike = {
    id?: string;
    firstName?: string | null;
    lastName?: string | null;
    dateOfBirth?: Date | string | null;
  };
  
  const m = (overrides: Partial<MemberLike> = {}): MemberLike => ({
    id: 'm-1',
    firstName: 'Jan',
    lastName: 'Jansen',
    dateOfBirth: new Date(1990, 0, 1, 12, 0, 0, 0),
    ...overrides,
  });
  
  describe('householdRules', () => {
    describe('getHouseholdStatus', () => {
      it('empty: geen members', () => {
        expect(getHouseholdStatus([] as any)).toBe('empty');
      });
  
      it('partial: er zijn members, maar geen enkel compleet (naam/DOB ontbreken)', () => {
        const members: MemberLike[] = [
          m({ firstName: '', dateOfBirth: null }),
          m({ firstName: '   ', dateOfBirth: undefined }),
        ];
        expect(getHouseholdStatus(members as any)).toBe('empty'); // let op: geen enkel lid compleet ⇒ empty
      });
  
      it('partial: mix van incomplete en complete leden', () => {
        const members: MemberLike[] = [
          m({ firstName: '   ', dateOfBirth: new Date(2000, 1, 1) }), // geen naam ⇒ incomplete
          m({ firstName: 'Sara', dateOfBirth: new Date(2010, 5, 5) }), // compleet
        ];
        expect(getHouseholdStatus(members as any)).toBe('partial');
      });
  
      it('complete: alle leden hebben non-empty firstName en een DOB (null/undefined niet toegestaan)', () => {
        const members: MemberLike[] = [
          m({ firstName: 'Jan', dateOfBirth: new Date(1980, 3, 10) }),
          m({ firstName: 'Eva', dateOfBirth: new Date(1985, 7, 20) }),
        ];
        expect(getHouseholdStatus(members as any)).toBe('complete');
      });
  
      it('string DOB mag (niet-null/undefined), wordt als “aanwezig” gezien', () => {
        const members: MemberLike[] = [
          m({ firstName: 'Piet', dateOfBirth: '1988-10-05' }),
        ];
        expect(getHouseholdStatus(members as any)).toBe('complete');
      });
  
      it('whitespace namen worden niet geaccepteerd (trim)', () => {
        const members: MemberLike[] = [
          m({ firstName: '   Jan   ', dateOfBirth: new Date(1999, 9, 9) }),
          m({ firstName: '   ', dateOfBirth: new Date(2001, 1, 1) }),
        ];
        // eerste compleet, tweede niet → partial
        expect(getHouseholdStatus(members as any)).toBe('partial');
      });
    });
  
    describe('classifyHouseholdType', () => {
      it('adultCount > 5 ⇒ SPECIAL', () => {
        expect(classifyHouseholdType(6)).toBe(HOUSEHOLD_CLASSIFICATION.SPECIAL);
        expect(classifyHouseholdType(10)).toBe(HOUSEHOLD_CLASSIFICATION.SPECIAL);
      });
  
      it('adultCount === 2 ⇒ PARTNERS', () => {
        expect(classifyHouseholdType(2)).toBe(HOUSEHOLD_CLASSIFICATION.PARTNERS);
      });
  
      it('alle overige waarden ⇒ SINGLE (0,1,3,4,5)', () => {
        [0, 1, 3, 4, 5].forEach((n) => {
          expect(classifyHouseholdType(n)).toBe(HOUSEHOLD_CLASSIFICATION.SINGLE);
        });
      });
    });
  
    describe('isSpecialInvestigationRequired', () => {
      it('true bij adultCount > 5, anders false', () => {
        expect(isSpecialInvestigationRequired(6)).toBe(true);
        expect(isSpecialInvestigationRequired(5)).toBe(false);
        expect(isSpecialInvestigationRequired(0)).toBe(false);
      });
    });
  });