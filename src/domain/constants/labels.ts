// src/domain/constants/labels.ts

/**
 * Mapping van `UX_TOKENS` naar Nederlandse UI-teksten.
 *
 * @module domain/constants
 * @see {@link ./README.md | Constants — Details}
 * @see {@link ./uxTokens.ts | UX_TOKENS — token-definities}
 *
 * @remarks
 * `UI_LABELS` is het centrale "woordenboek" van de applicatie.
 * Voeg tekst **alleen** toe via een token uit `UX_TOKENS` — nooit een
 * nieuwe string-sleutel direct in dit object.
 *
 * `SCREEN_LABELS` is een legacy-alias voor de drie macro-navigatie-labels.
 * Zie TODO.md voor de verwijderingscandidate-status van dit object.
 */

import { UX_TOKENS } from './uxTokens';

/**
 * Volledig label-woordenboek: token → Nederlandse tekst.
 *
 * @example
 * const title = UI_LABELS[UX_TOKENS.SCREENS.HOUSEHOLD_SETUP]; // 'Huishouden Opzetten'
 */
export const UI_LABELS = {
  // ── Macro-navigatie ────────────────────────────────────────────────────────
  [UX_TOKENS.WIZARD]:    'Wizard',
  [UX_TOKENS.LANDING]:   'Welkom',
  [UX_TOKENS.DASHBOARD]: 'Dashboard',

  // ── Scherm-titels ──────────────────────────────────────────────────────────
  [UX_TOKENS.SCREENS.HOUSEHOLD_SETUP]:   'Huishouden Opzetten',
  [UX_TOKENS.SCREENS.HOUSEHOLD_DETAILS]: 'Samenstelling',
  [UX_TOKENS.SCREENS.INCOME_DETAILS]:    'Inkomsten & Lasten',
  [UX_TOKENS.SCREENS.FIXED_EXPENSES]:    'Vaste lasten',

  // ── Veld-labels ────────────────────────────────────────────────────────────
  [UX_TOKENS.FIELDS.CAR_COUNT]: "Aantal Auto's",
  [UX_TOKENS.FIELDS.NAME]:      'Naam',
};

/**
 * Shorthand-aliassen voor de drie macro-navigatie-labels.
 *
 * @remarks
 * Legacy object — waarden zijn identiek aan `UI_LABELS[UX_TOKENS.*]`.
 * Zie TODO.md §2 voor het verwijderingsvoorstel.
 *
 * @deprecated Gebruik `UI_LABELS[UX_TOKENS.WIZARD]` etc. direct.
 */
export const SCREEN_LABELS = {
  WIZARD:    UI_LABELS[UX_TOKENS.WIZARD],
  LANDING:   UI_LABELS[UX_TOKENS.LANDING],
  DASHBOARD: UI_LABELS[UX_TOKENS.DASHBOARD],
};
