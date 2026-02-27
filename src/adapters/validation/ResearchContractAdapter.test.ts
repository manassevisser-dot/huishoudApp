// src/adapters/validation/ResearchContractAdapter.test.ts

import { ResearchValidator } from './ResearchContractAdapter';
import { FIELD_CONSTRAINTS_REGISTRY as REG } from '@domain/rules/fieldConstraints';

describe('ResearchContractAdapter', () => {
  describe('validateMoney', () => {
    it('accepteert geldig Money-object in hele centen', () => {
      const input = { amount: 2500, currency: 'EUR' as const };
      const result = ResearchValidator.validateMoney(input);
      expect(result).toEqual(input);
    });

    it('werpt fout bij niet-geheel bedrag', () => {
      expect(() => ResearchValidator.validateMoney({ amount: 25.5, currency: 'EUR' }))
        .toThrow("Bedrag moet in hele centen (integers) zijn");
    });

    it('werpt fout bij verkeerde valuta', () => {
      expect(() => ResearchValidator.validateMoney({ amount: 2500, currency: 'USD' as const }))
        .toThrow();
    });
  });

  describe('validatePayload', () => {
    it('accepteert geldige research payload', () => {
      const input = {
        researchId: 'res_abc123def456',
        memberType: 'adult' as const,
        age: 35,
        amount: 100,
        category: 'income',
        timestamp: new Date().toISOString(),
      };

      const result = ResearchValidator.validatePayload(input);
      expect(result).toEqual(input);
    });

    it('werpt fout bij researchId zonder "res_" prefix', () => {
      const input = {
        researchId: 'invalid_id',
        memberType: 'child' as const,
        age: 8,
        amount: 0,
        category: 'expense',
        timestamp: new Date().toISOString(),
      };

      expect(() => ResearchValidator.validatePayload(input)).toThrow();
    });

    it('werpt fout bij leeftijd buiten grenzen', () => {
      const input = {
        researchId: 'res_valid',
        memberType: 'senior' as const,
        age: REG.age.max + 1, // te oud
        amount: 0,
        category: 'pension',
        timestamp: new Date().toISOString(),
      };

      expect(() => ResearchValidator.validatePayload(input)).toThrow();
    });

    it('werpt fout bij ongeldig ISO-tijdstip', () => {
      const input = {
        researchId: 'res_valid',
        memberType: 'adult' as const,
        age: 30,
        amount: 100,
        category: 'income',
        timestamp: 'not-a-date',
      };

      expect(() => ResearchValidator.validatePayload(input)).toThrow();
    });
  });

  describe('mapToContract', () => {
    it('retourneert de count (> 0) bij meer dan 5 volwassenen', () => {
      // isSpecialInvestigationRequired retourneert de count, niet een boolean.
      // Bij >= SPECIAL_THRESHOLD (5) retourneert het de count zelf.
      const members = Array(6).fill(null).map((_, i) => ({
        entityId: `m${i}`,
        memberType: 'adult',
        age: 30
      })) as any[];
  
      const contract = ResearchValidator.mapToContract('id-1', 'ext-1', members);
      expect(contract.isSpecialStatus).toBeGreaterThan(0);
      expect(contract.isSpecialStatus).toBe(6);
    });
  
    it('retourneert de count bij exact 5 volwassenen (op de drempel)', () => {
      // SPECIAL_THRESHOLD = 5, dus exact 5 >= 5 → retourneert 5 (speciaal).
      const members = Array(5).fill(null).map((_, i) => ({
        entityId: `m${i}`,
        memberType: 'adult',
        age: 30
      })) as any[];
  
      const contract = ResearchValidator.mapToContract('id-1', 'ext-1', members);
      expect(contract.isSpecialStatus).toBe(5);
    });
  
    it('telt alleen types die als volwassen worden beschouwd', () => {
      const members = [
        { entityId: 'm1', memberType: 'adult', age: 40 },
        { entityId: 'm2', memberType: 'adult', age: 38 },
        { entityId: 'm3', memberType: 'child', age: 10 },    // telt niet
        { entityId: 'm4', memberType: 'teenager', age: 16 }, // telt niet
        { entityId: 'm5', memberType: 'senior', age: 70 },   // telt niet (geen 'adult')
      ] as any[];
  
      const contract = ResearchValidator.mapToContract('id-1', 'ext-1', members);
      // 2 adults < 5 → isSpecialStatus === 0
      expect(contract.isSpecialStatus).toBe(0);
    });
  });
});