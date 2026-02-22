// src/domain/registry/OptionsRegistry.ts
/**
 * @file_intent Beheert alle statische keuzelijsten (enums/options) voor de applicatie.
 * @repo_architecture Mobile Industry (MI) - De 'Data-Source' laag voor Primitives.
 * @term_definition OptionsKey = De naam van een optie-set. Options = De daadwerkelijke array met string-waarden.
 * @contract Wordt door EntryRegistry gebruikt via 'optionsKey' om keuzemogelijkheden aan een Entry te koppelen.
 * @ai_instruction Wijzig alleen waarden als de backend/state deze ondersteunt. Gebruik 'as const' voor strikte type-safety.
 */
export const GENERAL_OPTIONS = {
isBoolean: ['Ja', 'Nee'] as const,
};
/**
 * HOUSEHOLD OPTIONS
 * 
 * Single Source of Truth voor alle huishouden-gerelateerde opties
 */
export const HOUSEHOLD_OPTIONS = {
  gender: ['man', 'vrouw', 'anders', 'n.v.t.'] as const,
  
  burgerlijkeStaat: [
    'Alleenstaand',     // Auto-set bij 1 volwassene
    'Gehuwd',
    'Fiscaal Partners',
    'Samenwonend',
    'Bevriend',
    'Anders',
  ] as const,
  
  woningType: ['Koop', 'Huur', 'Kamer', 'Anders'] as const,
  
  // FIX: 'Een' → '' voor consistentie met UI
  autoCount: ['Geen', 'Een', 'Twee'] as const,
} as const;

/**
 * FINANCE OPTIONS
 * 
 * Single Source of Truth voor alle financiële opties
 */
export const FINANCE_OPTIONS = {
  incomeCategory: ['geen', 'werk', 'uitkering', 'anders'] as const,
  
  incomeFrequency: ['week', '4wk', 'month', 'quarter', 'year'] as const,
  
  uitkeringType: [
    'DUO',
    'Bijstand',
    'WW',
    'ZW',
    'WAO',
    'WGA',
    'WIA',
    'IVA',
    'WAJONG',
    'IOW',
    'Pensioen',
    'AOW',
    'anders'
  ] as const,
    
  streamingDiensten: [
    'Netflix',
    'Spotify',
    'Disney+',
    'Videoland',
    'HBO Max',
    'NPO Start',
    'Viaplay',
    'YouTube Premium'
  ] as const,
  
  verzekeringTypes: [
    'aansprakelijkheid',
    'reis',
    'opstal',
    'uitvaart',
    'rechtsbijstand',
    'overlijdensrisico'
  ] as const,
} as const;

/**
 * TYPE EXPORTS
 * 
 * Voor type-safety in de rest van de applicatie
 */
export type IsBoolean = typeof GENERAL_OPTIONS.isBoolean[number];

export type Gender = typeof HOUSEHOLD_OPTIONS.gender[number];
export type BurgerlijkeStaat = typeof HOUSEHOLD_OPTIONS.burgerlijkeStaat[number];
export type WoningType = typeof HOUSEHOLD_OPTIONS.woningType[number];
export type AutoCount = typeof HOUSEHOLD_OPTIONS.autoCount[number];

export type IncomeCategory = typeof FINANCE_OPTIONS.incomeCategory[number];
export type IncomeFrequency = typeof FINANCE_OPTIONS.incomeFrequency[number];
export type UitkeringType = typeof FINANCE_OPTIONS.uitkeringType[number];

export type StreamingDienst = typeof FINANCE_OPTIONS.streamingDiensten[number];
export type VerzekeringType = typeof FINANCE_OPTIONS.verzekeringTypes[number];

/**
 * ═══════════════════════════════════════════════════════════
 * OPTIONS REGISTRY OBJECT
 * ═══════════════════════════════════════════════════════════
 */

export const ALL_OPTIONS = {
  ...GENERAL_OPTIONS,
  ...HOUSEHOLD_OPTIONS,
  ...FINANCE_OPTIONS,
} as const;

export type OptionsRegistryKey = keyof typeof ALL_OPTIONS;

export const OptionsRegistry = {
  /**
   * Haalt de opties op voor een specifieke key.
   */
  getOptions: (key: OptionsRegistryKey): readonly string[] => ALL_OPTIONS[key],
  /**
   * Controleert of een key bestaat in de optie-sets.
   */
  isValidKey: (key: string): key is OptionsRegistryKey => (key in ALL_OPTIONS) === true,
  /**
   * Geeft alle beschikbare optie-sets terug.
   */
  getAllKeys: (): OptionsRegistryKey[] => Object.keys(ALL_OPTIONS) as OptionsRegistryKey[],
};