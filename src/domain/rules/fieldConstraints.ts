// src/domain/rules/fieldConstraints.ts
import { GENERAL_OPTIONS, HOUSEHOLD_OPTIONS, FINANCE_OPTIONS } from '@domain/registry/options';

// ════════════════════════════════════════════════════════════════
// DISCRIMINATED CONSTRAINT TYPES
// ════════════════════════════════════════════════════════════════
// TypeScript weet nu: type === 'number' → min/max bestaan
//                     type === 'enum'   → values bestaat

export interface BaseConstraint {
  required?: boolean;
  message?: string;
}

export interface NumberConstraint extends BaseConstraint {
  type: 'number';
  min?: number;
  max?: number;
  warn?: number;
}

export interface EnumConstraint extends BaseConstraint {
  type: 'enum';
  values: readonly string[];
}

export interface StringConstraint extends BaseConstraint {
  type: 'string';
  min?: number;
  max?: number;
  pattern?: RegExp;
}

export interface BooleanConstraint extends BaseConstraint {
  type: 'boolean';
}

/** Discriminated union — de fabriek kan nu exact afleiden welk Zod-type nodig is */
export type FieldConstraint =
  | NumberConstraint
  | EnumConstraint
  | StringConstraint
  | BooleanConstraint;

// ════════════════════════════════════════════════════════════════
// MEMBER FIELD KEYS — welke velden zijn member-templates
// ════════════════════════════════════════════════════════════════

/** Velden die per huishoudlid herhaald worden (mem_0_X, mem_1_X, ...) */
export const MEMBER_FIELD_KEYS = [
  'name', 'age', 'dob', 'gender', 'burgerlijkeStaat',
  'nettoSalaris', 'frequentie',
  'vakantiegeldPerJaar', 'vakantiegeldPerMaand',
  'uitkeringType', 'uitkeringBedrag',
  'zorgtoeslag', 'reiskosten', 'overigeInkomsten',
  'telefoon', 'ov',
] as const;

export type MemberFieldKey = typeof MEMBER_FIELD_KEYS[number];

/** Velden die per auto herhaald worden (auto-0_X, auto-1_X, ...) */
export const AUTO_FIELD_KEYS = [
  'wegenbelasting', 'brandstofOfLaden', 'apk',
  'onderhoudReservering', 'lease', 'afschrijving',
] as const;

export type AutoFieldKey = typeof AUTO_FIELD_KEYS[number];

// ════════════════════════════════════════════════════════════════
// FIELD CONSTRAINTS REGISTRY — Single Source of Truth
// ════════════════════════════════════════════════════════════════

export const FIELD_CONSTRAINTS_REGISTRY = {
  // ── SETUP VELDEN ─────────────────────────────────────────────
  
  aantalMensen: {
    type: 'number',
    required: true,
    min: 1,
    max: 10,
    warn: 6,
  },
  
  aantalVolwassen: {
    type: 'number',
    required: true,
    min: 1,
    max: 10,
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
  
  // ── HOUSEHOLD VELDEN (Member-templates) ──────────────────────
  
  name: {
    type: 'string',
    required: false,
    min: 1,
    max: 50,
  },
  
  age: {
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    warn: 100,
  },
  
  dob: {
    type: 'string',
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
  
  // ── INCOME VELDEN (Member-level) ─────────────────────────────
  
  nettoSalaris: {
    type: 'number',
    required: false,
    min: 0,
    max: 50000,
    warn: 20000,
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
    max: 5000,
    warn: 3000,
  },
  
  zorgtoeslag: {
    type: 'number',
    required: false,
    min: 0,
    max: 200,
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
  
  // ── INCOME VELDEN (Household-level) ──────────────────────────
  
  huurtoeslag: {
    type: 'number',
    required: false,
    min: 0,
    max: 500,
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
    max: 2000,
    warn: 1500,
  },
  
  kinderbijslag: {
    type: 'number',
    required: false,
    min: 0,
    max: 1000,
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
    max: 10000000,
    warn: 1000000,
  },
  
  // ── EXPENSE VELDEN (Wonen) ───────────────────────────────────
  
  kaleHuur: {
    type: 'number',
    required: false,
    min: 0,
    max: 5000,
    warn: 2000,
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
  
  // ── EXPENSE VELDEN (Nuts) ────────────────────────────────────
  
  energieGas: {
    type: 'number',
    required: false,
    min: 0,
    max: 1000,
    warn: 500,
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
  
  // ── EXPENSE VELDEN (Verzekeringen) ───────────────────────────
  
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
  
  // ── EXPENSE VELDEN (Abonnementen) ────────────────────────────
  
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
  
  // ── EXPENSE VELDEN (Per Persoon) ─────────────────────────────
  
  telefoon: {
    type: 'number',
    required: false,
    min: 0,
    max: 200,
    warn: 100,
  },
  
  ov: {
    type: 'number',
    required: false,
    min: 0,
    max: 500,
  },
  
  // ── EXPENSE VELDEN (Auto) ────────────────────────────────────
  
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
    warn: 500,
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
} as const satisfies Record<string, FieldConstraint>;

// ════════════════════════════════════════════════════════════════
// TYPE: Alle bekende veld-namen (compile-time)
// ════════════════════════════════════════════════════════════════

export type FieldId = keyof typeof FIELD_CONSTRAINTS_REGISTRY;

// ════════════════════════════════════════════════════════════════
// HELPERS (ongewijzigd qua gedrag)
// ════════════════════════════════════════════════════════════════

/** Haal constraint op — stript prefixes (mem_0_, auto-0_, streaming_X_) */
export function getConstraint(fieldId: string): FieldConstraint | undefined {
  const cleanId = fieldId.replace(/^(mem_\d+_|auto-\d+_|streaming_\w+_)/, '');
  return FIELD_CONSTRAINTS_REGISTRY[cleanId as FieldId];
}

/** Check of waarde boven soft-limit zit */
export function exceedsWarning(fieldId: string, value: number): boolean {
  const constraint = getConstraint(fieldId);
  if (constraint === undefined || constraint.type !== 'number' || constraint.warn === undefined) {
    return false;
  }
  return value > constraint.warn;
}

/** Haal warning-bericht op */
export function getWarningMessage(fieldId: string, value: number): string | null {
  if (!exceedsWarning(fieldId, value)) {
    return null;
  }

  const constraint = getConstraint(fieldId);
  const threshold = constraint?.type === 'number' ? constraint.warn : undefined;

  if (fieldId === 'nettoSalaris' && value > 20000) {
    return 'Dit lijkt een jaarbedrag - vul het maandbedrag in';
  }
  if (fieldId === 'vermogenWaarde' && value > 1000000) {
    return 'Let op: vermogen boven €1M kan invloed hebben op toeslagen';
  }

  return `Waarde is ongewoon hoog (>${threshold})`;
}
