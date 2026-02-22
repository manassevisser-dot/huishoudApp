// src/domain/rules/conditions.test.ts
import {
    isPensionAge,
    showIncomeSection,
    isChildUnder15,
    hasChildren,
    isWoningType,
    getAutoCountValue,
    isAdultInputVisible,
    calculateChildrenCount,
    isDebugEnabled,
    canNavigateNext,
    canNavigateBack,
  } from './conditions'; // ⬅️ aangepast naar het juiste bronbestand
  import type { TimeProvider } from '@domain/helpers/TimeProvider';
  
  // Types voor casts in tests (we willen niet heel de core types importeren)
  type MemberLike = {
    categories?: Record<string, boolean>;
    dob?: string | Date | null | undefined;
  };
  
  // Minimal TimeProvider stub
  const makeProvider = (iso: string): TimeProvider => {
    const [y, m, d] = iso.split('-').map(Number);
    return {
      getCurrentLocalNoon: () => new Date(y, m - 1, d, 12, 0, 0, 0),
    };
  };
  
  // Kleine helper
  const d = (iso: string) => {
    const [y, m, day] = iso.split('-').map(Number);
    return new Date(y, m - 1, day, 12, 0, 0, 0);
  };
  
  describe('conditions helpers', () => {
    describe('isPensionAge', () => {
      test('>= 67 is pensioenleeftijd', () => {
        expect(isPensionAge(67)).toBe(true);
        expect(isPensionAge(80)).toBe(true);
      });
      test('< 67 is geen pensioenleeftijd', () => {
        expect(isPensionAge(66)).toBe(false);
        expect(isPensionAge(0)).toBe(false);
      });
    });
  
    describe('showIncomeSection', () => {
      test('geeft true als categorie expliciet true is', () => {
        const m: MemberLike = { categories: { loon: true, uitkering: false } };
        expect(showIncomeSection(m as any, 'loon')).toBe(true);
      });
      test('geeft false als categorie ontbreekt of niet true is', () => {
        const m: MemberLike = { categories: { uitkering: false } };
        expect(showIncomeSection(m as any, 'loon')).toBe(false);
        expect(showIncomeSection({} as any, 'loon')).toBe(false);
      });
    });
  
    describe('isChildUnder15', () => {
      test('< 15 is kind', () => {
        expect(isChildUnder15(0)).toBe(true);
        expect(isChildUnder15(14)).toBe(true);
      });
      test('>= 15 is geen kind onder 15', () => {
        expect(isChildUnder15(15)).toBe(false);
        expect(isChildUnder15(30)).toBe(false);
      });
    });
  
    describe('hasChildren', () => {
      const provider = makeProvider('2026-02-15'); // vaste "vandaag"
  
      test('true wanneer een lid minderjarig is (dob als Date)', () => {
        // Minderjarig: geboren 2008-12-01 (op 2026-02-15 nog geen 18)
        const members: MemberLike[] = [
          { dob: d('1990-01-01') },
          { dob: d('2008-12-01') }, // minderjarig
        ];
        expect(hasChildren(members as any, provider)).toBe(true);
      });
  
      test('true wanneer een lid minderjarig is (dob als geldige string)', () => {
        const members: MemberLike[] = [{ dob: '2008-12-01' }]; // geldig ISO‑formaat
        expect(hasChildren(members as any, provider)).toBe(true);
      });
  
      test('false wanneer alle leden meerderjarig zijn', () => {
        const members: MemberLike[] = [{ dob: d('2000-01-01') }, { dob: d('1999-05-05') }];
        expect(hasChildren(members as any, provider)).toBe(false);
      });
  
      test('ignoreren van lege of ongeldige dob strings', () => {
        const members: MemberLike[] = [{ dob: '' }, { dob: '31-12-2020' }, { dob: null }];
        expect(hasChildren(members as any, provider)).toBe(false);
      });
    });
  
    describe('isWoningType', () => {
      test('true als huidige en target woningType gelijk zijn', () => {
        expect(isWoningType('Huur' as any, 'Huur' as any)).toBe(true);
      });
      test('false als ze verschillen', () => {
        expect(isWoningType('Huur' as any, 'Koop' as any)).toBe(false);
      });
    });
  
    describe('getAutoCountValue', () => {
      test('mapt "Geen" naar 0', () => {
        expect(getAutoCountValue('Geen' as any)).toBe(0);
      });
      test('mapt "Een" naar 1', () => {
        expect(getAutoCountValue('Een' as any)).toBe(1);
      });
      test('mapt "Twee" naar 2', () => {
        expect(getAutoCountValue('Twee' as any)).toBe(2);
      });
      test('onbekend → fail-safe 0', () => {
        expect(getAutoCountValue('Drie' as any)).toBe(0);
        expect(getAutoCountValue(undefined as any)).toBe(0);
      });
    });
  
    describe('isAdultInputVisible', () => {
      test('true als aantalMensen > 0', () => {
        expect(isAdultInputVisible(1 as any)).toBe(true);
        expect(isAdultInputVisible(3 as any)).toBe(true);
      });
      test('false als aantalMensen = 0', () => {
        expect(isAdultInputVisible(0 as any)).toBe(false);
      });
    });
  
    describe('calculateChildrenCount', () => {
      test('children = max(0, mensen - volwassenen)', () => {
        expect(calculateChildrenCount(4, 2)).toBe(2);
        expect(calculateChildrenCount(2, 2)).toBe(0);
        expect(calculateChildrenCount(1, 3)).toBe(0); // kan niet negatief
      });
    });
  
    describe('isDebugEnabled', () => {
      test('true alleen bij flag === true', () => {
        expect(isDebugEnabled(true)).toBe(true);
        expect(isDebugEnabled(false)).toBe(false);
      });
    });
  
    describe('canNavigateNext / canNavigateBack', () => {
      // Stel 4 stappen (index 0..3) → total = 4
      test('canNavigateNext: true zolang current < total - 1', () => {
        expect(canNavigateNext(0, 4)).toBe(true);
        expect(canNavigateNext(2, 4)).toBe(true);
        expect(canNavigateNext(3, 4)).toBe(false); // laatste
      });
  
      test('canNavigateBack: true zolang current > 0', () => {
        expect(canNavigateBack(0)).toBe(false);
        expect(canNavigateBack(1)).toBe(true);
        expect(canNavigateBack(3)).toBe(true);
      });
    });
  });
  