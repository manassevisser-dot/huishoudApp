/**
 * 🛠️ PHOENIX REGISTRY
 * Computer Identificatie (English) vs UX Tokens (Dutch)
 */

// 1. DATA_KEYS: Waar de data WOONT in de state (Engels)
export const DATA_KEYS = {
    SETUP: 'setup',         // Vroeger C1
    HOUSEHOLD: 'household', // Vroeger C4
    FINANCE: 'finance',     // Vroeger C7 & C10
    META: 'meta'
  } as const;
  
  // 2. SUB_KEYS: De lades binnen de data (Engels)
  export const SUB_KEYS = {
    MEMBERS: 'members',
    INCOME: 'income',
    EXPENSES: 'expenses',
    ITEMS: 'items'
  } as const;
  
  // 3. UX_TOKENS: Verwijzingen naar de UX-laag (Sleutels, geen hardcoded tekst)
  export const UX_TOKENS = {
    PAGES: {
      [DATA_KEYS.SETUP]: 'WIZARD_PAGE_SETUP_LABEL',
      [DATA_KEYS.HOUSEHOLD]: 'WIZARD_PAGE_HOUSEHOLD_LABEL',
      [DATA_KEYS.FINANCE]: 'WIZARD_PAGE_FINANCE_LABEL'
    },
    FIELDS: {
      ADULTS: 'FIELD_ADULTS_COUNT_LABEL',
      CHILDREN: 'FIELD_CHILDREN_COUNT_LABEL'
    }
  } as const;