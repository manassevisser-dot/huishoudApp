// src/utils/__tests__/date.test.ts
import { 
  calculateAge, 
  getAdultMaxISO, 
  getChildMinISO,
  getChildMaxISO,
  parseDDMMYYYYtoISO, 
  formatDate,
  isDigitsDatePlausible,
  formatDateISO,
  getCurrentDateISO,
  getISOWeek
} from '../date';

describe('Date Utils — Integrale Testsuite', () => {
  
  // --- Setup voor tijdsafhankelijke tests ---
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Core Parsing & TZ-robuustheid', () => {
    it('moet DD-MM-YYYY correct omzetten naar ISO YYYY-MM-DD', () => {
      expect(parseDDMMYYYYtoISO('15-03-2024')).toBe('2024-03-15');
      expect(parseDDMMYYYYtoISO('01-01-2000')).toBe('2000-01-01');
    });

    it('moet schrikkeljaren correct valideren', () => {
      expect(parseDDMMYYYYtoISO('29-02-2024')).toBe('2024-02-29');
      expect(parseDDMMYYYYtoISO('29-02-2023')).toBeNull();
    });

    it('moet null retourneren bij onmogelijke kalenderdata', () => {
      expect(parseDDMMYYYYtoISO('31-04-2023')).toBeNull();
      expect(parseDDMMYYYYtoISO('32-01-2023')).toBeNull();
      expect(parseDDMMYYYYtoISO('invalid')).toBeNull();
    });
  });

  describe('Leeftijdsberekening & Business Logic (Age Gates)', () => {
    it('moet exact de 18-jaar grens bewaken', () => {
      const fakeToday = new Date('2025-01-01T12:00:00'); 
      jest.setSystemTime(fakeToday);

      expect(calculateAge('2007-01-01')).toBe(18);
      expect(calculateAge('2007-01-02')).toBe(17);
      expect(calculateAge('niet-een-datum')).toBeNull();
    });

    it('moet correcte ISO-grenzen genereren voor adult/child filters', () => {
      const fakeToday = new Date('2025-01-01T12:00:00');
      jest.setSystemTime(fakeToday);

      expect(getAdultMaxISO()).toBe('2007-01-01');
      expect(getAdultMaxISO()).toBeDefined();
      expect(getChildMinISO()).toBe('2007-01-02');
      expect(getChildMaxISO()).toBe('2025-01-01');
    });
  });

  describe('Formattering (formatDate)', () => {
    const testDate = new Date('2024-03-15T12:00:00'); // Een vrijdag

    it('moet verschillende format types ondersteunen voor Date objecten', () => {
      expect(formatDate(testDate, 'dd-mm-yyyy')).toBe('15-03-2024');
      expect(formatDate(testDate, 'weekday')).toBe('vr');
      expect(formatDate(testDate, 'short')).toContain('mrt');
      expect(formatDate(testDate, 'full')).toContain('vrijdag');
    });
    
    it('FORCEER DEKKING REGEL 101: formatDate met ongeldige ISO-like string', () => {
      // Stap 1: De input moet een string zijn
      // Stap 2: isIsoDateOnly('2024-02-30') geeft TRUE (want het matcht YYYY-MM-DD)
      // Stap 3: isoDateOnlyToLocalNoon('2024-02-30') geeft NULL (want 30 feb bestaat niet)
      // Stap 4: De code zou NU regel 101 moeten raken: if (!local) return '';
      
      const result = formatDate('2024-02-30');
      expect(result).toBe('');
    });
    
    it('EXTRA DEKKING: formatDate met totaal corrupte string', () => {
      // Dit raakt de 'else if (typeof input === "string")' tak
      const result = formatDate('geen-datum-hier');
      expect(result).toBe('');
    });

    it('moet ISO-strings (YYYY-MM-DD) TZ-veilig formatteren', () => {
      expect(formatDate('2024-03-15')).toBe('15-03-2024');
    });

    it('moet gracefully falen bij corrupte input', () => {
      // @ts-ignore
      expect(formatDate(null)).toBe('');
      expect(formatDate('corrupt-string')).toBe('');
      expect(formatDate(new Date('invalid'))).toBe('');
    });

    it('moet vangnetten voor extreme randgevallen dekken (Regel 101 & 136)', () => {
      // Geforceerde ongeldige ISO-kalenderdatum (Regel 101)
      // @ts-ignore
      expect(formatDate('0000-00-00')).toBe('');

      // Onbekend formatType (Regel 136 default case)
      const date = new Date('2024-03-15T12:00:00');
      // @ts-ignore
      expect(formatDate(date, 'unknown-format')).toBe(date.toLocaleDateString('nl-NL'));
    });
  });

  describe('Plausibiliteit & Utilities', () => {
    it('moet isDigitsDatePlausible correct beoordelen', () => {
      expect(isDigitsDatePlausible('02012026')).toBe(true);
      expect(isDigitsDatePlausible('99999999')).toBe(false);
      expect(isDigitsDatePlausible('123')).toBe(false);
      expect(isDigitsDatePlausible('ABCDEFGH')).toBe(false);
    });

    it('moet ISO weeknummers correct berekenen', () => {
      const d = new Date('2024-01-04'); 
      expect(getISOWeek(d)).toBe(1);
    });

    it('moet huidige datum in ISO format retourneren', () => {
      const fakeToday = new Date('2024-03-15');
      jest.setSystemTime(fakeToday);
      expect(getCurrentDateISO()).toBe('2024-03-15');
      expect(formatDateISO(fakeToday)).toBe('2024-03-15');
    });
  });
})