// src/domain/constants/uiSections.ts

/**
 * Unieke string-identifiers voor de functionele hoofdsecties van de UI.
 *
 * @module domain/constants
 * @see {@link ./README.md | Constants — Details}
 *
 * @remarks
 * `UI_SECTIONS` voorkomt "magic strings" bij state management, conditionele
 * rendering en routing. Waarden zijn in `snake_case`.
 *
 * Onderscheid met `ScreenRegistry`:
 * - `UI_SECTIONS` identificeert logische **secties** (een groep gerelateerde schermen).
 * - `ScreenRegistry` identificeert individuele **schermen** met hun render-configuratie.
 */

/**
 * Alle functionele UI-secties als `as const`-object.
 *
 * @example
 * if (activeSection === UI_SECTIONS.CSV_UPLOAD) { ... }
 */
export const UI_SECTIONS = {
  HOUSEHOLD_SETUP:    'household_setup',
  HOUSEHOLD_DETAILS:  'household_details',
  INCOME_DETAILS:     'income_details',
  FIXED_EXPENSES:     'fixed_expenses',
  CSV_UPLOAD:         'csv_upload',
  WIZARD:             'wizard',
} as const;

/**
 * Union van alle geldige `UI_SECTIONS`-sleutels (niet de waarden).
 *
 * @remarks
 * Dit is `keyof typeof UI_SECTIONS`, dus de uppercase keys zoals `'HOUSEHOLD_SETUP'`.
 * Voor de snake_case waarden: gebruik `typeof UI_SECTIONS[keyof typeof UI_SECTIONS]`.
 * Zie TODO.md §3 voor het voorstel om een `UISectionValue`-alias toe te voegen.
 */
export type UISection = keyof typeof UI_SECTIONS;
