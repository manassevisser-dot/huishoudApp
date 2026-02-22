/**
 * @file_intent Definieert de hoofdsleutels (`DATA_KEYS`) en subsleutels (`SUB_KEYS`) die worden gebruikt om data te structureren en op te slaan in de applicatie.
 * @repo_architecture Domain Layer - Constants.
 * @term_definition Data Key = Een top-level sleutel (bv. 'setup', 'finance') die een hoofdgedeelte van de applicatiestaat vertegenwoordigt. Sub Key = Een sleutel voor een geneste datastructuur binnen een Data Key (bv. 'members', 'income').
 * @contract Dit bestand exporteert `DATA_KEYS` en `SUB_KEYS` als `as const` objecten, en de corresponderende `DataKey` en `SubKey` types. Deze sleutels zijn de canonieke identificatoren voor data-opslag en -toegang via de `StorageAdapter`.
 * @ai_instruction Deze sleutels zijn de ruggengraat van de data-architectuur. Wees uiterst voorzichtig bij het wijzigen ervan, aangezien dit migraties van opgeslagen data kan vereisen. Gebruik altijd deze constanten in plaats van hardgecodeerde strings om dataconsistentie te garanderen.
 */
// src/domain/constants/datakeys.ts
export const DATA_KEYS = {
  SETUP: 'setup',
  HOUSEHOLD: 'household',
  FINANCE: 'finance',
  META: 'meta',
} as const;

export const SUB_KEYS = {
  MEMBERS: 'members',
  INCOME: 'income',
  EXPENSES: 'expenses',
  ITEMS: 'items',
} as const;

export type DataKey = (typeof DATA_KEYS)[keyof typeof DATA_KEYS];
export type SubKey = (typeof SUB_KEYS)[keyof typeof SUB_KEYS];
