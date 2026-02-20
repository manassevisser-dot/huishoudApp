/**
 * @file_intent Definieert een set van semantische tokens die UI-elementen representeren (schermen, velden, etc.).
 * @repo_architecture Domain Layer - Constants.
 * @term_definition UX Token = Een abstracte, semantische sleutel (bv. `SCREENS.HOUSEHOLD_SETUP`) die een specifiek UI-onderdeel identificeert. Het is een verwijzing naar een label, niet de tekst zelf.
 * @contract Dit bestand exporteert `UX_TOKENS`, een `as const` object. Deze tokens dienen als de stabiele sleutels die in `UI_LABELS.ts` worden gemapt naar de daadwerkelijke, voor de gebruiker zichtbare tekst. Dit ontkoppelt de applicatielogica van de content.
 * @ai_instruction Wanneer een nieuw gelabeld UI-element nodig is, voeg hier een nieuw, beschrijvend token toe binnen de juiste categorie (`SCREENS`, `FIELDS`, etc.). Gebruik dit token vervolgens in de component en voeg de corresponderende tekst toe in `labels.ts`.
 */
export const UX_TOKENS = {
  WIZARD: 'WIZARD',
  LANDING: 'LANDING',
  DASHBOARD: 'DASHBOARD',

  SCREENS: {
    HOUSEHOLD_SETUP:   'setup_screen_title',
    HOUSEHOLD_DETAILS: 'household_screen_title',
    INCOME_DETAILS:    'finance_screen_title',
    FIXED_EXPENSES:    'fixed_expenses_screen_title',
  },

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
    CAR_REPEATER:       'LABEL_AUTO_FORMS'
  }
} as const;