// src/app/config/WizStrings.ts
/**
 * @file_intent Beheert de statische tekstuele content en lokalisatie-tokens.
 * @repo_architecture Mobile Industry (MI) - Presentation Assets Layer.
 * @term_definition WizStrings = De centrale dictionary voor UI-teksten.
 * @contract [nog in te vullen]
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
    undoSuccess: 'Undo geslaagd',
    redoAction: 'Opnieuw uitvoeren',
    clearAllAction: 'Alles wissen',
    noDescription: 'Geen omschrijving',
    deleteTransaction: 'Verwijder transactie',
  },

  /** Teksten voor het SETTINGS scherm */
  settings: {
    darkModeLabel: 'Donker thema',
  },

  /** Financieel overzicht — SSOT voor FinancialSummary component */
  financialSummary: {
    title: 'Financieel Overzicht',
    totalIncome: 'Totaal Inkomsten:',
    totalExpenses: 'Totaal Uitgaven:',
    netResult: 'Netto resultaat:',
  },

  /** Bestandskiezer & bestandsfouten */
  filePicker: {
    chooseCsv: 'Kies csv-bestand',
    cancelled: 'Bestand selecteren geannuleerd',
    noneSelected: 'Geen bestand geselecteerd',
    dataCorrupt: 'Bestandsdata is corrupt of ontbreekt',
    unknownReadError: 'Onbekende fout bij lezen',
  },

  /** Import fouten & status */
  import: {
    csvProcessError: 'Fout bij verwerken van CSV',
    noTransactionsProcessed: 'Geen verwerkte transacties gevonden in het CSV-bestand.',
    noTransactionsFound: 'Geen transacties gevonden in het bestand',
    unexpectedError: 'Onverwachte fout tijdens import',
    unknownError: 'Onbekende fout bij importeren',
    incomeDiscrepancy: 'Inkomensverschil gedetecteerd',
    unexpectedHousingCosts: 'Woonlasten gevonden die niet verwacht werden',
  },

  /** Feedback & notificaties */
  feedback: {
    restoreApp: 'App herstellen',
    restoreSettings: 'Instellingen herstellen',
    dismiss: 'Sluiten',
    closeNotification: 'Close notification',
    close: 'Close',
    criticalError: 'Kritieke fout',
    somethingWentWrong: 'Something went wrong',
    resetApplication: 'Reset Applicatie',
  },

  /** Afbeeldingen / toegankelijkheid */
  images: {
    phoenixLogo: 'Phoenix logo',
  },

  /** Registry fouten */
  registry: {
    notFound: 'niet gevonden',
    chipGroupRequiresOptions: 'chip-group vereist opties',
  },

  /** Audit / systeem alerts (zichtbaar in feedback UI) */
  audit: {
    listenerFailed: 'Audit listener failed',
    ticketingAlert: '!!! TICKETING/MAIL ALERT !!!',
    emergencyReset: 'EMERGENCY - Initiële volledige reset',
    alertRecovery: 'ALERT - Initiële recovery procedure',
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
  critical: {
    screenMessage: 'Er is een kritieke fout opgetreden in de data-integriteit. De app kan niet verder zonder een volledige reset.',
    alert: {
      title: 'Kritieke fout — volledige reset vereist',
      message: 'De applicatiedata is beschadigd. Een volledige reset wist alle gegevens en brengt de app terug naar de beginstand. Dit kan niet ongedaan worden gemaakt.',
      confirm: 'Ja, reset de app',
      cancel: 'Annuleer',
    },
  },

  // 🔄 RESET TEKSTEN (voorheen in validationMessages.reset)
  reset: {
    wipe: {
      title: 'Alles wissen',
      message: 'Weet je zeker dat je alle gegevens wilt verwijderen? Dit omvat setup, transacties en instellingen. Deze actie kan niet ongedaan worden gemaakt.',
      confirm: 'Ja, wis alles',
      cancel: 'Annuleer',
      hint: 'Na het wissen start de app opnieuw met een lege omgeving.',
    },
    wizardOnly: {
      title: 'Setup opnieuw starten',
      message: 'De setup‑wizard wordt teruggezet naar lege velden. Je transacties en overige instellingen blijven behouden.',
      confirm: 'Setup opnieuw starten',
      cancel: 'Annuleer',
      hint: 'Je kunt later altijd nog gegevens aanpassen in het dashboard.',
    },
  },

  // 📋 CSV AUDIT TOKENS (voorheen in validationMessages als platte strings)
  csv: {
    importSuccess: 'csv-bestand succesvol verwerkt',
    importEmpty: 'Geen transacties gevonden in het geüploade csv-bestand',
    importFailed: 'Er is een fout opgetreden tijdens het verwerken van het csv-bestand',
    discrepancyFound: 'Er zijn afwijkingen gevonden in de geïmporteerde financiële data',
  },

  // ⚠️ WAARSCHUWINGEN (voorheen hardcoded in fieldConstraints.ts)
  warnings: {
    postcode: {
      invalid: 'Voer een geldige postcode in (bijv. 1234AB)',
    },
    nettoSalaris: {
      yearlyAmount: 'Dit lijkt een jaarbedrag - vul het maandbedrag in',
    },
    vermogenWaarde: {
      wealthTax: 'Let op: vermogen boven €1M kan invloed hebben op toeslagen',
    },
    generic: {
    highValue: 'Waarde is ongewoon hoog (>%s)',  // Met placeholder voor threshold
    },
  }
};
export default WizStrings;
