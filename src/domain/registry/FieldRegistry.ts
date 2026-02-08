// src/domain/registry/FieldRegistry.ts

// 1. Importeer types uit ComponentRegistry (SSOT)
import { COMPONENT_TYPES, ComponentType } from './ComponentRegistry';

// 2. Importeer de geldige visibility regelnamen (type) uit de engine
import type { VisibilityRuleName } from '@domain/rules/fieldVisibility';

import {
  GENERAL_OPTIONS,
  HOUSEHOLD_OPTIONS,
  FINANCE_OPTIONS,
} from '@domain/registry/options';

type OptionsKey =
  | keyof typeof GENERAL_OPTIONS
  | keyof typeof HOUSEHOLD_OPTIONS
  | keyof typeof FINANCE_OPTIONS;

export interface FieldDefinition {
  componentType: ComponentType;
  labelToken: string;
  placeholderToken?: string;

  // Type-safe: alleen regelnamen die werkelijk in fieldVisibilityRules bestaan
  visibilityRuleName?: VisibilityRuleName;

  optionsKey?: OptionsKey;
  constraintsKey?: string;
  uiModel?: 'numericWrapper' | 'collapsible' | 'swipeable' | 'readonly';
  isDerived?: boolean;
  defaultValue?: unknown;

  // 🆕 Voor field grouping
  // Bijv: 'werktoeslagen', 'verzekeringen'
  groupId?: string;
}

export const FIELD_REGISTRY: Record<string, FieldDefinition> = {
  // ==================== HOUSEHOLD SETUP ====================

  aantalMensen: {
    componentType: 'counter',
    labelToken: 'LABEL_AANTAL_MENSEN',
    uiModel: 'numericWrapper',
    constraintsKey: 'aantalMensen',
    defaultValue: 1,
  },

  aantalVolwassen: {
    componentType: 'counter',
    labelToken: 'LABEL_AANTAL_VOLWASSENEN',
    visibilityRuleName: 'isAdultInputVisible',
    constraintsKey: 'aantalVolwassen',
    uiModel: 'numericWrapper',
  },

  kinderenLabel: {
    componentType: 'label',
    labelToken: 'LABEL_KINDEREN',
    visibilityRuleName: 'calculateChildrenCount',
    isDerived: true,
  },

  autoCount: {
    componentType: 'radio',
    labelToken: 'LABEL_CAR_COUNT',
    optionsKey: 'autoCount',
    defaultValue: 'Geen',
  },

  heeftHuisdieren: {
    componentType: 'radio',
    labelToken: 'LABEL_HUISDIEREN',
    optionsKey: 'isBoolean',
    defaultValue: 'Nee',
  },

  // ==================== HOUSEHOLD DETAILS ====================

  burgerlijkeStaat: {
    componentType: 'chip-group',
    labelToken: 'LABEL_BURGERLIJKE_STAAT',
    visibilityRuleName: 'showMaritalStatus',
    optionsKey: 'burgerlijkeStaat',
  },

  woningType: {
    componentType: 'chip-group',
    labelToken: 'LABEL_WONING_TYPE',
    optionsKey: 'woningType',
    defaultValue: 'Huur',
  },

  postcode: {
    componentType: 'number',
    labelToken: 'LABEL_POSTCODE',
    placeholderToken: '1234',
    visibilityRuleName: 'showPostcode',
    constraintsKey: 'postcode',
  },

  // ==================== MEMBER FIELDS ====================

  naam: {
    componentType: 'text',
    labelToken: 'LABEL_NAME',
    placeholderToken: 'PLACEHOLDER_NAME',
    constraintsKey: 'naam',
  },

  // 2. Geboortedatum toegevoegd met correcte constante
  geboortedatum: {
    componentType: COMPONENT_TYPES.DATE,
    labelToken: 'LABEL_DOB',
    constraintsKey: 'dob',
  },

  leeftijd: {
    componentType: 'number',
    labelToken: 'LABEL_AGE',
    constraintsKey: 'leeftijd',
  },

  gender: {
    componentType: 'chip-group',
    labelToken: 'LABEL_GENDER',
    optionsKey: 'gender',
  },

  // ==================== INCOME FIELDS ====================

  incomeCategory: {
    componentType: 'chip-group-multiple',
    labelToken: 'LABEL_INCOME_CATS',
    optionsKey: 'incomeCategory',
  },

  aow_bedrag: {
    componentType: 'currency',
    labelToken: 'LABEL_AOW_BEDRAG',
    placeholderToken: '0.00',
    visibilityRuleName: 'isPensionado',
    constraintsKey: 'nettoSalaris',
  },

  nettoSalaris: {
    componentType: 'currency',
    labelToken: 'LABEL_NETTO_SALARIS',
    placeholderToken: '0.00',
    visibilityRuleName: 'hasWorkSelected',
    constraintsKey: 'nettoSalaris',
  },

  frequentie: {
    componentType: 'chip-group',
    labelToken: 'LABEL_FREQUENTIE',
    optionsKey: 'incomeFrequency',
  },

  vakantiegeldPerJaar: {
    componentType: 'currency',
    labelToken: 'LABEL_VAKANTIEGELD_JAAR',
    placeholderToken: '0.00',
    constraintsKey: 'vakantiegeldPerJaar',
  },

  uitkeringType: {
    componentType: 'chip-group-multiple',
    labelToken: 'LABEL_UITKERING_TYPE',
    visibilityRuleName: 'hasBenefitSelected',
    optionsKey: 'uitkeringType',
  },

  // 🆕 TOESLAGEN GROEP
  zorgtoeslag: {
    componentType: 'currency',
    labelToken: 'LABEL_ZORGTOESLAG',
    placeholderToken: 'LABEL_ZORGTOESLAG_PM',
    constraintsKey: 'zorgtoeslag',
    groupId: 'werktoeslagen',
  },

  reiskosten: {
    componentType: 'currency',
    labelToken: 'LABEL_REISKOSTEN',
    placeholderToken: '0.00',
    constraintsKey: 'reiskosten',
    groupId: 'werktoeslagen',
  },

  overigeInkomsten: {
    componentType: 'currency',
    labelToken: 'LABEL_OVERIGE_INKOMSTEN',
    placeholderToken: '0.00',
    constraintsKey: 'overigeInkomsten',
    groupId: 'werktoeslagen',
  },

  // ==================== HOUSEHOLD BENEFITS ====================

  huurtoeslag: {
    componentType: 'currency',
    labelToken: 'LABEL_HUURTOESLAG',
    placeholderToken: '0.00',
    visibilityRuleName: 'showHuurtoeslag',
    constraintsKey: 'huurtoeslag',
  },

  kindgebondenBudget: {
    componentType: 'currency',
    labelToken: 'LABEL_KGB',
    placeholderToken: '0.00',
    visibilityRuleName: 'showKgb',
    constraintsKey: 'kindgebondenBudget',
  },

  // ==================== EXPENSES - HOUSING ====================

  kaleHuur: {
    componentType: 'currency',
    labelToken: 'LABEL_KALE_HUUR',
    placeholderToken: '0.00',
    visibilityRuleName: 'isWoningHuur',
    constraintsKey: 'kaleHuur',
  },

  hypotheekBruto: {
    componentType: 'currency',
    labelToken: 'LABEL_HYPOTHEEK_BRUTO',
    placeholderToken: '0.00',
    visibilityRuleName: 'isWoningKoop',
    constraintsKey: 'hypotheekBruto',
  },

  ozb: {
    componentType: 'currency',
    labelToken: 'LABEL_OZB',
    placeholderToken: '0.00',
    visibilityRuleName: 'isWoningKoop',
    constraintsKey: 'ozb',
  },

  energieGas: {
    componentType: 'currency',
    labelToken: 'LABEL_ENERGIE_GAS',
    placeholderToken: '0.00',
    constraintsKey: 'energieGas',
  },

  water: {
    componentType: 'currency',
    labelToken: 'LABEL_WATER',
    placeholderToken: '0.00',
    constraintsKey: 'water',
  },

  // ==================== EXPENSES - AUTO ====================

  wegenbelasting: {
    componentType: 'currency',
    labelToken: 'LABEL_WEGENBELASTING',
    placeholderToken: '0.00',
    visibilityRuleName: 'hasCars', // was: 'car_repeater'
    constraintsKey: 'wegenbelasting',
  },

  // ==================== EXPENSES - INSURANCE ====================

  ziektekostenPremie: {
    componentType: 'currency',
    labelToken: 'LABEL_ZIEKTEKOST_PREMIE',
    placeholderToken: '0.00',
    constraintsKey: 'ziektekostenPremie',
  },

  // 🆕 VERZEKERINGEN GROEP
  aansprakelijkheid: {
    componentType: 'currency',
    labelToken: 'LABEL_AANSPRAKELIJKHEID',
    placeholderToken: '0.00',
    constraintsKey: 'aansprakelijkheid',
    groupId: 'overige_verzekeringen',
  },

  reis: {
    componentType: 'currency',
    labelToken: 'LABEL_REIS',
    placeholderToken: '0.00',
    constraintsKey: 'reis',
    groupId: 'overige_verzekeringen',
  },

  opstal: {
    componentType: 'currency',
    labelToken: 'LABEL_OPSTAL',
    placeholderToken: '0.00',
    constraintsKey: 'opstal',
    groupId: 'overige_verzekeringen',
  },

  // ==================== EXPENSES - SUBSCRIPTIONS ====================

  // 🆕 ABONNEMENTEN GROEP
  internetTv: {
    componentType: 'currency',
    labelToken: 'LABEL_INTERNET_TV',
    placeholderToken: '0.00',
    constraintsKey: 'internetTv',
    groupId: 'abonnementen',
  },

  sport: {
    componentType: 'currency',
    labelToken: 'LABEL_SPORT',
    placeholderToken: '0.00',
    constraintsKey: 'sport',
    groupId: 'abonnementen',
  },

  lezen: {
    componentType: 'currency',
    labelToken: 'LABEL_LEZEN',
    placeholderToken: '0.00',
    constraintsKey: 'lezen',
    groupId: 'abonnementen',
  },

  telefoon: {
    componentType: 'currency',
    labelToken: 'LABEL_TELEFOON',
    placeholderToken: '0.00',
    constraintsKey: 'telefoon',
  },
};

// 🆕 Helper: Get group label token
export function getGroupLabelToken(groupId: string): string {
  // Mapping van groupId naar labelToken
  const groupLabels: Record<string, string> = {
    werktoeslagen: 'LABEL_TOESLAGEN',
    overige_verzekeringen: 'LABEL_OVERIGE_VERZEKERINGEN',
    abonnementen: 'LABEL_ABONNEMENTEN',
  };

  return groupLabels[groupId] ?? `LABEL_${groupId.toUpperCase()}`;
}

export function getFieldDefinition(fieldId: string): FieldDefinition | null {
  return FIELD_REGISTRY[fieldId] ?? null;
}

export function isKnownField(fieldId: string): boolean {
  return fieldId in FIELD_REGISTRY;
}

export function getFieldsByComponentType(type: ComponentType): string[] {
  return Object.entries(FIELD_REGISTRY)
    .filter(([_, def]) => def.componentType === type)
    .map(([fieldId]) => fieldId);
}