
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

export type DataKey = typeof DATA_KEYS[keyof typeof DATA_KEYS];
export type SubKey = typeof SUB_KEYS[keyof typeof SUB_KEYS];
