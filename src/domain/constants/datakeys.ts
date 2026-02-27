// src/domain/constants/datakeys.ts

/**
 * Canonieke sleutels voor opslag en toegang tot `FormState`-secties.
 *
 * @module domain/constants
 * @see {@link ./README.md | Constants — Details}
 *
 * @remarks
 * `DATA_KEYS` en `SUB_KEYS` zijn de enige toegestane strings voor opslag via
 * `PersistenceAdapter`. Gebruik altijd deze constanten — nooit hardcoded strings —
 * om data-consistentie te garanderen bij AsyncStorage-migraties.
 *
 * ⚠️ Wijzig bestaande waarden alleen samen met een storage-migratie;
 * bestaande opgeslagen data gebruikt de huidige string-waarden als sleutel.
 */

/**
 * Top-level sleutels voor de hoofdsecties van de applicatie-state.
 *
 * @example
 * const setup = state.data[DATA_KEYS.SETUP];
 */
export const DATA_KEYS = {
  SETUP:              'setup',
  HOUSEHOLD:          'household',
  FINANCE:            'finance',
  META:               'meta',
  LATEST_TRANSACTION: 'latestTransaction',
  CSV_IMPORT:         'csvImport',
} as const;

/**
 * Geneste sleutels binnen een `DATA_KEYS`-sectie.
 *
 * @example
 * const members = state.data[DATA_KEYS.HOUSEHOLD][SUB_KEYS.MEMBERS];
 */
export const SUB_KEYS = {
  MEMBERS:  'members',
  INCOME:   'income',
  EXPENSES: 'expenses',
  ITEMS:    'items',
} as const;

/** Union van alle top-level data-sleutels. */
export type DataKey = (typeof DATA_KEYS)[keyof typeof DATA_KEYS];

/** Union van alle geneste sub-sleutels. */
export type SubKey = (typeof SUB_KEYS)[keyof typeof SUB_KEYS];
