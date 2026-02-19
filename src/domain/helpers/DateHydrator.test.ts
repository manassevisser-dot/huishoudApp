// src/domain/helpers/DateHydrator.test.ts

import {
  isoDateOnlyToLocalNoon,
  toISOFromLocal,
  todayLocalNoon,
  getAdultMaxISO,
  getChildMinISO,
  getChildMaxISO,
  parseDDMMYYYYtoISO,
  getISOWeek,
  formatToDisplay,
} from './DateHydrator';

describe('DateHydrator', () => {
  describe('isoDateOnlyToLocalNoon', () => {
    it('parsed geldige ISO-datum naar lokale noon', () => {
      const result = isoDateOnlyToLocalNoon('2024-06-15');
      expect(result).not.toBeNull();
      if (result !== null && result !== undefined) {
        expect(result.getHours()).toBe(12);
        expect(result.getFullYear()).toBe(2024);
        expect(result.getMonth()).toBe(5); // juni = 5 (0-based)
        expect(result.getDate()).toBe(15);
      }
    });

    it('retourneert null bij ongeldige string', () => {
      expect(isoDateOnlyToLocalNoon('2024/06/15')).toBeNull();
      expect(isoDateOnlyToLocalNoon('')).toBeNull();
      expect(isoDateOnlyToLocalNoon('niet-een-datum')).toBeNull();
    });

    it('valideert kalenderdatum', () => {
      expect(isoDateOnlyToLocalNoon('2024-02-30')).toBeNull(); // feb 30 bestaat niet
      expect(isoDateOnlyToLocalNoon('2024-13-01')).toBeNull(); // maand 13
    });
  });

  describe('toISOFromLocal', () => {
    it('formatteert lokale Date naar YYYY-MM-DD', () => {
      const date = new Date(2024, 5, 15, 14, 30); // 15 juni 2024, 14:30
      expect(toISOFromLocal(date)).toBe('2024-06-15');
    });
  });

  describe('todayLocalNoon', () => {
    it('retourneert vandaag op 12:00 lokale tijd', () => {
      const today = todayLocalNoon();
      const now = new Date();
      expect(today.getHours()).toBe(12);
      expect(today.getFullYear()).toBe(now.getFullYear());
      expect(today.getMonth()).toBe(now.getMonth());
      expect(today.getDate()).toBe(now.getDate());
    });
  });

  describe('leeftijdsgrenzen', () => {
    const baseDate = new Date(2024, 5, 15); // 15 juni 2024

    it('getAdultMaxISO: 18 jaar geleden', () => {
      expect(getAdultMaxISO(baseDate)).toBe('2006-06-15');
    });

    it('getChildMinISO: 18 jaar geleden + 1 dag', () => {
      expect(getChildMinISO(baseDate)).toBe('2006-06-16');
    });

    it('getChildMaxISO: vandaag', () => {
      expect(getChildMaxISO(baseDate)).toBe('2024-06-15');
    });
  });

  describe('parseDDMMYYYYtoISO', () => {
    it('parsed geldige dd-mm-jjjj naar ISO', () => {
      expect(parseDDMMYYYYtoISO('15-06-2024')).toBe('2024-06-15');
    });

    it('retourneert null bij ongeldige input', () => {
      expect(parseDDMMYYYYtoISO('')).toBeNull();
      expect(parseDDMMYYYYtoISO('15/06/2024')).toBeNull();
      expect(parseDDMMYYYYtoISO('niet-een-datum')).toBeNull();
      expect(parseDDMMYYYYtoISO('32-01-2024')).toBeNull(); // ongeldige dag
    });

    it('valideert kalenderdatum', () => {
      expect(parseDDMMYYYYtoISO('30-02-2024')).toBeNull(); // feb 30
    });
  });

  describe('getISOWeek', () => {
    it('berekent ISO-weeknummer correct', () => {
      // 1 januari 2024 is maandag → week 1
      expect(getISOWeek(new Date(2024, 0, 1))).toBe(1);
      // 31 december 2023 is zondag → week 52 van 2023
      expect(getISOWeek(new Date(2023, 11, 31))).toBe(52);
    });
  });

  describe('formatToDisplay', () => {
    const date = new Date(2024, 5, 15); // 15 juni 2024

    it('dd-mm-yyyy', () => {
      expect(formatToDisplay(date, 'dd-mm-yyyy')).toBe('15-06-2024');
    });

    it('weekday', () => {
      const result = formatToDisplay(date, 'weekday');
      // Controleer dat het een korte weekdag is (za, zo, ma, etc.)
      expect(['zo', 'ma', 'di', 'wo', 'do', 'vr', 'za']).toContain(result);
    });
    
    it('short', () => {
      const result = formatToDisplay(date, 'short');
      // Voorbeeld: "15 jun 24" — geen punt, geen apostrof
      expect(result).toMatch(/^15 [a-z]{3} 24$/);
    });
    
    it('full', () => {
      const result = formatToDisplay(date, 'full');
      // Voorbeeld: "zaterdag 15 juni 2024"
      expect(result).toMatch(/^zaterdag 15 juni 2024$/);
    });

    it('ongeldige datum geeft lege string', () => {
      expect(formatToDisplay(new Date('invalid'))).toBe('');
    });
  });
});