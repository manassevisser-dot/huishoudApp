/**
 * @file_intent Definieert constante, unieke identifiers voor de belangrijkste secties of schermen in de UI.
 * @repo_architecture Domain Layer - Constants.
 * @term_definition UI Section = Een string-constante die een specifiek, logisch deel van de applicatie-interface identificeert (bijv. een scherm of een reeks gerelateerde schermen).
 * @contract Dit bestand exporteert `UI_SECTIONS` als een `as const` object en de bijbehorende `UISection` type. Deze constanten worden gebruikt voor state management, conditionele rendering en routing om te bepalen welk deel van de UI actief is.
 * @ai_instruction Bij het toevoegen van een nieuw hoofdscherm of een functionele sectie, voeg hier een nieuwe, beschrijvende sleutel toe. Houd de waarden in `snake_case`. Dit voorkomt het gebruik van "magic strings" in de codebase en maakt het systeem robuuster.
 */
//src/domain/constants/uiSections.ts
export const UI_SECTIONS = {
  HOUSEHOLD_SETUP: 'household_setup',
  HOUSEHOLD_DETAILS: 'household_details',
  INCOME_DETAILS: 'income_details',
  FIXED_EXPENSES: 'fixed_expenses',
  csv_UPLOAD: 'csv_upload',
  WIZARD: 'wizard', // ✅ ADD THIS
} as const;

  export type UISection = keyof typeof UI_SECTIONS;