// src/domain/registry/ScreenRegistry.ts
/**
 * @file_intent Definieert de schermen, hun hiërarchie en de navigatie-flow (Wizard vs App).
 * @repo_architecture Mobile Industry (MI) - De 'Orchestration'-laag van de navigatie.
 * @term_definition ScreenDefinition = De configuratie van een volledig scherm. sectionIds = Koppeling naar SectionRegistry.
 * @contract Bepaalt de volgorde van de Wizard via nextScreenId/previousScreenId. Elke sectionId MOET bestaan in de SectionRegistry.
 * @ai_instruction Wijzig de flow (next/previous) alleen als de user-journey verandert. Dit bestand is de 'Map' van de app.
 */

import { IBaseRegistry } from './BaseRegistry';

export type ScreenType = 'AUTH' | 'WIZARD' | 'APP_STATIC' | 'SYSTEM';

export interface ScreenDefinition {
  id: string;
  type: ScreenType;
  titleToken: string;
  sectionIds: string[];
  nextScreenId?: string;
  previousScreenId?: string;
}

const SCREEN_REGISTRY: Record<string, ScreenDefinition> = {
  // ── AUTH & LANDING ──────────────────────────────────────────
  'SPLASH': {
    id: 'SPLASH',
    type: 'SYSTEM',
    titleToken: 'screens.splash.title',
    sectionIds: [],
  },
  'LANDING': {
    id: 'LANDING',
    type: 'AUTH',
    titleToken: 'screens.landing.title',
    sectionIds: ['LANDING_ACTIONS_CARD'],
    nextScreenId: 'WIZARD_SETUP_HOUSEHOLD',
  },

  // ── WIZARD FLOW (Mapping van oude /screens) ──────────────────
  'WIZARD_SETUP_HOUSEHOLD': {
    id: 'WIZARD_SETUP_HOUSEHOLD',
    type: 'WIZARD',
    titleToken: 'wizard.setup.title',
    sectionIds: ['householdSetup'], // Verwijst naar SectionRegistry.ts
    nextScreenId: 'WIZARD_DETAILS_HOUSEHOLD',
  },
  'WIZARD_DETAILS_HOUSEHOLD': {
    id: 'WIZARD_DETAILS_HOUSEHOLD',
    type: 'WIZARD',
    titleToken: 'wizard.details.title',
    sectionIds: ['householdDetails'],
    previousScreenId: 'WIZARD_SETUP_HOUSEHOLD',
    nextScreenId: 'WIZARD_INCOME_DETAILS',
  },
  'WIZARD_INCOME_DETAILS': {
    id: 'WIZARD_INCOME_DETAILS',
    type: 'WIZARD',
    titleToken: 'wizard.income.title',
    sectionIds: ['incomeDetails', 'workToeslagen'],
    previousScreenId: 'WIZARD_DETAILS_HOUSEHOLD',
    nextScreenId: 'WIZARD_FIXED_EXPENSES',
  },
  'WIZARD_FIXED_EXPENSES': {
    id: 'WIZARD_FIXED_EXPENSES',
    type: 'WIZARD',
    titleToken: 'wizard.expenses.title',
    sectionIds: ['fixedExpenses', 'overigeVerzekeringen', 'abonnementen'],
    previousScreenId: 'WIZARD_INCOME_DETAILS',
    nextScreenId: 'DASHBOARD',
  },

  // ── MAIN APP SCREENS ────────────────────────────────────────
  'DASHBOARD': {
    id: 'DASHBOARD',
    type: 'APP_STATIC',
    titleToken: 'screens.dashboard.title',
    sectionIds: ['DASHBOARD_OVERVIEW_CARD', 'QUICK_ACTIONS_SECTION'],
    // Dashboard heeft geen 'previous', dit is de root.
  },
  'DAILY_INPUT': {
    id: 'DAILY_INPUT',
    type: 'APP_STATIC',
    titleToken: 'screens.daily_input.title',
    sectionIds: ['EXPENSE_INPUT_CARD'],
    previousScreenId: 'DASHBOARD', // Terug naar de basis
  },
  'OPTIONS': {
    id: 'OPTIONS',
    type: 'APP_STATIC',
    titleToken: 'screens.options.title',
    sectionIds: ['GLOBAL_OPTIONS_LIST'],
    previousScreenId: 'DASHBOARD',
  },
  'SETTINGS': {
    id: 'SETTINGS',
    type: 'APP_STATIC',
    titleToken: 'screens.settings.title',
    sectionIds: ['USER_PROFILE_CARD', 'APP_PREFERENCES_SECTION'],
    previousScreenId: 'OPTIONS', // Volgens jouw huidige backMap
  },
  'csv_UPLOAD': {
    id: 'csv_UPLOAD',
    type: 'APP_STATIC',
    titleToken: 'screens.csv.title',
    sectionIds: ['csv_DROPZONE_CARD', 'csv_MAPPING_SECTION'],
    previousScreenId: 'OPTIONS',
  },
  'RESET': {
    id: 'RESET',
    type: 'SYSTEM',
    titleToken: 'screens.reset.title',
    sectionIds: ['RESET_CONFIRMATION_CARD'],
    previousScreenId: 'OPTIONS',
  },
  'CRITICAL_ERROR': {
    id: 'CRITICAL_ERROR',
    type: 'SYSTEM',
    titleToken: 'screens.error.title',
    sectionIds: ['ERROR_DIAGNOSTICS_CARD'],
  },
};

export const ScreenRegistry: IBaseRegistry<string, ScreenDefinition> = {
  getDefinition: (key: string): ScreenDefinition | null =>
    (key in SCREEN_REGISTRY ? SCREEN_REGISTRY[key] : null),

  isValidKey: (key: string): key is string =>
    (key in SCREEN_REGISTRY) === true,

  getAllKeys: () => Object.keys(SCREEN_REGISTRY),
};