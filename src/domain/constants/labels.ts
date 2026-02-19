// src/domain/constants/labels.ts
import { UX_TOKENS } from './uxTokens';

// Mapping van Token ID -> Leesbare Tekst (NL)
export const UI_LABELS = {
  // Top Level Navigation
  [UX_TOKENS.WIZARD]: 'Wizard',
  [UX_TOKENS.LANDING]: 'Welkom',
  [UX_TOKENS.DASHBOARD]: 'Dashboard',

  // Screen Titles (modern: via de nieuwe keys in uxTokens)
  [UX_TOKENS.SCREENS.HOUSEHOLD_SETUP]: 'Huishouden Opzetten',
  [UX_TOKENS.SCREENS.HOUSEHOLD_DETAILS]: 'Samenstelling',
  [UX_TOKENS.SCREENS.INCOME_DETAILS]: 'Inkomsten & Lasten',
  [UX_TOKENS.SCREENS.FIXED_EXPENSES]: 'Vaste lasten',

  // Field Labels (ongewijzigd)
  [UX_TOKENS.FIELDS.CAR_COUNT]: "Aantal Auto's",
  [UX_TOKENS.FIELDS.NAME]: 'Naam',
};

// Legacy support weghalen of behouden?
// - Als SCREEN_LABELS enkel voor macro-navigatie wordt gebruikt, kun je deze laten staan.
// - Ze refereren NIET meer aan legacy nested keys, dus dit is veilig.
export const SCREEN_LABELS = {
  WIZARD: UI_LABELS[UX_TOKENS.WIZARD],
  LANDING: UI_LABELS[UX_TOKENS.LANDING],
  DASHBOARD: UI_LABELS[UX_TOKENS.DASHBOARD],
};