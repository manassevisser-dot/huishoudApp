// src/utils/__tests__/date.test.ts
// 1. Context & Systeemdatum (Application Layer)
import { getCurrentDateISO } from '@app/orchestrators/dateOrchestrator';

// 2. Transformaties & Helpers (Domain Layer)
import { 
  parseDDMMYYYYtoISO, 
  getISOWeek,
  isoDateOnlyToLocalNoon,
  todayLocalNoon 
} from '@domain/helpers/DateHydrator';

// 3. Business Rules (Domain Layer)
import { 
  getAdultMaxISO, 
  getChildMaxISO, 
  calculateAge
} from '@domain/rules/ageBoundaryRules';

// 4. Validatie (Domain Layer)
import { isDigitsDatePlausible } from '@domain/validation/dateValidators';

// 5. Formatting (UI Layer)
import { formatDate, formatDateISO } from '@ui/helpers/dateFormatting';

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
    it('moet DateHydrator edge-cases afdekken voor extra coverage', () => {
      // TEST 1: Ongeldige formaten voor isoDateOnlyToLocalNoon (raakt lines 29-37)
      // @ts-ignore
      expect(isoDateOnlyToLocalNoon(null)).toBeNull();
      expect(isoDateOnlyToLocalNoon('')).toBeNull();
      expect(isoDateOnlyToLocalNoon('2024-13-01')).toBeNull(); // Ongeldige maand
      expect(isoDateOnlyToLocalNoon('2024-01-32')).toBeNull(); // Ongeldige dag
      
      // TEST 2: Vangnetten voor parseDDMMYYYYtoISO (raakt lines 51-66)
      expect(parseDDMMYYYYtoISO('31-02-2024')).toBeNull(); // Bestaat niet
      expect(parseDDMMYYYYtoISO('00-00-0000')).toBeNull();
      // @ts-ignore
      expect(parseDDMMYYYYtoISO(undefined)).toBeNull();
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
    it('moet correcte ISO-grenzen genereren voor adult/child filters', () => {
      // Gebruik dezelfde referentiedatum als de functies
      const now = todayLocalNoon();
  
      // Bereken verwachte waarden dynamisch
      const expectedAdultMaxYear = now.getFullYear() - 18;
      const expectedAdultMaxISO = `${expectedAdultMaxYear}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
      // Voor childMax: 1 dag vóór adultMax
      const adultMaxDate = new Date(now.getFullYear() - 18, now.getMonth(), now.getDate(), 12, 0, 0, 0);
      const childMaxDate = new Date(adultMaxDate.getTime() - 24 * 60 * 60 * 1000); // minus 1 day
      const expectedChildMaxISO = `${childMaxDate.getFullYear()}-${String(childMaxDate.getMonth() + 1).padStart(2, '0')}-${String(childMaxDate.getDate()).padStart(2, '0')}`;
  
      // Asserties
      expect(getAdultMaxISO()).toBe(expectedAdultMaxISO);
      expect(getAdultMaxISO()).toBeDefined();
      expect(getChildMaxISO()).toBe(expectedChildMaxISO);
    });

    it('moet calculateAge correct berekenen inclusief verjaardag-grenzen', () => {
      const fakeToday = new Date('2026-01-18');
      jest.setSystemTime(fakeToday);
    
      // 1. Iemand die al jarig is geweest (geboren 10-01-2000)
      expect(calculateAge('2000-01-10')).toBe(26);
    
      // 2. Iemand die exact vandaag jarig is (geboren 18-01-2000)
      expect(calculateAge('2000-01-18')).toBe(26);
    
      // 3. Iemand die nog jarig moet worden (geboren 19-01-2000)
      expect(calculateAge('2000-01-19')).toBe(25);
    
      // 4. Iemand die later in het jaar jarig is (geboren 05-06-2000)
      expect(calculateAge('2000-06-05')).toBe(25);
    
      // 5. Edge case: ongeldige datum (raakt de !birthDate branch)
      expect(calculateAge('ongeldig')).toBeNull();
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
});
