// src/domain/rules/ageBoundaryRules.test.ts
import { getAdultMaxISO, getChildMaxISO, calculateAge } from './ageBoundaryRules';

// We mocken DateHydrator om deterministische "vandaag 12:00" en parsing te krijgen.
jest.mock('@domain/helpers/DateHydrator', () => {
  // We maken "vandaag" vervangbaar per test via een variabele.
  let mockedToday = new Date('2026-02-15T12:00:00'); // default (jouw huidige datum/tijdzone is niet van invloed, we fixeren lokale noon)
  return {
    todayLocalNoon: () => new Date(mockedToday), // clone
    // Simpele parser: alleen YYYY-MM-DD is geldig, anders null
    isoDateOnlyToLocalNoon: (iso: string) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
      // Maak een lokale noon van die datum
      const [y, m, d] = iso.split('-').map(Number);
      return new Date(y, m - 1, d, 12, 0, 0, 0);
    },
    // helper om in tests "vandaag" te kunnen wisselen
    __setToday: (iso: string) => {
      const [y, m, d] = iso.split('-').map(Number);
      mockedToday = new Date(y, m - 1, d, 12, 0, 0, 0);
    },
  };
});

// Type augmentatie om __setToday te kunnen aanroepen
type HydratorMock = {
  todayLocalNoon: () => Date;
  isoDateOnlyToLocalNoon: (iso: string) => Date | null;
  __setToday: (iso: string) => void;
};

const Hydrator = jest.requireMock('@domain/helpers/DateHydrator') as HydratorMock;

describe('ageBoundaryRules helpers', () => {
  describe('getAdultMaxISO', () => {
    it('geeft (vandaag - 18 jaar) in YYYY-MM-DD, behoudt maand en dag', () => {
      Hydrator.__setToday('2026-02-15');
      expect(getAdultMaxISO()).toBe('2008-02-15');
    });

    it('werkt ook met expliciete referentiedatum', () => {
      const ref = new Date(2025, 6, 9, 12, 0, 0, 0); // 2025-07-09 local noon
      expect(getAdultMaxISO(ref)).toBe('2007-07-09');
    });
  });

  describe('getChildMaxISO', () => {
    it('is precies 1 dag vóór (vandaag - 18 jaar)', () => {
      Hydrator.__setToday('2026-02-15');
      expect(getChildMaxISO()).toBe('2008-02-14');
    });

    it('rolt correct terug naar vorige maand als dag=1 (month boundary)', () => {
      // 2025-03-01 → 18 jaar terug = 2007-03-01 → minus 1 dag = 2007-02-28
      Hydrator.__setToday('2025-03-01');
      expect(getChildMaxISO()).toBe('2007-02-28');
    });

    it('rolt correct bij schrikkeljaar-grens (1 maart → laatste dag februari)', () => {
      // 2024-03-01 → 18 jaar terug = 2006-03-01 → minus 1 dag = 2006-02-28 (2006 is geen schrikkeljaar)
      Hydrator.__setToday('2024-03-01');
      expect(getChildMaxISO()).toBe('2006-02-28');
    });
  });

  describe('calculateAge', () => {
    it('retourneert null bij ongeldige ISO YYYY-MM-DD string', () => {
      expect(calculateAge('15-02-2020')).toBeNull();
      expect(calculateAge('2020/02/15')).toBeNull();
      expect(calculateAge('')).toBeNull();
    });

    it('geeft exacte leeftijd in jaren — verjaardag vandaag', () => {
      // Vandaag 2026-02-15
      Hydrator.__setToday('2026-02-15');
      expect(calculateAge('2008-02-15')).toBe(18);
      expect(calculateAge('1990-02-15')).toBe(36);
    });

    it('neemt maand/dag mee — verjaardag morgen is nog niet gehaald', () => {
      Hydrator.__setToday('2026-02-15');
      expect(calculateAge('2008-02-16')).toBe(17); // morgen 18
      expect(calculateAge('1990-02-16')).toBe(35);
    });

    it('neemt maand/dag mee — verjaardag gisteren is al gehaald', () => {
      Hydrator.__setToday('2026-02-15');
      expect(calculateAge('2008-02-14')).toBe(18);
      expect(calculateAge('1990-02-14')).toBe(36);
    });

    it('randgeval: 29 feb (geboren op schrikkeldag) — correcte berekening rond 28/29 feb', () => {
      // Stel vandaag is 2025-02-28 (geen schrikkeldag), iemand geboren 2008-02-29
      Hydrator.__setToday('2025-02-28');
      expect(calculateAge('2008-02-29')).toBe(16); // nog geen 17

      // Op 2025-03-01 is verjaardag "voorbij" in niet-schrikkeljaar → nu 17
      Hydrator.__setToday('2025-03-01');
      expect(calculateAge('2008-02-29')).toBe(17);

      // In schrikkeljaar 2024-02-29 exact 16 geworden
      Hydrator.__setToday('2024-02-29');
      expect(calculateAge('2008-02-29')).toBe(16);
    });
  });
});