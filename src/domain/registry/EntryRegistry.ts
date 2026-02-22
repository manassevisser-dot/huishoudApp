// src/domain/registry/EntryRegistry.ts
/**
 * @file_intent Centraal register dat UI-configuraties (Entries) koppelt aan state-keys (fieldIds).
 * @repo_architecture Mobile Industry (MI) - De 'Bridge'-laag. Zet abstracte domein-data om naar concrete UI-definities.
 * @term_definition EntryDefinition = UI-configuratie (label, primitive, rules). Key = De fieldId in de state.
 * @contract Elke entry MOET een primitiveType hebben en verwijst via zijn key naar een veld in de database/state.
 * @ai_instruction Dit is de UI-laag van het domein. Gebruik 'entry' voor UI-zaken. De keys in ENTRY_REGISTRY zijn 'fieldIds'.
 */

import { PRIMITIVE_TYPES, PrimitiveType } from './PrimitiveRegistry';
import { IBaseRegistry } from './BaseRegistry';
import type { VisibilityRuleName } from '@domain/rules/fieldVisibility';
import {
  GENERAL_OPTIONS,
  HOUSEHOLD_OPTIONS,
  FINANCE_OPTIONS,
} from '@domain/registry/OptionsRegistry';

type OptionsKey =
  | keyof typeof GENERAL_OPTIONS
  | keyof typeof HOUSEHOLD_OPTIONS
  | keyof typeof FINANCE_OPTIONS;

export interface EntryDefinition {
  primitiveType: PrimitiveType;
  labelToken: string;
  placeholderToken?: string;
  visibilityRuleName?: VisibilityRuleName;
  optionsKey?: OptionsKey;
  constraintsKey?: string;
  isDerived?: boolean;
  defaultValue?: unknown;
  fieldId?: string
  options?: readonly string[];
}

export const ENTRY_REGISTRY: Record<string, EntryDefinition> = {
  // ==================== HOUSEHOLD SETUP ====================
  aantalMensen: {
    primitiveType: PRIMITIVE_TYPES.COUNTER,
    labelToken: 'LABEL_AANTAL_MENSEN',
    constraintsKey: 'aantalMensen',
    defaultValue: 1,
  },
  aantalVolwassen: {
    primitiveType: PRIMITIVE_TYPES.COUNTER,
    labelToken: 'LABEL_AANTAL_VOLWASSENEN',
    visibilityRuleName: 'isAdultInputVisible',
    constraintsKey: 'aantalVolwassen',
  },
  kinderenLabel: {
    primitiveType: PRIMITIVE_TYPES.LABEL,
    labelToken: 'LABEL_KINDEREN',
    visibilityRuleName: 'calculateChildrenCount',
    isDerived: true,
  },
  autoCount: {
    primitiveType: PRIMITIVE_TYPES.RADIO,
    labelToken: 'LABEL_CAR_COUNT',
    optionsKey: 'autoCount',
    defaultValue: 'Geen',
  },
  heeftHuisdieren: {
    primitiveType: PRIMITIVE_TYPES.RADIO,
    labelToken: 'LABEL_HUISDIEREN',
    optionsKey: 'isBoolean',
    defaultValue: 'Nee',
  },

  // ==================== HOUSEHOLD DETAILS ====================
  burgerlijkeStaat: {
    primitiveType: PRIMITIVE_TYPES.CHIP_GROUP,
    labelToken: 'LABEL_BURGERLIJKE_STAAT',
    visibilityRuleName: 'showMaritalStatus',
    optionsKey: 'burgerlijkeStaat',
  },
  woningType: {
    primitiveType: PRIMITIVE_TYPES.CHIP_GROUP,
    labelToken: 'LABEL_WONING_TYPE',
    optionsKey: 'woningType',
    defaultValue: 'Huur',
  },
  postcode: {
    primitiveType: PRIMITIVE_TYPES.NUMBER,
    labelToken: 'LABEL_POSTCODE',
    placeholderToken: '1234',
    visibilityRuleName: 'showPostcode',
    constraintsKey: 'postcode',
  },

  // ==================== MEMBER ENTRYS ====================
  naam: {
    primitiveType: PRIMITIVE_TYPES.TEXT,
    labelToken: 'LABEL_NAME',
    placeholderToken: 'PLACEHOLDER_NAME',
    constraintsKey: 'naam',
  },
  geboortedatum: {
    primitiveType: PRIMITIVE_TYPES.DATE,
    labelToken: 'LABEL_DOB',
    constraintsKey: 'dob',
  },
  leeftijd: {
    primitiveType: PRIMITIVE_TYPES.NUMBER,
    labelToken: 'LABEL_AGE',
    constraintsKey: 'leeftijd',
  },
  gender: {
    primitiveType: PRIMITIVE_TYPES.CHIP_GROUP,
    labelToken: 'LABEL_GENDER',
    optionsKey: 'gender',
  },

  // ==================== INCOME ENTRYS ====================
  incomeCategory: {
    primitiveType: PRIMITIVE_TYPES.CHIP_GROUP_MULTIPLE,
    labelToken: 'LABEL_INCOME_CATS',
    optionsKey: 'incomeCategory',
  },
  aow_bedrag: {
    primitiveType: PRIMITIVE_TYPES.CURRENCY,
    labelToken: 'LABEL_AOW_BEDRAG',
    placeholderToken: '0.00',
    visibilityRuleName: 'isPensionado',
    constraintsKey: 'nettoSalaris',
  },
  nettoSalaris: {
    primitiveType: PRIMITIVE_TYPES.CURRENCY,
    labelToken: 'LABEL_NETTO_SALARIS',
    placeholderToken: '0.00',
    visibilityRuleName: 'hasWorkSelected',
    constraintsKey: 'nettoSalaris',
  },
  frequentie: {
    primitiveType: PRIMITIVE_TYPES.CHIP_GROUP,
    labelToken: 'LABEL_FREQUENTIE',
    optionsKey: 'incomeFrequency',
  },
  vakantiegeldPerJaar: {
    primitiveType: PRIMITIVE_TYPES.CURRENCY,
    labelToken: 'LABEL_VAKANTIEGELD_JAAR',
    placeholderToken: '0.00',
    constraintsKey: 'vakantiegeldPerJaar',
  },
  uitkeringType: {
    primitiveType: PRIMITIVE_TYPES.CHIP_GROUP_MULTIPLE,
    labelToken: 'LABEL_UITKERING_TYPE',
    visibilityRuleName: 'hasBenefitSelected',
    optionsKey: 'uitkeringType',
  },

  // ==================== EXPENSES ====================
  zorgtoeslag: {
    primitiveType: PRIMITIVE_TYPES.CURRENCY,
    labelToken: 'LABEL_ZORGTOESLAG',
    placeholderToken: 'LABEL_ZORGTOESLAG_PM',
    constraintsKey: 'zorgtoeslag',
  },
  reiskosten: {
    primitiveType: PRIMITIVE_TYPES.CURRENCY,
    labelToken: 'LABEL_REISKOSTEN',
    placeholderToken: '0.00',
    constraintsKey: 'reiskosten',
  },
  overigeInkomsten: {
    primitiveType: PRIMITIVE_TYPES.CURRENCY,
    labelToken: 'LABEL_OVERIGE_INKOMSTEN',
    placeholderToken: '0.00',
    constraintsKey: 'overigeInkomsten',
  },
  huurtoeslag: {
    primitiveType: PRIMITIVE_TYPES.CURRENCY,
    labelToken: 'LABEL_HUURTOESLAG',
    placeholderToken: '0.00',
    visibilityRuleName: 'showHuurtoeslag',
    constraintsKey: 'huurtoeslag',
  },
  kindgebondenBudget: {
    primitiveType: PRIMITIVE_TYPES.CURRENCY,
    labelToken: 'LABEL_KGB',
    placeholderToken: '0.00',
    visibilityRuleName: 'showKgb',
    constraintsKey: 'kindgebondenBudget',
  },
  kaleHuur: {
    primitiveType: PRIMITIVE_TYPES.CURRENCY,
    labelToken: 'LABEL_KALE_HUUR',
    placeholderToken: '0.00',
    visibilityRuleName: 'isWoningHuur',
    constraintsKey: 'kaleHuur',
  },
  hypotheekBruto: {
    primitiveType: PRIMITIVE_TYPES.CURRENCY,
    labelToken: 'LABEL_HYPOTHEEK_BRUTO',
    placeholderToken: '0.00',
    visibilityRuleName: 'isWoningKoop',
    constraintsKey: 'hypotheekBruto',
  },
  ozb: {
    primitiveType: PRIMITIVE_TYPES.CURRENCY,
    labelToken: 'LABEL_OZB',
    placeholderToken: '0.00',
    visibilityRuleName: 'isWoningKoop',
    constraintsKey: 'ozb',
  },
  energieGas: {
    primitiveType: PRIMITIVE_TYPES.CURRENCY,
    labelToken: 'LABEL_ENERGIE_GAS',
    placeholderToken: '0.00',
    constraintsKey: 'energieGas',
  },
  water: {
    primitiveType: PRIMITIVE_TYPES.CURRENCY,
    labelToken: 'LABEL_WATER',
    placeholderToken: '0.00',
    constraintsKey: 'water',
  },
  wegenbelasting: {
    primitiveType: PRIMITIVE_TYPES.CURRENCY,
    labelToken: 'LABEL_WEGENBELASTING',
    placeholderToken: '0.00',
    visibilityRuleName: 'hasCars',
    constraintsKey: 'wegenbelasting',
  },
  ziektekostenPremie: {
    primitiveType: PRIMITIVE_TYPES.CURRENCY,
    labelToken: 'LABEL_ZIEKTEKOST_PREMIE',
    placeholderToken: '0.00',
    constraintsKey: 'ziektekostenPremie',
  },
  aansprakelijkheid: {
    primitiveType: PRIMITIVE_TYPES.CURRENCY,
    labelToken: 'LABEL_AANSPRAKELIJKHEID',
    placeholderToken: '0.00',
    constraintsKey: 'aansprakelijkheid',
  },
  reis: {
    primitiveType: PRIMITIVE_TYPES.CURRENCY,
    labelToken: 'LABEL_REIS',
    placeholderToken: '0.00',
    constraintsKey: 'reis',
  },
  opstal: {
    primitiveType: PRIMITIVE_TYPES.CURRENCY,
    labelToken: 'LABEL_OPSTAL',
    placeholderToken: '0.00',
    constraintsKey: 'opstal',
  },
  internetTv: {
    primitiveType: PRIMITIVE_TYPES.CURRENCY,
    labelToken: 'LABEL_INTERNET_TV',
    placeholderToken: '0.00',
    constraintsKey: 'internetTv',
  },
  sport: {
    primitiveType: PRIMITIVE_TYPES.CURRENCY,
    labelToken: 'LABEL_SPORT',
    placeholderToken: '0.00',
    constraintsKey: 'sport',
  },
  lezen: {
    primitiveType: PRIMITIVE_TYPES.CURRENCY,
    labelToken: 'LABEL_LEZEN',
    placeholderToken: '0.00',
    constraintsKey: 'lezen',
  },
  telefoon: {
    primitiveType: PRIMITIVE_TYPES.CURRENCY,
    labelToken: 'LABEL_TELEFOON',
    placeholderToken: '0.00',
    constraintsKey: 'telefoon',
  },
};
export function resolveFieldId(
  entryId: string,
  entry: EntryDefinition
): string {
  // 1) constraintsKey heeft PRIORITEIT als FormState-veld
  if (entry.constraintsKey != null && entry.constraintsKey !== '') {
    return entry.constraintsKey;
  }
    // 2) fallback naar de entryId
  return entryId;
}

export const EntryRegistry: IBaseRegistry<string, EntryDefinition> = {
  // Gebruik ternary om de 'always true' object-waarschuwing te voorkomen
  getDefinition: (key: string) => (key in ENTRY_REGISTRY) ? ENTRY_REGISTRY[key] : null, 
  // Expliciete boolean vergelijking voor de linter
  isValidKey: (key: string): key is string => (key in ENTRY_REGISTRY) === true,
  getAllKeys: () => Object.keys(ENTRY_REGISTRY),
};