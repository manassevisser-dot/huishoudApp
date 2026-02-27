// src/domain/constants/uxTokens.ts

/**
 * Semantische tokens die UI-elementen identificeren, ontkoppeld van hun weergavetekst.
 *
 * @module domain/constants
 * @see {@link ./README.md | Constants — Details}
 *
 * @remarks
 * `UX_TOKENS` zijn stabiele, betekenisvolle sleutels. De bijbehorende
 * Nederlandse tekst leeft in `labels.ts` (`UI_LABELS`).
 *
 * Workflow bij een nieuw gelabeld element:
 * 1. Voeg een token toe in de juiste categorie hier.
 * 2. Voeg de Nederlandse tekst toe in `UI_LABELS` in `labels.ts`.
 */

/**
 * Alle semantische UX-tokens, gegroepeerd per categorie.
 *
 * @example
 * const title = UI_LABELS[UX_TOKENS.SCREENS.HOUSEHOLD_SETUP]; // 'Huishouden Opzetten'
 */
export const UX_TOKENS = {
  /** Token voor de wizard-flow als geheel. */
  WIZARD:    'WIZARD',
  /** Token voor het welkomstscherm. */
  LANDING:   'LANDING',
  /** Token voor het dashboard. */
  DASHBOARD: 'DASHBOARD',

  /** Scherm-titels. Waarden zijn de stabiele token-strings die `UI_LABELS` opzoekt. */
  SCREENS: {
    HOUSEHOLD_SETUP:   'setup_screen_title',
    HOUSEHOLD_DETAILS: 'household_screen_title',
    INCOME_DETAILS:    'finance_screen_title',
    FIXED_EXPENSES:    'fixed_expenses_screen_title',
  },

  /** Veld-labels. Waarden zijn de stabiele token-strings die `UI_LABELS` opzoekt. */
  FIELDS: {
    AANTAL_MENSEN:      'LABEL_AANTAL_MENSEN',
    AANTAL_VOLWASSENEN: 'LABEL_AANTAL_VOLWASSENEN',
    KINDEREN:           'LABEL_KINDEREN',
    CAR_COUNT:          'car_count_label',
    NAME:               'name_label',
    AGE:                'age_label',
    BRUTO_INCOME:       'LABEL_BRUTO_INKOMEN',
    INCOME_MEMBER:      'LABEL_INKOMEN_PER_LID',
    AUTO_INSURANCE:     'LABEL_AUTO_VERZEKERING',
    CAR_REPEATER:       'LABEL_AUTO_FORMS',
  },
} as const;
