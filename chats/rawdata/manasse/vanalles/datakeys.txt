// src/domain/constants/datakeys.ts
// COMPUTER-ONLY (English)

export const DATA_KEYS = {
  SETUP: 'setup',
  HOUSEHOLD: 'household',
  FINANCE: 'finance',
  META: 'meta'
} as const;

export const SUB_KEYS = {
  MEMBERS: 'members',
  INCOME: 'income',
  EXPENSES: 'expenses',
  ITEMS: 'items',
  LAST_MODIFIED: 'lastModified',
  VERSION: 'version'
} as const;

export const STEP_IDS = {
  LANDING: 'LANDING',
  START: 'start'
} as const;