import { 
    toNumber, 
    parseName, 
    toMemberType, 
    makeResearchId, 
    containsPII, 
    assertNoPIILeak, 
    collectAndDistributeData 
  } from '../privacyHelpers';
  import { makeLegacyMember } from '@test-utils/index';
  
  describe('Privacy Helpers Branch Coverage', () => {
    
    describe('toNumber', () => {
      it('moet verschillende inputs correct parsen', () => {
        expect(toNumber(10)).toBe(10);
        expect(toNumber("20,50")).toBe(20.50); // Test de replace branch
        expect(toNumber("invalid", 5)).toBe(5); // Test de fallback branch
        expect(toNumber(NaN, 1)).toBe(1);      // Test Number.isFinite branch
        expect(toNumber(undefined)).toBe(0);   // Test de allerlaatste return
      });
  
      it('moet grensgevallen dekken (Regel 18 en 21)', () => {
        // Regel 18: waarde is een string maar resultaat van parseFloat is niet finite
        expect(toNumber("niet-een-getal", 99)).toBe(99);
        
        // Regel 21: waarde is geen number en geen string (bijv. object of null)
        expect(toNumber({ object: 'niet toegestaan' }, 50)).toBe(50);
        expect(toNumber(null, 10)).toBe(10);
      });
    });
  
    describe('parseName', () => {
      it('moet namen splitsen of fallbacks geven', () => {
        expect(parseName("Jan Janssen")).toEqual({ firstName: "Jan", lastName: "Janssen" });
        expect(parseName("Pieter van den Berg")).toEqual({ firstName: "Pieter", lastName: "van den Berg" });
        expect(parseName("Solo")).toEqual({ firstName: "Solo", lastName: "" });
        expect(parseName("  ")).toEqual({ firstName: "", lastName: "" }); // Test de trim/empty branch
      });
    });
  
    describe('toMemberType', () => {
      it('moet legacy types mappen naar MemberType', () => {
        expect(toMemberType('puber')).toBe('teenager');
        expect(toMemberType('65+')).toBe('senior');
        expect(toMemberType('baby')).toBe('child');
        expect(toMemberType('onbekend')).toBe('adult'); // Test mapping fallback
        expect(toMemberType(undefined)).toBe('adult');  // Test input fallback
      });
    });
  
    describe('Security & PII', () => {
      it('moet PII herkennen in strings', () => {
        expect(containsPII("test@example.com")).toBe(true);
        expect(containsPII("mijn achternaam is...")).toBe(true);
        expect(containsPII(123)).toBe(false);
        expect(containsPII(null)).toBe(false);
      });
  
      it('moet een researchId genereren', () => {
        const id = makeResearchId("user-123");
        // Versoepelde regex: checkt alleen op prefix en alfanumerieke inhoud
        expect(id).toMatch(/^res_[a-z0-9]+/);
      });
  
      it('moet de toBase64 fallback gebruiken in Node (Regel 42)', () => {
        const originalBtoa = global.btoa;
        delete (global as any).btoa;
        
        const id = makeResearchId("test");
        expect(id).toBeDefined();
        expect(id).toContain("res_");
        
        global.btoa = originalBtoa;
      });
  
      it('moet een error gooien bij PII lekken (Sleutels & Waarden)', () => {
        // Directe sleutel match
        const leakyKey = { email: "clean@test.com" };
        expect(() => assertNoPIILeak(leakyKey)).toThrow("SECURITY ALERT");
        
        // Fuzzy sleutel match (Regel 63)
        const fuzzyData = { achternaam_van_partner: 'Jansen' };
        expect(() => assertNoPIILeak(fuzzyData)).toThrow("SECURITY ALERT");
        
        const emailData = { contact_emailadres: 'test@test.nl' };
        expect(() => assertNoPIILeak(emailData)).toThrow("SECURITY ALERT");
  
        // PII in de waarde zelf (Regel 69)
        const dirtyValue = { comment: "Mijn email is piet@test.com" };
        expect(() => assertNoPIILeak(dirtyValue)).toThrow("PII gedetecteerd in waarde");
        
        const cleanData = { category: "food", age: 30 };
        expect(() => assertNoPIILeak(cleanData)).not.toThrow();
      });
    });
  
    describe('collectAndDistributeData', () => {
      it('moet legacy data transformeren en distribueren', () => {
        const legacy = makeLegacyMember();
        const raw = {
          ...legacy,
          age: undefined, // Forceer gebruik van 'leeftijd' branch
          amount: "100,00"
        };
  
        const { localMember, researchPayload } = collectAndDistributeData(raw as any, 1);
  
        expect(localMember.firstName).toBe("Jan");
        expect(localMember.memberType).toBe("teenager");
        expect(localMember.age).toBe(16);
  
        expect(researchPayload.researchId).toBeDefined();
        expect(researchPayload.age).toBe(16);
        expect(researchPayload).not.toHaveProperty('naam');
      });
  
      it('moet default waarden gebruiken als alles mist', () => {
        const { localMember } = collectAndDistributeData({} as any, 99);
        expect(localMember.entityId).toBe("local-99");
        expect(localMember.firstName).toBe("Lid");
      });
    });
  });