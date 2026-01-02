// src/utils/__tests__/date.test.ts
import { calculateAge, getAdultMaxISO, parseDDMMYYYYtoISO } from '../date';

describe('Date Utils — Onderzoeks-integriteit', () => {
  
  // Voeg dit blok toe om de tijd te controleren
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('moet een schrikkeljaar-datum correct parsen', () => {
    expect(parseDDMMYYYYtoISO('29-02-2024')).toBe('2024-02-29');
    expect(parseDDMMYYYYtoISO('29-02-2023')).toBeNull();
  });

  it('moet exact 18 jaar grens bewaken voor volwassenen', () => {
    // 1. Zet de 'vandaag' van het systeem vast
    const fakeToday = new Date('2025-01-01T12:00:00'); 
    jest.setSystemTime(fakeToday);

    // 2. Bereken de grens op basis van deze 'vandaag'
    const maxAdultDob = getAdultMaxISO(fakeToday);
    expect(maxAdultDob).toBe('2007-01-01');
    
    // 3. Nu zal calculateAge ook 2025 als referentiepunt gebruiken
    expect(calculateAge('2007-01-01')).toBe(18);
    
    // 4. Grensgeval: iemand die morgen pas 18 wordt
    expect(calculateAge('2007-01-02')).toBe(17);
  });
  describe('Date Utils — Uitgebreide tests', () => {
  
    describe('Boundary testing (18 jaar)', () => {
      // Stel de huidige datum vast voor betrouwbare tests
      beforeAll(() => {
        jest.useFakeTimers().setSystemTime(new Date('2024-01-01'));
      });
  
      afterAll(() => {
        jest.useRealTimers();
      });
  
      it('moet iemand als volwassene zien die exact vandaag 18 is geworden', () => {
        const birthDate = '2006-01-01';
        // verwachting: true
      });
  
      it('moet iemand als minderjarige zien die morgen 18 wordt', () => {
        const birthDate = '2006-01-02';
        // verwachting: false
      });
    });
  
    describe('Foutafhandeling', () => {
      it('moet een error gooien of null teruggeven bij een onmogelijke datum', () => {
        // Test bijv. 31 april of 30 februari
      });
  
      it('moet omgaan met verschillende separator types (/, -, .)', () => {
        // Test 01-01-2000 vs 01/01/2000
      });
    });
  });

});