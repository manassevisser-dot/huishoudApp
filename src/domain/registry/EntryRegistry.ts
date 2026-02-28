// src/domain/registry/EntryRegistry.ts
/**
 * Centraal register dat UI-configuraties (`EntryDefinition`) koppelt aan state-keys (`fieldId`).
 *
 * @module domain/registry
 * @see {@link ./README.md | EntryRegistry — Details}
 *
 * @remarks
 * Elke entry vereist een `primitiveType`. Keys in `ENTRY_REGISTRY` zijn `fieldId`s in de FormState.
 */

import { PRIMITIVE_TYPES, PrimitiveType } from './PrimitiveRegistry';

/**
 * Semantische intentie voor de visuele weergave van een ACTION primitive.
 *
 * @remarks
 * `StyleIntent` is een domein-concept: het beschrijft de **betekenis** van een actie
 * ("dit is gevaarlijk", "dit is de primaire weg"), niet het uiterlijk. Het uiterlijk
 * wordt bepaald door de UI-laag via `ACTION_STYLE_MAP` in `entry.mappers.ts`.
 *
 * Hierdoor kan het domein beslissen over intentie zonder te weten welke kleur
 * "destructive" heeft in het huidige thema — een DDD-zuivere scheiding.
 *
 * | Waarde        | Betekenis                                    | Voorbeeld entries          |
 * |---------------|----------------------------------------------|----------------------------|
 * | `'primary'`   | Primaire actie, meest prominent              | `startWizard`              |
 * | `'secondary'` | Ondersteunende actie, minder prominent       | `goToDashboard`            |
 * | `'neutral'`   | Neutraal, geen sterke visuele lading         | `goToSettings`, `undoAction`|
 * | `'destructive'`| Onomkeerbare of gevaarlijke actie           | `goToReset`, `clearAllAction`|
 *
 * @architectural_layer Domain — geëxporteerd naar UI via `RenderEntryVM.styleIntent`
 */
export type StyleIntent = 'primary' | 'secondary' | 'neutral' | 'destructive';
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
  fieldId?: string;
  options?: readonly string[];
  /** Alleen voor ACTION primitives: de scherm-ID waarnaar genavigeerd wordt. */
  navigationTarget?: string;
  /** Alleen voor ACTION primitives: het reducer-command dat ge-dispatched wordt (bijv. 'UNDO'). */
  commandTarget?: string;
  /**
   * Semantische intentie voor de visuele weergave — uitsluitend relevant voor ACTION primitives.
   *
   * @remarks
   * Bepaalt welke `AppStyles`-sleutel de UI-mapper kiest via `ACTION_STYLE_MAP`.
   * Stel in op `'destructive'` voor onomkeerbare of gevaarlijke acties (reset, clear-all),
   * `'secondary'` voor ondersteunende knoppen (bijv. inloggen naast aanmelden).
   *
   * Wanneer weggelaten valt de mapper terug op `'primary'` (standaard primaire knopstijl).
   *
   * @see {@link StyleIntent} voor alle geldige waarden en hun betekenis
   * @see `ACTION_STYLE_MAP` in `entry.mappers.ts` voor de vertaling naar stijlsleutels
   */
  styleIntent?: StyleIntent;
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
    primitiveType: PRIMITIVE_TYPES.TEXT,
    labelToken: 'LABEL_POSTCODE',
    placeholderToken: '1234AB',
    // Geen visibilityRuleName: altijd zichtbaar, required
    constraintsKey: 'postcode',
  },

  // ==================== MEMBER ENTRIES ====================
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

  // ==================== INCOME ENTRIES ====================
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

  // ==================== LANDING ACTIES ====================
  // navigationTarget 'WIZARD' → MasterOrchestrator.navigateTo() → navigation.startWizard()
  // navigationTarget 'DASHBOARD' → navigation.goToDashboard()
  // Beide altijd zichtbaar (geen visibilityRuleName): isAction=true bypass in UIOrchestrator.
  startWizard: {
    primitiveType: PRIMITIVE_TYPES.ACTION,
    labelToken: 'startWizard',
    navigationTarget: 'WIZARD',
  },
  goToDashboard: {
    primitiveType: PRIMITIVE_TYPES.ACTION,
    labelToken: 'goToDashboard',
    navigationTarget: 'DASHBOARD',
    styleIntent: 'secondary',
  },

  // ==================== OPTIONS NAVIGATIE ====================
  goToSettings: {
    primitiveType: PRIMITIVE_TYPES.ACTION,
    labelToken: 'goToSettings',
    navigationTarget: 'SETTINGS',
  },
  goToCsvUpload: {
    primitiveType: PRIMITIVE_TYPES.ACTION,
    labelToken: 'goToCsvUpload',
    navigationTarget: 'CSV_UPLOAD',
  },
  goToReset: {
    primitiveType: PRIMITIVE_TYPES.ACTION,
    labelToken: 'goToReset',
    navigationTarget: 'RESET',
    styleIntent: 'destructive',
  },

  // ==================== UNDO SCHERM ACTIES ====================
  undoAction: {
    primitiveType: PRIMITIVE_TYPES.ACTION,
    labelToken: 'undoAction',
    commandTarget: 'UNDO',
  },
  redoAction: {
    primitiveType: PRIMITIVE_TYPES.ACTION,
    labelToken: 'redoAction',
    commandTarget: 'REDO',
  },
  clearAllAction: {
    primitiveType: PRIMITIVE_TYPES.ACTION,
    labelToken: 'clearAllAction',
    commandTarget: 'CLEAR_ALL',
    styleIntent: 'destructive',
  },

  // ==================== SETTINGS ====================
  darkModeToggle: {
    primitiveType: PRIMITIVE_TYPES.TOGGLE,
    labelToken: 'darkModeLabel',
    /**
     * constraintsKey 'theme' koppelt aan de valueResolver in MasterOrchestrator.
     * fso.getValue('theme') wordt nooit aangeroepen — de valueResolver onderschept.
     * De onChange-callback stuurt true/false naar MasterOrchestrator.updateField('theme', value),
     * dat wordt doorgestuurd naar SettingsWorkflow (niet naar validatiepipeline).
     */
    constraintsKey: 'theme',
    options: ['light', 'dark'] as const,
  },

  // ==================== DAILY TRANSACTION INPUT ====================
  dailyTransactionDate: {
    primitiveType: PRIMITIVE_TYPES.DATE,
    labelToken: 'LABEL_TRANSACTION_DATE',
    placeholderToken: 'TODAY',
    constraintsKey: 'latestTransactionDate',
  },
  dailyTransactionAmount: {
    primitiveType: PRIMITIVE_TYPES.CURRENCY,
    labelToken: 'LABEL_AMOUNT',
    placeholderToken: '0.00',
    constraintsKey: 'latestTransactionAmount',
  },
  dailyTransactionCategory: {
    primitiveType: PRIMITIVE_TYPES.CHIP_GROUP,
    labelToken: 'LABEL_CATEGORY',
    optionsKey: 'EXPENSE_CATEGORIES',
    constraintsKey: 'latestTransactionCategory',
  },
  dailyTransactionDescription: {
    primitiveType: PRIMITIVE_TYPES.TEXT,
    labelToken: 'LABEL_DESCRIPTION',
    placeholderToken: 'PLACEHOLDER_OPTIONAL_NOTE',
    constraintsKey: 'latestTransactionDescription',
  },
  dailyPaymentMethod: {
    primitiveType: PRIMITIVE_TYPES.CHIP_GROUP,
    labelToken: 'LABEL_PAYMENT_METHOD',
    optionsKey: 'PAYMENT_METHODS',
    constraintsKey: 'latestPaymentMethod',
  },
};
/**
 * Bepaalt het FormState-veld-ID voor een entry: `constraintsKey` heeft prioriteit boven `entryId`.
 *
 * @param entryId - Sleutel in `ENTRY_REGISTRY`
 * @param entry   - Bijbehorende `EntryDefinition`
 * @returns Het te gebruiken `fieldId` voor FormState-toegang
 */
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

/**
 * Runtime lookup-service voor `EntryDefinition` op basis van `entryId`.
 *
 * @example
 * const def = EntryRegistry.getDefinition('nettoSalaris');
 */
export const EntryRegistry: IBaseRegistry<string, EntryDefinition> = {
  // Gebruik ternary om de 'always true' object-waarschuwing te voorkomen
  getDefinition: (key: string) => (key in ENTRY_REGISTRY) ? ENTRY_REGISTRY[key] : null, 
  // Expliciete boolean vergelijking voor de linter
  isValidKey: (key: string): key is string => (key in ENTRY_REGISTRY) === true,
  getAllKeys: () => Object.keys(ENTRY_REGISTRY),
};