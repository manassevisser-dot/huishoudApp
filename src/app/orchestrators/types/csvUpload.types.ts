// src/app/orchestrators/types/csvUpload.types.ts
/**
 * @file_intent Definieert de volledige type-keten voor de CSV-upload ACL, van ruw bankbestand tot analyse-resultaat.
 * @repo_architecture Mobile Industry (MI) - Type Definition Layer (CSV Domain).
 * @term_definition
 *   ACL (Anti-Corruption Layer) = De gecontroleerde grens tussen ruwe bankdata en het domeinmodel.
 *   De keten loopt in vijf lagen: RawCsvRow → AdapterCsvItem → ParsedCsvTransaction → CsvImportStateSlice → CsvAnalysisResult
 * @contract
 *   - Laag 1 (RawCsvRow/RawCsvItem): vóór de adapter, puur string, bank-afhankelijk
 *   - Laag 2 (AdapterCsvItem): ná csvAdapter.mapToInternalModel(), genormaliseerd, PII nog aanwezig
 *   - Laag 3 (ParsedCsvTransaction): ná ImportOrchestrator, PII gestript, ACL voltooid
 *   - Laag 4 (CsvImportStateSlice): wat in FormState.data.csvImport wordt opgeslagen
 *   - Laag 5 (CsvAnalysisResult): berekend resultaat in viewModels.csvAnalysis (nooit in data)
 * @acl_boundary
 *   ParsedCsvTransaction is de STRIKTE vervanging van research.CsvItem.
 *   Geen 'extends Record<string, unknown>' — alle velden zijn bekend en getypt.
 * @removed
 *   - BaseTransaction, IncomeItem, ExpenseItem, Transaction → conflict met core/types/core.ts
 *   - FinanceData, FinancePeriodOverview → horen niet in csv-grenslaag
 *   - ResearchResult, ResearchStatus, ResearchFinanceResult, ResearchFinanceSummary, ResearchWarning
 *     → duplicaten van MasterProcessResult uit ResearchOrchestrator
 *   - csvMember, csvSetupData → onnodige duplicaten van Member en SetupData uit core/types/core.ts
 *   - ImportStatus → bevatte Date-object (niet JSON-serialiseerbaar), vervangen door CsvImportStateSlice
 *   - isResearchCompleted → ResearchResult verwijderd
 * @added
 *   - DutchBank — alle Nederlandse consumentenbanken als union type
 *   - RawCsvRow — de flexibele Record<string,string> die parseRawCsv retourneert
 *   - AdapterCsvItem — expliciete alias voor de output van csvAdapter (was impliciet)
 *   - CsvOriginalMetadata — concreet type voor het 'original'-veld (was Record<string,unknown>)
 *   - ParsedCsvTransaction — strikte ACL-output, vervangt research.CsvItem
 *   - CsvImportStateSlice — state-shape voor FormState.data.csvImport
 *   - CsvAnalysisResult — resultaat van de vergelijkingsstap (viewModels, niet data)
 *   - CsvImportPeriod — gedetecteerde periode van de geüploade transacties
 *   - CsvImportWarning — hernoemd van ResearchWarning om domein-clash te vermijden
 *   - isAdapterCsvItem — type guard voor laag 2
 *   - isParsedCsvTransaction — type guard voor laag 3
 */

// ============================================================================
// BANK TYPE
// ============================================================================

/**
 * Nederlandse consumentenbanken waarvan CSV-exports worden ondersteund.
 * undefined = bank niet gedetecteerd of niet opgegeven.
 *
 * @note Elk bankformaat heeft eigen kolomnamen en separatoren.
 *   CsvParseOptions.bank kan als hint worden meegegeven voor betere kolomdetectie.
 */
export type DutchBank =
  | 'ING'
  | 'ABN AMRO'
  | 'Rabobank'
  | 'SNS Bank'
  | 'ASN Bank'
  | 'RegioBank'
  | 'de Volksbank'
  | 'Triodos Bank'
  | 'Knab'
  | 'Bunq'
  | 'Revolut'
  | 'N26'
  | 'Nationale-Nederlanden Bank'
  | 'NIBC Direct'
  | 'Lloyds Bank'
  | undefined;

// ============================================================================
// LAAG 1 — RAW CSV (vóór adapter)
// ============================================================================

/**
 * De meest ruwe laag: wat parseRawCsv() retourneert.
 * Alle waarden zijn strings, kolomnamen zijn bank-afhankelijk.
 * Dit is het type dat csvAdapter als input ontvangt.
 */
export type RawCsvRow = Record<string, string>;

/**
 * Een typische Nederlandse bankexport-rij met bekende veldnamen.
 * Niet alle banken gebruiken deze exacte namen — vandaar de index signature.
 *
 * @note Controleer veldnamen met isRawCsvItem() alleen voor ING/Rabobank-formaat.
 *   Voor andere banken geldt RawCsvRow.
 */
export interface RawCsvItem {
  /** Datum in formaat DD-MM-YYYY of YYYY-MM-DD (bank-afhankelijk) */
  datum: string;

  /** Bedrag als string (kan komma's, punten of min-tekens bevatten) */
  bedrag: string;

  /** Omschrijving van de transactie (PII mogelijk aanwezig) */
  omschrijving: string;

  /** Categorie (bank-afhankelijk, vaak leeg) */
  categorie?: string;

  /** Betaalmethode (bank-afhankelijk) */
  betaalmethode?: string;

  /** Af/Bij mutatie-richting (ING: 'Af' | 'Bij') */
  afbij?: string;

  /** Extra velden — afhankelijk van de bank */
  [key: string]: string | undefined;
}

// ============================================================================
// LAAG 2 — ADAPTER OUTPUT (ná csvAdapter.mapToInternalModel())
// ============================================================================

/**
 * De output van csvAdapter.mapToInternalModel().
 * Kolomnamen zijn genormaliseerd naar Engels, bedrag is al een number.
 * PII is nog NIET gestript — dat gebeurt in ImportOrchestrator.
 *
 * @acl_note Dit type spiegelt exact de CsvItem uit csvAdapter.ts.
 *   Hier als expliciete alias zodat de ACL-keten volledig getypt is.
 */
export interface AdapterCsvItem {
  /** Bedrag in euro's (negatief = uitgave, positief = inkomst) */
  amount: number;

  /** Ruwe omschrijving — PII nog aanwezig */
  description: string;

  /** Datum in YYYY-MM-DD formaat */
  date: string;

  /** De originele CSV-rij (alle kolommen als strings) */
  original: RawCsvRow;
}

// ============================================================================
// LAAG 3 — PARSED TRANSACTION (ná ImportOrchestrator — ACL voltooid)
// ============================================================================

/**
 * Audit-metadata die ImportOrchestrator toevoegt aan elke transactie.
 * Vervangt het open Record<string, unknown> uit research.CsvItem.
 */
export interface CsvOriginalMetadata {
  /** Hash van datum|bedrag|omschrijving (deduplicatie-sleutel) */
  rawDigest: string;

  /** Versie van het import-schema (voor toekomstige migraties) */
  schemaVersion: string;

  /** ISO-timestamp van het moment van import */
  importedAt: string;

  /** Versie van de kolomdetectie-logica */
  columnMapVersion: string;

  /** Kwaliteitsvlaggen gezet tijdens de parse */
  flags: ReadonlyArray<'missing_date' | 'missing_description' | 'fallback_category'>;
}

/**
 * Een volledig verwerkte, ACL-cleaned transactie.
 *
 * Dit is de STRIKTE vervanging van research.CsvItem.
 * Geen 'extends Record<string, unknown>' — alle velden zijn bekend en getypt.
 * PII is gestript, datum is genormaliseerd, categorie is toegewezen.
 */
export interface ParsedCsvTransaction {
  /** Uniek ID: 'csv_' + rawDigest-prefix */
  id: string;

  /** Veld-ID voor FSO-koppeling: 'csv_tx_' + digest-prefix + '_' + index */
  fieldId: string;

  /** Bedrag in euro's (negatief = uitgave, positief = inkomst) */
  amount: number;

  /** Bedrag in centen (integer, geen floating-point fouten) */
  amountCents: number;

  /** Datum in YYYY-MM-DD formaat (genormaliseerd) */
  date: string;

  /** Omschrijving met PII gestript */
  description: string;

  /** Toegewezen categorie (fallback: 'Overig') */
  category: string;

  /** Of de transactie genegeerd moet worden bij berekeningen */
  isIgnored: boolean;

  /** Audit-metadata — gestructureerd, niet open */
  original: CsvOriginalMetadata;
}

// ============================================================================
// LAAG 4 — STATE SLICE (wat in FormState.data.csvImport staat)
// ============================================================================

/**
 * De gedetecteerde periode van de geüploade transacties.
 * Beide datums in YYYY-MM-DD formaat (ISO string, JSON-serialiseerbaar).
 */
export interface CsvImportPeriod {
  /** Vroegste transactiedatum */
  from: string;

  /** Laatste transactiedatum */
  to: string;
}

/**
 * De state-shape voor FormState.data.csvImport.
 *
 * @important Alle datums zijn ISO strings — geen Date-objecten.
 *   Date is niet JSON-serialiseerbaar en crasht state-persistence.
 * @important Deze slice heeft zijn eigen sectie in FormState.data,
 *   gescheiden van finance.income/expenses (wizard-data).
 */
export interface CsvImportStateSlice {
  /** Geparste en ACL-cleaned transacties */
  transactions: ParsedCsvTransaction[];

  /** ISO-timestamp van het moment van import */
  importedAt: string;

  /** Gedetecteerde periode op basis van transactiedatums (null als geen transacties) */
  period: CsvImportPeriod | null;

  /** Status van de import-flow */
  status: 'idle' | 'parsed' | 'analyzed';

  /** Gedetecteerde of opgegeven bank */
  sourceBank: DutchBank;

  /** Originele bestandsnaam */
  fileName: string;

  /** Totaal aantal transacties (redundant maar handig voor UI zonder array-lengte) */
  transactionCount: number;
}

// ============================================================================
// LAAG 5 — ANALYSE RESULTAAT (viewModels.csvAnalysis — berekend, nooit in data)
// ============================================================================

/**
 * Het resultaat van de vergelijkingsstap (reconcile csv vs. wizard-setup).
 *
 * @important Dit type hoort in viewModels, NIET in data.
 *   Het is een berekend resultaat, net als financialSummary.
 *   Bij een RESET_APP wordt dit gewist samen met viewModels.
 */
export interface CsvAnalysisResult {
  /** Of er een significante afwijking is tussen csv-inkomen en wizard-inkomen */
  isDiscrepancy: boolean;

  /** Of er woonlasten-transacties zijn die niet verwacht werden */
  hasMissingCosts: boolean;

  /** Toelichting bij discrepantie (indien van toepassing) */
  discrepancyDetails?: string;

  /** Financiële samenvatting over de geïmporteerde periode */
  periodSummary: {
    totalIncomeCents: number;
    totalExpensesCents: number;
    balanceCents: number;
    transactionCount: number;
  };

  /**
   * Vergelijking tussen csv-inkomen en wizard-inkomen.
   * null als er geen inkomens-transacties zijn gevonden in de csv.
   */
  setupComparison: {
    /** Inkomen gevonden in csv (in centen) */
    csvIncomeCents: number;
    /** Inkomen opgegeven in wizard (in centen) */
    setupIncomeCents: number;
    /** Verschil: csv - setup (negatief = csv lager dan verwacht) */
    diffCents: number;
  } | null;
}

// ============================================================================
// METADATA
// ============================================================================

/**
 * Technische metadata over het geüploade CSV-bestand.
 */
export interface CsvSourceMetadata {
  /** Originele bestandsnaam */
  fileName: string;

  /** Aantal rijen exclusief header */
  rowCount: number;

  /** Gedetecteerde kolomseparator */
  separator: string;

  /** Of het bestand een headerregel had */
  hasHeader: boolean;

  /** Bestand-Encoding */
  encoding: string;

  /** Gedetecteerde bank op basis van kolomnamen en structuur */
  detectedBank?: DutchBank;
}

// ============================================================================
// PARSE RESULTAAT (output van de ACL-stap)
// ============================================================================

/**
 * Discriminated union van alle mogelijke parse-uitkomsten.
 */
export type CsvParseResult = CsvParseSuccess | CsvParseError | CsvParseEmpty;

/**
 * Succesvolle parse — transacties zijn ACL-cleaned en klaar voor state.
 */
export interface CsvParseSuccess {
  status: 'success';

  /** Volledig verwerkte transacties (ParsedCsvTransaction, niet Transaction uit core) */
  transactions: ParsedCsvTransaction[];

  /** Statistieken over de parse-run */
  metadata: {
    parsedCount: number;
    skippedCount: number;
    skippedRows?: Array<{
      rowIndex: number;
      reason: string;
      rawData: string;
    }>;
  };
}

/**
 * Onherstelbare parse-fout.
 */
export interface CsvParseError {
  status: 'error';
  errorMessage: string;
  technicalDetails?: {
    errorCode: string;
    rowIndex?: number;
    originalError: unknown;
  };
  suggestion?: string;
}

/**
 * Leeg bestand of geen parseerbare rijen.
 */
export interface CsvParseEmpty {
  status: 'empty';
  message: string;
}

// ============================================================================
// WORKFLOW TYPES
// ============================================================================

/**
 * Fases van de import-workflow (voor voortgangsindicatie en logging).
 */
export type ImportPhase =
  | 'idle'          // Nog niet gestart
  | 'parsing'       // ACL: csv → ParsedCsvTransaction[]
  | 'researching'   // Privacy-airlock via ResearchOrchestrator
  | 'updating'      // State-dispatch
  | 'completed'     // Klaar
  | 'failed';       // Mislukt met fout

/**
 * Eindresultaat van een import-run.
 */
export type ImportResult = ImportSuccess | ImportPartial | ImportFailure;

export interface ImportSuccess {
  outcome: 'success';
  processedCount: number;
  /** Verwijst naar CsvAnalysisResult — niet naar de verwijderde ResearchFinanceSummary */
  summary: CsvAnalysisResult;
}

export interface ImportPartial {
  outcome: 'partial';
  processedCount: number;
  skippedCount: number;
  warnings: CsvImportWarning[];
  summary: CsvAnalysisResult;
}

export interface ImportFailure {
  outcome: 'failure';
  errorMessage: string;
  technicalDetails?: Record<string, unknown>;
}

/**
 * Waarschuwing tijdens de import-flow.
 * Hernoemd van 'ResearchWarning' om clash met ResearchOrchestrator te vermijden.
 */
export interface CsvImportWarning {
  type: 'unmatched' | 'ambiguous' | 'invalid';
  transactionId?: string;
  message: string;
  suggestion?: string;
}

/**
 * Gestructureerde import-fout met fase-informatie.
 */
export interface ImportError {
  code: ImportErrorCode;
  message: string;
  phase: ImportPhase;
  originalError?: unknown;
}

export type ImportErrorCode =
  | 'FILE_READ_ERROR'
  | 'PARSING_ERROR'
  | 'VALIDATION_ERROR'
  | 'RESEARCH_ERROR'
  | 'STATE_UPDATE_ERROR'
  | 'UNKNOWN_ERROR';

// ============================================================================
// CONFIGURATIE
// ============================================================================

/**
 * Opties voor de CSV-parseerstap.
 */
export interface CsvParseOptions {
  separator?: string;
  hasHeader?: boolean;
  encoding?: string;
  dateFormat?: 'DD-MM-YYYY' | 'YYYY-MM-DD' | 'auto';
  decimalSeparator?: ',' | '.';
  maxRows?: number;
  /** Hint voor kolomdetectie — elk bank heeft eigen kolomnamen */
  bank?: DutchBank;
}

/**
 * Opties voor de volledige import-workflow.
 */
export interface ImportWorkflowOptions {
  autoRecompute?: boolean;
  enableLogging?: boolean;
  onProgress?: (phase: ImportPhase, progress: number) => void;
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Check of obj een RawCsvItem is (typisch ING/Rabobank Dutch-header formaat).
 *
 * @note Checkt Nederlandse kolomnamen — dit is correct voor laag 1 (vóór adapter).
 *   De adapter zet deze namen om naar Engels (amount, description, date).
 *   Gebruik isAdapterCsvItem() voor de adapter-output (laag 2).
 */
export function isRawCsvItem(obj: unknown): obj is RawCsvItem {
  if (typeof obj !== 'object' || obj === null) return false;
  const item = obj as Record<string, unknown>;
  return (
    typeof item['datum'] === 'string' &&
    typeof item['bedrag'] === 'string' &&
    typeof item['omschrijving'] === 'string'
  );
}

/**
 * Check of obj een AdapterCsvItem is (laag 2 — output van csvAdapter).
 * Velden zijn Engelstalig en genormaliseerd.
 */
export function isAdapterCsvItem(obj: unknown): obj is AdapterCsvItem {
  if (typeof obj !== 'object' || obj === null) return false;
  const item = obj as Record<string, unknown>;
  return (
    typeof item['amount'] === 'number' &&
    typeof item['description'] === 'string' &&
    typeof item['date'] === 'string'
  );
}

/**
 * Check of obj een ParsedCsvTransaction is (laag 3 — ACL-output).
 * Alle domeinvelden aanwezig, geen open index signature nodig.
 */
export function isParsedCsvTransaction(obj: unknown): obj is ParsedCsvTransaction {
  if (typeof obj !== 'object' || obj === null) return false;
  const item = obj as Record<string, unknown>;
  return (
    typeof item['id'] === 'string' &&
    typeof item['fieldId'] === 'string' &&
    typeof item['amount'] === 'number' &&
    typeof item['amountCents'] === 'number' &&
    typeof item['date'] === 'string' &&
    typeof item['description'] === 'string' &&
    typeof item['category'] === 'string'
  );
}

/**
 * Check of het parse-resultaat succesvol is.
 */
export function isCsvParseSuccess(result: CsvParseResult): result is CsvParseSuccess {
  return result.status === 'success';
}

/**
 * Check of het parse-resultaat een fout bevat.
 */
export function isCsvParseError(result: CsvParseResult): result is CsvParseError {
  return result.status === 'error';
}

/**
 * Check of het parse-resultaat leeg is.
 */
export function isCsvParseEmpty(result: CsvParseResult): result is CsvParseEmpty {
  return result.status === 'empty';
}
