// src/domain/registry/SectionRegistry.ts
/**
 * @file_intent Groepeert Entries in logische secties en definieert de layout (grid, list, etc).
 * @repo_architecture Mobile Industry (MI) - De 'Orchestration'-laag van de UI-configuratie.
 * @term_definition SectionDefinition = Groepering van entries. fieldIds = De keys die verwijzen naar de EntryRegistry.
 * @contract Een sectie bevat een lijst van 'fieldIds'. Deze IDs MOETEN bestaan in de EntryRegistry om gerenderd te kunnen worden.
 * @ai_instruction Gebruik 'fieldIds' hier als verwijzing naar de EntryRegistry. Wijzig de layout-types alleen als de UI-laag deze ondersteunt.
 *   APP_STATIC/SYSTEM secties zijn stubs (leeg fieldIds) tot hun UniversalScreen-migratie.
 */
import { IBaseRegistry } from './BaseRegistry';

export interface SectionDefinition {
  id: string;
  labelToken: string;
  fieldIds: string[];
  layout: 'list' | 'grid' | 'card' | 'stepper';
  uiModel?: 'numericWrapper' | 'collapsible' | 'swipeable' | 'readonly';
}

export const SECTION_REGISTRY: Record<string, SectionDefinition> = {
  // ══════════════════════════════════════════════════════════════
  // WIZARD SECTIONS (actief, alle fieldIds geresolveerd)
  // ══════════════════════════════════════════════════════════════
  householdSetup: {
    id: 'householdSetup',
    labelToken: 'SECTION_HOUSEHOLD_SETUP',
    layout: 'list',
    fieldIds: ['aantalMensen', 'aantalVolwassen', 'kinderenLabel', 'postcode', 'autoCount', 'heeftHuisdieren'],
  },
  householdDetails: {
    id: 'householdDetails',
    labelToken: 'SECTION_HOUSEHOLD_DETAILS',
    layout: 'grid',
    fieldIds: ['burgerlijkeStaat', 'woningType'],
  },
  incomeDetails: {
    id: 'incomeDetails',
    labelToken: 'SECTION_INCOME',
    layout: 'list',
    fieldIds: ['incomeCategory', 'nettoSalaris', 'frequentie', 'vakantiegeldPerJaar'],
  },
  workToeslagen: {
    id: 'workToeslagen',
    labelToken: 'LABEL_TOESLAGEN',
    layout: 'card',
    uiModel: 'numericWrapper',
    fieldIds: ['zorgtoeslag', 'reiskosten', 'overigeInkomsten'],
  },
  fixedExpenses: {
    id: 'fixedExpenses',
    labelToken: 'SECTION_FIXED_EXPENSES',
    layout: 'card',
    fieldIds: ['kaleHuur', 'hypotheekBruto', 'energieGas', 'water', 'telefoon'],
  },
  overigeVerzekeringen: {
    id: 'overigeVerzekeringen',
    labelToken: 'LABEL_OVERIGE_VERZEKERINGEN',
    layout: 'list',
    fieldIds: ['aansprakelijkheid', 'reis', 'opstal'],
  },
  abonnementen: {
    id: 'abonnementen',
    labelToken: 'LABEL_ABONNEMENTEN',
    layout: 'grid',
    fieldIds: ['internetTv', 'sport', 'lezen'],
  },
  memberDetails: {
    id: 'memberDetails',
    labelToken: 'SECTION_MEMBER_DETAILS',
    layout: 'card',
    uiModel: 'collapsible',
    fieldIds: ['naam', 'geboortedatum', 'gender'],
  },

  // ══════════════════════════════════════════════════════════════
  // APP_STATIC / SYSTEM SECTIONS (stubs)
  // fieldIds worden ingevuld bij UniversalScreen-migratie per scherm.
  // Tot die tijd renderen deze schermen via hun eigen hardcoded components.
  // ══════════════════════════════════════════════════════════════
  LANDING_ACTIONS_CARD: {
    id: 'LANDING_ACTIONS_CARD',
    labelToken: 'SECTION_LANDING',
    layout: 'card',
    // startWizard → EntryRegistry (ACTION, navigationTarget='WIZARD') → startWizard() → WIZARD_SETUP_HOUSEHOLD
    // goToDashboard → EntryRegistry (ACTION, navigationTarget='DASHBOARD') → goToDashboard()
    // Volgorde = visuele volgorde: primair (Aanmelden) vóór secundair (Inloggen).
    fieldIds: ['startWizard', 'goToDashboard'],
  },
  DASHBOARD_OVERVIEW_CARD: {
    id: 'DASHBOARD_OVERVIEW_CARD',
    labelToken: 'SECTION_DASHBOARD_OVERVIEW',
    layout: 'card',
    fieldIds: [], // stub: DashboardScreen is nog handmatig
  },
  QUICK_ACTIONS_SECTION: {
    id: 'QUICK_ACTIONS_SECTION',
    labelToken: 'SECTION_QUICK_ACTIONS',
    layout: 'grid',
    fieldIds: [], // stub
  },
  EXPENSE_INPUT_CARD: {
    id: 'EXPENSE_INPUT_CARD',
    labelToken: 'SECTION_EXPENSE_INPUT',
    layout: 'card',
    fieldIds: [
      'dailyTransactionDate',
      'dailyTransactionAmount',
      'dailyTransactionCategory',
      'dailyTransactionDescription',
      'dailyPaymentMethod',
    ],
  },
  GLOBAL_OPTIONS_LIST: {
    id: 'GLOBAL_OPTIONS_LIST',
    labelToken: 'SECTION_OPTIONS',
    layout: 'list',
    fieldIds: ['goToSettings', 'goToCsvUpload', 'goToReset'],
  },
  USER_PROFILE_CARD: {
    id: 'USER_PROFILE_CARD',
    labelToken: 'SECTION_PROFILE',
    layout: 'card',
    fieldIds: [], // stub
  },
  APP_PREFERENCES_SECTION: {
    id: 'APP_PREFERENCES_SECTION',
    labelToken: 'SECTION_PREFERENCES',
    layout: 'list',
    fieldIds: ['darkModeToggle'],
  },
  CSV_DROPZONE_CARD: {
    id: 'CSV_DROPZONE_CARD',
    labelToken: 'SECTION_CSV_UPLOAD',
    layout: 'card',
    fieldIds: [], // stub: CsvUploadScreen is nog handmatig
  },
  CSV_MAPPING_SECTION: {
    id: 'CSV_MAPPING_SECTION',
    labelToken: 'SECTION_CSV_MAPPING',
    layout: 'list',
    fieldIds: [], // stub
  },
  CSV_ANALYSIS_RESULT_CARD: {
    id: 'CSV_ANALYSIS_RESULT_CARD',
    labelToken: 'SECTION_CSV_ANALYSIS',
    layout: 'card',
    fieldIds: [], // stub: CsvAnalysisFeedback rendert via eigen container (geen EntryRegistry-velden)
  },
  RESET_CONFIRMATION_CARD: {
    id: 'RESET_CONFIRMATION_CARD',
    labelToken: 'SECTION_RESET',
    layout: 'card',
    fieldIds: [], // stub: ResetScreen is nog handmatig
  },
  ERROR_DIAGNOSTICS_CARD: {
    id: 'ERROR_DIAGNOSTICS_CARD',
    labelToken: 'SECTION_ERROR',
    layout: 'card',
    fieldIds: [], // stub
  },
  // ─── UNDO scherm [Fase 7] ───────────────────────────────────────────────────
  // TRANSACTION_HISTORY_LIST: geen fieldIds — rendert via TransactionHistoryContainer.
  // TRANSACTION_ACTIONS_CARD: 3 ACTION entries (commandTarget → reducer dispatch).
  TRANSACTION_HISTORY_LIST: {
    id: 'TRANSACTION_HISTORY_LIST',
    labelToken: 'SECTION_TRANSACTION_HISTORY',
    layout: 'list',
    fieldIds: [], // rendert via TransactionHistoryContainer (niet via EntryRegistry)
  },
  TRANSACTION_ACTIONS_CARD: {
    id: 'TRANSACTION_ACTIONS_CARD',
    labelToken: 'SECTION_TRANSACTION_ACTIONS',
    layout: 'list',
    fieldIds: ['undoAction', 'redoAction', 'clearAllAction'],
  },
};

export const SectionRegistry: IBaseRegistry<string, SectionDefinition> = {
  getDefinition: (key: string) => (key in SECTION_REGISTRY) ? SECTION_REGISTRY[key] : null,
  isValidKey: (key: string): key is string => (key in SECTION_REGISTRY) === true,
  getAllKeys: () => Object.keys(SECTION_REGISTRY),
};