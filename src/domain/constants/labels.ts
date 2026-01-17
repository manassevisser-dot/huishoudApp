import { UX_TOKENS } from './registry';

// Mapping van Token ID -> Leesbare Tekst (NL)
export const UI_LABELS = {
  // Top Level Navigation
  [UX_TOKENS.WIZARD]: 'Wizard',
  [UX_TOKENS.LANDING]: 'Welkom',
  [UX_TOKENS.DASHBOARD]: 'Dashboard',

  // Page Titles (Via de nested keys in registry)
  [UX_TOKENS.PAGES.setup]: 'Huishouden Opzetten',
  [UX_TOKENS.PAGES.household]: 'Samenstelling',
  [UX_TOKENS.PAGES.finance]: 'Inkomsten & Lasten',

  // Field Labels
  [UX_TOKENS.FIELDS.CAR_COUNT]: "Aantal Auto's",
  [UX_TOKENS.FIELDS.NAME]: 'Naam',
};

// Legacy support: PAGE_LABELS
// We leiden dit af uit UI_LABELS om duplicatie te voorkomen
export const PAGE_LABELS = {
  WIZARD: UI_LABELS[UX_TOKENS.WIZARD],
  LANDING: UI_LABELS[UX_TOKENS.LANDING],
  DASHBOARD: UI_LABELS[UX_TOKENS.DASHBOARD],
};
