/**
 * @file_intent Definieert de mapping van UX-tokens naar de daadwerkelijke, leesbare UI-labels (in het Nederlands).
 * @repo_architecture Domain Layer - Constants.
 * @term_definition UI Label = De concrete tekst die in de user interface wordt getoond (bijv. 'Huishouden Opzetten'). UX Token = Een abstracte, semantische sleutel die een UI-element identificeert (bijv. `UX_TOKENS.SCREENS.HOUSEHOLD_SETUP`).
 * @contract Dit bestand exporteert `UI_LABELS`, een object dat `UX_TOKENS` vertaalt naar Nederlandse strings. Het dient als de centrale "woordenboek" voor de UI. Het exporteert ook `SCREEN_LABELS` voor legacy-compatibiliteit.
 * @ai_instruction Om een nieuw label toe te voegen: 1. Definieer eerst een token in `uxTokens.ts`. 2. Voeg hier een entry toe in `UI_LABELS` met het token als sleutel en de Nederlandse tekst als waarde. Dit centraliseert alle UI-tekst en maakt vertaling in de toekomst eenvoudiger.
 */
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