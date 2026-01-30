// src/domain/constants/registry.ts
// Single Source of Truth voor ID's en Keys

export const DATA_KEYS = {
  HOUSEHOLD: 'household',
  FINANCE: 'finance',
  SETUP: 'setup',
} as const;

export const SUB_KEYS = {
  MEMBERS: 'members',
  INCOME: 'income',
  EXPENSES: 'expenses',
} as const;

export const UX_TOKENS = {
  WIZARD: 'WIZARD',
  LANDING: 'LANDING',
  DASHBOARD: 'DASHBOARD',

  PAGES: {
    [DATA_KEYS.SETUP]: 'setup_page_title',
    [DATA_KEYS.HOUSEHOLD]: 'household_page_title',
    [DATA_KEYS.FINANCE]: 'finance_page_title',
    // VOEG DEZE TOE VOOR DE WIZARD CONFIGS:
    HOUSEHOLD_SETUP: 'setup_page_title',
    HOUSEHOLD_DETAILS: 'household_page_title',
    INCOME_DETAILS: 'finance_page_title',
    FIXED_EXPENSES: 'finance_page_title',
  },

  FIELDS: {
    CAR_COUNT: 'car_count_label',
    NAME: 'name_label',
  },
} as const;

export type PageToken = keyof typeof UX_TOKENS;
export type FieldToken = string;
