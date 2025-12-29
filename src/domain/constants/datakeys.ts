// src/domain/constants/datakeys.ts

export const DATA_KEYS = {
    SETUP: 'setup',         // Vroeger C1
    HOUSEHOLD: 'household', // Vroeger C4
    FINANCE: 'finance',     // Vroeger C7
    EXPENSES: 'expenses',   // Vroeger C10
  } as const;
  
  /**
   * Deze mapping vertelt de FieldRenderer naar welke lade in de 
   * state hij moet kijken op basis van de pagina waar de gebruiker is.
   */
  export const WIZARD_KEYS = {
    '1setupHousehold': DATA_KEYS.SETUP,
    '2detailsHousehold': DATA_KEYS.HOUSEHOLD,
    '3incomeDetails': DATA_KEYS.FINANCE,
    '4fixedExpenses': DATA_KEYS.EXPENSES,
  } as const;
  
  export type WizardPageId = keyof typeof WIZARD_KEYS;
  export type DataKey = typeof DATA_KEYS[keyof typeof DATA_KEYS];