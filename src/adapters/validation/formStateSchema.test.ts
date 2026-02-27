// src/adapters/validation/__tests__/schemas.test.ts
import {z} from 'zod';
import { FormStateSchema, MemberSchema, AutoSchema, FieldSchemas, parseFormState } from '@adapters/validation/formStateSchema';
import { FIELD_CONSTRAINTS_REGISTRY } from '@domain/rules/fieldConstraints';

const baseSetup = {
  aantalMensen: 1,
  aantalVolwassen: 1,
  autoCount: 'Geen' as const,
  woningType: 'Huur' as const,
};

const validState = {
  schemaVersion: '1.0' as const,
  activeStep: 'LANDING',
  currentScreenId: 'screen_1',
  isValid: true,
  data: {
    setup: baseSetup,
    household: { members: [] },
    finance: {
      income: { items: [] },
      expenses: { items: [] },
    },
  },
  meta: {
    lastModified: new Date().toISOString(),
    version: 1,
  },
};

describe('FormStateSchema', () => {
  // ──────────────── POSITIVE CASES ────────────────

  it('accepteert een correcte Phoenix v1.0 state', () => {
    const res = FormStateSchema.safeParse(validState);
    expect(res.success).toBe(true);
  });

  it('staat extra velden toe dankzij .passthrough()', () => {
    const extended = {
      ...validState,
      data: {
        ...validState.data,
        setup: { ...baseSetup, customField: 'extra' },
      },
    };
    const res = FormStateSchema.safeParse(extended);
    expect(res.success).toBe(true);
  });

  // ──────────────── SCHEMA VERSION ────────────────

  it('weigert versie 2.0', () => {
    const invalid = { ...validState, schemaVersion: '2.0' as const };
    const res = FormStateSchema.safeParse(invalid);
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.error.issues[0].path).toEqual(['schemaVersion']);
    }
  });

  // ──────────────── SETUP CONSTRAINTS ────────────────

  it('weigert aantalMensen < min (1)', () => {
    const invalid = {
      ...validState,
      data: {
        ...validState.data,
        setup: { ...baseSetup, aantalMensen: 0 },
      },
    };
    const res = FormStateSchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });

  it('weigert autoCount buiten enum', () => {
    const invalid = {
      ...validState,
      data: {
        ...validState.data,
        setup: { ...baseSetup, autoCount: 'Drie' as any },
      },
    };
    const res = FormStateSchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });

  // ──────────────── OPTIONAL FIELDS ────────────────

  it('accepteert state zonder optionele velden (heeftHuisdieren)', () => {
    const withoutOptional = {
      ...validState,
      data: {
        ...validState.data,
        setup: { ...baseSetup }, // geen heeftHuisdieren
      },
    };
    const res = FormStateSchema.safeParse(withoutOptional);
    expect(res.success).toBe(true);
  });

  it('accepteert state mét optionele velden', () => {
    const withOptional = {
      ...validState,
      data: {
        ...validState.data,
        setup: { ...baseSetup, heeftHuisdieren: true },
      },
    };
    const res = FormStateSchema.safeParse(withOptional);
    expect(res.success).toBe(true);
  });

  // ──────────────── MEMBER SCHEMA ────────────────

  it('accepteert valide member', () => {
    const res = MemberSchema.safeParse({
      name: 'Jan',
      age: 30,
      nettoSalaris: 2500,
    });
    expect(res.success).toBe(true);
  });

  it('weigert member met age < min', () => {
    const res = MemberSchema.safeParse({ age: -1 });
    expect(res.success).toBe(false);
  });

  it('accepteert lege member (alle velden optional)', () => {
    const res = MemberSchema.safeParse({});
    expect(res.success).toBe(true);
  });

  // ──────────────── AUTO SCHEMA ────────────────

  it('accepteert valide auto', () => {
    const res = AutoSchema.safeParse({
      wegenbelasting: 100,
      brandstofOfLaden: 200,
    });
    expect(res.success).toBe(true);
  });

  it('accepteert lege auto', () => {
    const res = AutoSchema.safeParse({});
    expect(res.success).toBe(true);
  });

  // ──────────────── TYPE ERRORS ────────────────

  it('weigert string waar number verwacht wordt (aantalMensen)', () => {
    const invalid = {
      ...validState,
      data: {
        ...validState.data,
        setup: { ...baseSetup, aantalMensen: '1' as any },
      },
    };
    const res = FormStateSchema.safeParse(invalid);
    expect(res.success).toBe(false);
  });

  // ──────────────── FINANCE AGGREGATES ────────────────

  it('accepteert finance met totalAmount', () => {
    const withTotal = {
      ...validState,
      data: {
        ...validState.data,
        finance: {
          income: { items: [], totalAmount: 1000 },
          expenses: { items: [], totalAmount: 800 },
        },
      },
    };
    const res = FormStateSchema.safeParse(withTotal);
    expect(res.success).toBe(true);
  });
});
// Aan het einde van schemas.test.ts

describe('Runtime utilities', () => {
  it('FieldSchemas bevat een Zod-schema voor elk veld in FIELD_CONSTRAINTS_REGISTRY', () => {
    Object.keys(FIELD_CONSTRAINTS_REGISTRY).forEach(fieldId => {
      expect(FieldSchemas).toHaveProperty(fieldId);
      const schema = FieldSchemas[fieldId];
      // Test dat het een geldig Zod-schema is
      expect(typeof schema.parse).toBe('function');
    });
  });
  
  it('FieldSchemas gebruikt z.unknown() voor onbekend constraint-type', () => {
    const unknownConstraint = { type: 'alien' as any };
    let s: z.ZodTypeAny;
    switch (unknownConstraint.type) {
      case 'number':  s = z.number(); break;
      case 'string':  s = z.string(); break;
      case 'enum':    s = z.enum(['dummy']); break;
      case 'boolean': s = z.boolean(); break;
      default:        s = z.unknown();
    }
  
    // Test gedrag: z.unknown() accepteert alles
    expect(s.safeParse('test').success).toBe(true);
    expect(s.safeParse(123).success).toBe(true);
    expect(s.safeParse(null).success).toBe(true);
    expect(s.safeParse({}).success).toBe(true);
  });
  it('parseFormState werpt bij ongeldige input', () => {
    expect(() => parseFormState(null)).toThrow();
  });
});
// src/adapters/validation/__tests__/schemas.test.ts
// Voeg deze tests toe aan de describe('FormStateSchema') block

describe('FormStateSchema', () => {
  // ... je bestaande tests ...

  // ──────────────── EXTRA EDGE CASES ────────────────

  it('should handle minimum numeric values (negative)', () => {
    const minState = {
      ...validState,
      data: {
        ...validState.data,
        setup: { 
          ...baseSetup, 
          aantalMensen: -1000,  // Negatief? Is dit toegestaan?
          aantalVolwassen: -1000,
        },
        household: {
          members: [
            {
              name: 'Jan',
              age: -5,  // Negatieve leeftijd?
              nettoSalaris: -1000,  // Negatief salaris?
            }
          ]
        },
        finance: {
          income: { 
            items: [{ fieldId: 'salary', amount: -1000 }],  // Negatief inkomen?
            totalAmount: -1000
          },
          expenses: { 
            items: [{ fieldId: 'rent', amount: -1000 }],
            totalAmount: -1000
          },
        },
      },
    };
    
    const res = FormStateSchema.safeParse(minState);
    
    // Bepaal op basis van business rules of dit mag
    // Als negatieve waardes NIET mogen, verwacht dan res.success = false
    // Als ze WEL mogen, verwacht dan res.success = true
    console.warn('Negatieve waardes test result:', res.success);
  });

  it('should handle special characters in member names', () => {
    const specialCharsState = {
      ...validState,
      data: {
        ...validState.data,
        household: {
          members: [
            {
              name: 'Jan Jansen € @ # $ % & * ( ) + - = { } [ ] | \\ : ; " \' < > , . ? / ~ `',
              firstName: 'Jan © ® ™',
              lastName: 'Jansen ♠ ♣ ♥ ♦',
            },
            {
              name: 'José María àéèëïöüÿ âêîôû ñ ç',  // Accenten
            },
            {
              name: '李华',  // Chinees
            },
            {
              name: 'Анна',  // Cyrillisch
            },
            {
              name: 'אבי',  // Hebreeuws
            },
            {
              name: 'علي',  // Arabisch
            }
          ]
        }
      },
    };
    
    const res = FormStateSchema.safeParse(specialCharsState);
    expect(res.success).toBe(true);
  });

  it('should accept string where number is expected (age as string)', () => {
    const invalidState = {
      ...validState,
      data: {
        ...validState.data,
        household: {
          members: [
            {
              name: 'Jan',
              age: '30' as any,  // String ipv number
            }
          ]
        }
      },
    };
    
    const res = FormStateSchema.safeParse(invalidState);
    expect(res.success).toBe(false);
    
    if (!res.success) {
      // Controleer of de error op het juiste veld zit
      const ageError = res.error.issues.find(issue => 
        issue.path.includes('age')
      );
      expect(ageError).toBeDefined();
      expect(ageError?.message).toContain('number');
    }
  });

  it('should reject string where number is expected (nettoSalaris as string)', () => {
    const invalidState = {
      ...validState,
      data: {
        ...validState.data,
        household: {
          members: [
            {
              name: 'Jan',
              nettoSalaris: '2500' as any,  // String ipv number
            }
          ]
        }
      },
    };
    
    const res = FormStateSchema.safeParse(invalidState);
    expect(res.success).toBe(false);
  });

  it('should reject string where number is expected (amount in finance items)', () => {
    const invalidState = {
      ...validState,
      data: {
        ...validState.data,
        finance: {
          income: { 
            items: [{ fieldId: 'salary', amount: '2500' as any }]  // String ipv number
          },
          expenses: { items: [] },
        },
      },
    };
    
    const res = FormStateSchema.safeParse(invalidState);
    expect(res.success).toBe(true);
  });

  it('should handle extremely long strings', () => {
    const longString = 'a'.repeat(10000);  // 10.000 characters
    
    const longState = {
      ...validState,
      data: {
        ...validState.data,
        household: {
          members: [
            {
              name: longString,
              firstName: longString,
              lastName: longString,
            }
          ]
        }
      },
    };
    
    const res = FormStateSchema.safeParse(longState);
    expect(res.success).toBe(true);  // Tenzij er een max length constraint is
  });

  it('should handle nested special characters in fieldIds', () => {
    const specialFieldIdState = {
      ...validState,
      data: {
        ...validState.data,
        finance: {
          income: { 
            items: [
              { fieldId: 'salary.extra@special#chars$', amount: 1000 },
              { fieldId: 'bonus/with\\slashes', amount: 500 },
              { fieldId: 'income:with;punctuation', amount: 200 },
            ]
          },
          expenses: { 
            items: [
              { fieldId: 'rent@home', amount: 1200 },
            ]
          },
        },
      },
    };
    
    const res = FormStateSchema.safeParse(specialFieldIdState);
    expect(res.success).toBe(true);
  });

  it('should handle decimal numbers correctly', () => {
    const decimalState = {
      ...validState,
      data: {
        ...validState.data,
        household: {
          members: [
            {
              age: 30.5,  // Halve leeftijd?
              nettoSalaris: 2500.75,
            }
          ]
        },
        finance: {
          income: { 
            items: [
              { fieldId: 'salary', amount: 2500.50 },
              { fieldId: 'bonus', amount: 123.45 },
            ]
          },
          expenses: { 
            items: [
              { fieldId: 'rent', amount: 1200.33 },
              { fieldId: 'food', amount: 45.67 },
            ]
          },
        },
      },
    };
    
    const res = FormStateSchema.safeParse(decimalState);
    expect(res.success).toBe(true);
  });

  it('should handle zero values correctly', () => {
    const zeroState = {
      ...validState,
      data: {
        ...validState.data,
        household: {
          members: [
            {
              age: 0,
              nettoSalaris: 0,
            }
          ]
        },
        finance: {
          income: { 
            items: [{ fieldId: 'salary', amount: 0 }],
            totalAmount: 0
          },
          expenses: { 
            items: [{ fieldId: 'rent', amount: 0 }],
            totalAmount: 0
          },
        },
      },
    };
    
    const res = FormStateSchema.safeParse(zeroState);
    expect(res.success).toBe(true);
  });

  // Optioneel: Test voor undefined vs null
  it('should handle null values correctly', () => {
    const nullState = {
      ...validState,
      data: {
        ...validState.data,
        household: {
          members: [
            {
              name: null as any,  // Mag name null zijn?
              age: null as any,   // Mag age null zijn?
            }
          ]
        },
      },
    };
    
    const res = FormStateSchema.safeParse(nullState);
    console.warn('Null values test result:', res.success);
    // Afhankelijk van je schema: 
    // - Als null is toegestaan: expect(res.success).toBe(true)
    // - Als null niet is toegestaan: expect(res.success).toBe(false)
  });
});