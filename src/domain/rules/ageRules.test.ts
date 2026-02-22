// src/domain/rules/ageRules.test.ts
import { isMinor, isSenior } from './ageRules';
import type { TimeProvider } from '@domain/helpers/TimeProvider';

// Eenvoudige stub voor TimeProvider: levert een vaste lokale-noon datum.
const makeProvider = (isoDate: string): TimeProvider => {
  const [y, m, d] = isoDate.split('-').map(Number);
  const fixed = new Date(y, m - 1, d, 12, 0, 0, 0);
  return {
    getCurrentLocalNoon: () => new Date(fixed),
  };
};

// Helper voor geboortedata op lokale noon
const d = (iso: string) => {
  const [y, m, day] = iso.split('-').map(Number);
  return new Date(y, m - 1, day, 12, 0, 0, 0);
};

describe('ageGuards: isMinor / isSenior', () => {
  // Referentiedatum voor de meeste tests: 2026-02-15 (noon)
  const provider = makeProvider('2026-02-15');

  describe('isMinor', () => {
    it('is minderjarig 1 dag vóór de 18e verjaardag', () => {
      expect(isMinor(d('2008-02-16'), provider)).toBe(true);
    });

    it('is NIET minderjarig op de 18e verjaardag', () => {
      expect(isMinor(d('2008-02-15'), provider)).toBe(false);
    });

    it('is NIET minderjarig 1 dag ná de 18e verjaardag', () => {
      expect(isMinor(d('2008-02-14'), provider)).toBe(false);
    });

    it('neemt maand/dag mee — verjaardag later dit jaar', () => {
      // Geboren 2008-12-01 → op 2026-02-15 nog geen 18
      expect(isMinor(d('2008-12-01'), provider)).toBe(true);
    });

    it('neemt maand/dag mee — verjaardag eerder dit jaar', () => {
      // Geboren 2008-01-10 → op 2026-02-15 al 18+
      expect(isMinor(d('2008-01-10'), provider)).toBe(false);
    });
  });

  describe('isSenior', () => {
    it('is GEEN senior 1 dag vóór de 65e verjaardag', () => {
      expect(isSenior(d('1961-02-16'), provider)).toBe(false);
    });

    it('is senior op de 65e verjaardag', () => {
      expect(isSenior(d('1961-02-15'), provider)).toBe(true);
    });

    it('is senior 1 dag ná de 65e verjaardag', () => {
      expect(isSenior(d('1961-02-14'), provider)).toBe(true);
    });

    it('neemt maand/dag mee — verjaardag later dit jaar: nog geen 65', () => {
      // Geboren 1961-12-01 → op 2026-02-15 nog geen 65
      expect(isSenior(d('1961-12-01'), provider)).toBe(false);
    });

    it('neemt maand/dag mee — verjaardag eerder dit jaar: al 65', () => {
      // Geboren 1961-01-10 → op 2026-02-15 65+
      expect(isSenior(d('1961-01-10'), provider)).toBe(true);
    });

    it('randgeval: 29 feb geboren — evaluatie rond 28/29 feb', () => {
      // Today = 2025-02-28, geboren 1960-02-29 → verjaardag nog NIET bereikt (28 < 29)
      const provider2025_02_28 = makeProvider('2025-02-28');
      expect(isSenior(d('1960-02-29'), provider2025_02_28)).toBe(false);

      // Op 2025-03-01 is de verjaardag “geweest” in niet-schrikkeljaar
      const provider2025_03_01 = makeProvider('2025-03-01');
      expect(isSenior(d('1960-02-29'), provider2025_03_01)).toBe(true);
    });
  });
});