// src/domain/rules/fieldConstraints.ts
import { GENERAL_OPTIONS, HOUSEHOLD_OPTIONS, FINANCE_OPTIONS } from '@domain/registry/options';

/**
 * FIELD CONSTRAINT DEFINITION
 * 
 * Single Source of Truth voor alle validatie regels
 */
export interface FieldConstraint {
  type: 'number' | 'enum' | 'string' | 'boolean';
  required?: boolean;
  min?: number;
  max?: number;
  warn?: number; // Soft limit (toont warning maar accepteert waarde)
  values?: readonly string[]; // Voor enum types
  pattern?: RegExp; // Voor string validation
  message?: string; // Custom error message
}

/**
 * FIELD CONSTRAINTS REGISTRY
 * 
 * Alle velden met hun validatie regels
 */
export const FIELD_CONSTRAINTS_REGISTRY: Record<string, FieldConstraint> = {
  // ═══════════════════════════════════════════════════════════
  // SETUP VELDEN
  // ═══════════════════════════════════════════════════════════
  
  aantalMensen: {
    type: 'number',
    required: true,
    min: 1,
    max: 10,
    warn: 6, // Waarschuwing bij > 6 personen (grote huishoudens)
  },
  
  aantalVolwassen: {
    type: 'number',
    required: true,
    min: 1,
    max: 10, // Kan niet meer zijn dan aantalMensen (wordt gecontroleerd door orchestrator)
  },
  
  autoCount: {
    type: 'enum',
    required: true,
    values: HOUSEHOLD_OPTIONS.autoCount,
  },
  
  heeftHuisdieren: {
    type: 'boolean',
    required: false,
  },
  
  woningType: {
    type: 'enum',
    required: true,
    values: HOUSEHOLD_OPTIONS.woningType,
  },
  
  // ═══════════════════════════════════════════════════════════
  // HOUSEHOLD VELDEN (Members)
  // ═══════════════════════════════════════════════════════════
  
  name: {
    type: 'string',
    required: false, // Optioneel maar aanbevolen
    min: 1,
    max: 50,
  },
  
  age: {
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    warn: 100, // Waarschuwing bij zeer hoge leeftijd
  },
  
  dob: {
    type: 'string', // DIT IS CORRECT (State = string) wordt in ComponentOrchestrator omgezet naar type 'date' voor UI
    required: false,
    pattern: /^\d{4}-\d{2}-\d{2}$/, 
  },
  
  gender: {
    type: 'enum',
    required: false,
    values: HOUSEHOLD_OPTIONS.gender,
  },
  
  burgerlijkeStaat: {
    type: 'enum',
    required: false,
    values: HOUSEHOLD_OPTIONS.burgerlijkeStaat,
  },
  
  // ═══════════════════════════════════════════════════════════
  // INCOME VELDEN (Member-level)
  // ═══════════════════════════════════════════════════════════
  
  nettoSalaris: {
    type: 'number',
    required: false,
    min: 0,
    max: 50000, // Per periode (maand/week/etc)
    warn: 20000, // Zeer hoog salaris (mogelijk jaarbedrag ipv maand?)
  },
  
  frequentie: {
    type: 'enum',
    required: false,
    values: FINANCE_OPTIONS.incomeFrequency,
  },
  
  vakantiegeldPerJaar: {
    type: 'number',
    required: false,
    min: 0,
    max: 10000,
  },
  
  vakantiegeldPerMaand: {
    type: 'number',
    required: false,
    min: 0,
    max: 1000,
  },
  
  uitkeringType: {
    type: 'enum',
    required: false,
    values: FINANCE_OPTIONS.uitkeringType,
  },
  
  uitkeringBedrag: {
    type: 'number',
    required: false,
    min: 0,
    max: 5000, // Maximale uitkering per maand
    warn: 3000,
  },
  
  // Toeslagen (member-level)
  zorgtoeslag: {
    type: 'number',
    required: false,
    min: 0,
    max: 200, // Max zorgtoeslag per maand
  },
  
  reiskosten: {
    type: 'number',
    required: false,
    min: 0,
    max: 1000,
  },
  
  overigeInkomsten: {
    type: 'number',
    required: false,
    min: 0,
    max: 5000,
  },
  
  // ═══════════════════════════════════════════════════════════
  // INCOME VELDEN (Household-level)
  // ═══════════════════════════════════════════════════════════
  
  huurtoeslag: {
    type: 'number',
    required: false,
    min: 0,
    max: 500, // Max huurtoeslag per maand
  },
  
  kindgebondenBudget: {
    type: 'number',
    required: false,
    min: 0,
    max: 500,
  },
  
  kinderopvangtoeslag: {
    type: 'number',
    required: false,
    min: 0,
    max: 2000, // Kan hoog zijn bij meerdere kinderen
    warn: 1500,
  },
  
  kinderbijslag: {
    type: 'number',
    required: false,
    min: 0,
    max: 1000, // Per kwartaal, meerdere kinderen
  },
  
  heeftVermogen: {
    type: 'enum',
    required: false,
    values: GENERAL_OPTIONS.isBoolean,
  },
  
  vermogenWaarde: {
    type: 'number',
    required: false,
    min: 0,
    max: 10000000, // 10 miljoen
    warn: 1000000, // Waarschuwing bij > 1 miljoen (invloed op toeslagen)
  },
  
  // ═══════════════════════════════════════════════════════════
  // EXPENSE VELDEN (Wonen)
  // ═══════════════════════════════════════════════════════════
  
  kaleHuur: {
    type: 'number',
    required: false,
    min: 0,
    max: 5000,
    warn: 2000, // Zeer hoge huur
  },
  
  servicekosten: {
    type: 'number',
    required: false,
    min: 0,
    max: 500,
  },
  
  hypotheekBruto: {
    type: 'number',
    required: false,
    min: 0,
    max: 10000,
    warn: 5000,
  },
  
  ozb: {
    type: 'number',
    required: false,
    min: 0,
    max: 500,
  },
  
  gemeentebelastingen: {
    type: 'number',
    required: false,
    min: 0,
    max: 500,
  },
  
  waterschapsbelasting: {
    type: 'number',
    required: false,
    min: 0,
    max: 200,
  },
  
  kostgeld: {
    type: 'number',
    required: false,
    min: 0,
    max: 1500,
  },
  
  woonlasten: {
    type: 'number',
    required: false,
    min: 0,
    max: 3000,
  },
  
  // ═══════════════════════════════════════════════════════════
  // EXPENSE VELDEN (Nuts)
  // ═══════════════════════════════════════════════════════════
  
  energieGas: {
    type: 'number',
    required: false,
    min: 0,
    max: 1000,
    warn: 500, // Zeer hoog energieverbruik
  },
  
  water: {
    type: 'number',
    required: false,
    min: 0,
    max: 200,
    warn: 100,
  },
  
  bijdrageEGW: {
    type: 'number',
    required: false,
    min: 0,
    max: 300,
  },
  
  // ═══════════════════════════════════════════════════════════
  // EXPENSE VELDEN (Verzekeringen)
  // ═══════════════════════════════════════════════════════════
  
  ziektekostenPremie: {
    type: 'number',
    required: false,
    min: 0,
    max: 500,
  },
  
  aansprakelijkheid: {
    type: 'number',
    required: false,
    min: 0,
    max: 50,
  },
  
  reis: {
    type: 'number',
    required: false,
    min: 0,
    max: 100,
  },
  
  opstal: {
    type: 'number',
    required: false,
    min: 0,
    max: 200,
  },
  
  uitvaart: {
    type: 'number',
    required: false,
    min: 0,
    max: 100,
  },
  
  rechtsbijstand: {
    type: 'number',
    required: false,
    min: 0,
    max: 50,
  },
  
  overlijdensrisico: {
    type: 'number',
    required: false,
    min: 0,
    max: 200,
  },
  
  // ═══════════════════════════════════════════════════════════
  // EXPENSE VELDEN (Abonnementen)
  // ═══════════════════════════════════════════════════════════
  
  internetTv: {
    type: 'number',
    required: false,
    min: 0,
    max: 200,
  },
  
  sport: {
    type: 'number',
    required: false,
    min: 0,
    max: 200,
  },
  
  lezen: {
    type: 'number',
    required: false,
    min: 0,
    max: 100,
  },
  
  contributie: {
    type: 'number',
    required: false,
    min: 0,
    max: 200,
  },
  
  // Streaming wordt dynamisch gegenereerd per dienst
  // Format: streaming_{dienst}_amount
  // Min: 0, Max: 50 (per dienst)
  
  // ═══════════════════════════════════════════════════════════
  // EXPENSE VELDEN (Per Persoon)
  // ═══════════════════════════════════════════════════════════
  
  telefoon: {
    type: 'number',
    required: false,
    min: 0,
    max: 200,
    warn: 100, // Zeer duur abonnement
  },
  
  ov: {
    type: 'number',
    required: false,
    min: 0,
    max: 500,
  },
  
  // ═══════════════════════════════════════════════════════════
  // EXPENSE VELDEN (Auto)
  // ═══════════════════════════════════════════════════════════
  
  wegenbelasting: {
    type: 'number',
    required: false,
    min: 0,
    max: 200,
  },
  
  brandstofOfLaden: {
    type: 'number',
    required: false,
    min: 0,
    max: 1000,
    warn: 500, // Zeer hoog verbruik
  },
  
  apk: {
    type: 'number',
    required: false,
    min: 0,
    max: 100,
  },
  
  onderhoudReservering: {
    type: 'number',
    required: false,
    min: 0,
    max: 300,
  },
  
  lease: {
    type: 'number',
    required: false,
    min: 0,
    max: 2000,
    warn: 1000,
  },
  
  afschrijving: {
    type: 'number',
    required: false,
    min: 0,
    max: 1000,
  },
};

/**
 * Helper: Get constraint for a field
 */
export function getConstraint(fieldId: string): FieldConstraint | undefined {
  // Strip prefixes (mem_0_fieldName → fieldName)
  const cleanId = fieldId.replace(/^(mem_\d+_|auto-\d+_|streaming_\w+_)/, '');
  return FIELD_CONSTRAINTS_REGISTRY[cleanId];
}

/**
 * Helper: Check if value exceeds warning threshold
 */
export function exceedsWarning(fieldId: string, value: number): boolean {
  const constraint = getConstraint(fieldId);
  
  // Expliciete null/undefined check om de linter tevreden te stellen
  if (constraint === null || constraint === undefined || constraint.warn === undefined) {
    return false;
  }
  
  return value > constraint.warn;
}

/**
 * Helper: Get warning message
 */
export function getWarningMessage(fieldId: string, value: number): string | null {
  if (!exceedsWarning(fieldId, value)) {
    return null;
  }
  
  const constraint = getConstraint(fieldId);
  const threshold = constraint?.warn;
  
  // Custom messages per veld type
  if (fieldId === 'nettoSalaris' && value > 20000) {
    return 'Dit lijkt een jaarbedrag - vul het maandbedrag in';
  }
  
  if (fieldId === 'vermogenWaarde' && value > 1000000) {
    return 'Let op: vermogen boven €1M kan invloed hebben op toeslagen';
  }
  
  return `Waarde is ongewoon hoog (>${threshold})`;
}