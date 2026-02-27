// src/app/config/WizStrings.ts
/**
 * @file_intent Beheert de statische tekstuele content en lokalisatie-tokens voor de wizard en het dashboard.
 * @repo_architecture Mobile Industry (MI) - Presentation Assets Layer.
 * @term_definition WizStrings = De centrale dictionary voor UI-teksten.
 * @contract Dient als de Single Source of Truth voor gebruikersgerichte communicatie.
 * @ai_instruction Gebruik deze tokens in de ViewModels en React componenten in plaats van hardcoded strings.
 */
export const WizStrings = {

  wizard: {
    back: 'Vorige',
    next: 'Volgende',
    finish: 'Afronden',
  },

  dashboard: {
    title: 'Dashboard',
    welcome: 'Welkom bij uw overzicht',
  },

  common: {
    loading: 'Laden...',
    error: 'Er is een fout opgetreden',
  },

  /** Teksten voor het LANDING scherm (welkom + twee keuze-knoppen) */
  landing: {
    screenTitle:   'Welkom',
    screenSubtitle: 'Start met het instellen van uw huishouding of ga direct naar het dashboard.',
    startWizard:   'Aanmelden',
    goToDashboard: 'Inloggen',
  },

  /** Navigatieknoppen voor het OPTIONS scherm */
  options: {
    goToSettings: 'Instellingen',
    goToCsvUpload: 'CSV uploaden',
    goToReset: 'Reset',
  },

  /** Teksten voor het UNDO scherm (transactiegeschiedenis) */
  undo: {
    screenTitle: 'Transactiegeschiedenis',
    listTitle: 'Recente transacties',
    emptyTitle: 'Geen transacties',
    emptyMessage: 'Sla een dagelijkse transactie op om de geschiedenis te zien.',
    undoAction: 'Ongedaan maken',
    redoAction: 'Opnieuw uitvoeren',
    clearAllAction: 'Alles wissen',
  },

  /** Teksten voor het SETTINGS scherm */
  settings: {
    darkModeLabel: 'Donker thema',
  },

  /** Teksten voor CsvAnalysisFeedback — SSOT, geen hardcoded strings in UI */
  csvAnalysis: {
    title: 'CSV Analyse Resultaat',
    emptyTitle: 'CSV Analyse',
    emptyMessage: 'Importeer een CSV-bestand om het analyse-resultaat te zien.',
    warningDiscrepancy: '⚠ Inkomen in CSV wijkt af van wizard-opgave',
    warningMissingCosts: '⚠ Woonlasten gevonden die niet verwacht werden',
    periodTitle: 'Periode-overzicht',
    labelTotalIncome: 'Totaal inkomsten:',
    labelTotalExpenses: 'Totaal uitgaven:',
    labelBalance: 'Saldo:',
    labelTransactionCount: 'Aantal transacties:',
    comparisonTitle: 'Vergelijking met wizard',
    labelCsvIncome: 'Inkomen in CSV:',
    labelSetupIncome: 'Inkomen in wizard:',
    labelDifference: 'Verschil:',
  },
};

export default WizStrings;
