// src/core/types/research.ts

/**
 * Data-contracten voor onderzoek, privacy-filtering en database-synchronisatie.
 *
 * @module core/types
 * @see {@link ./README.md | Core Types — Details}
 * @see {@link ../../domain/research/PrivacyAirlock.ts | PrivacyAirlock — transformatie naar AnonymizedResearchPayload}
 * @see {@link ../../adapters/validation/ResearchContractAdapter.ts | ResearchContractAdapter — runtime-validatie}
 *
 * @remarks
 * Twee gescheiden data-stromen:
 * - **Lokaal** (`ResearchMember`, `CsvItem`): bevat PII, blijft op het apparaat.
 * - **Research** (`AnonymizedResearchPayload`, `ResearchContract`): anoniem, veilig voor externe opslag.
 *
 * `PrivacyAirlock.collectAndDistributeData()` is het enige toegangspunt dat
 * de twee stromen tegelijk produceert en de scheiding afdwingt.
 */

// ─── Financiën (lokaal) ───────────────────────────────────────────────────────

/**
 * Eén inkomsten- of uitgavenregel, opgeslagen in centen (ADR-12).
 *
 * @remarks
 * `fieldId` koppelt terug naar de `EntryRegistry` voor label-resolutie in de UI.
 */
export interface FinanceItem {
  id:           string;
  amountCents:  number;
  description?: string;
  /** Optionele koppeling naar een veld-definitie in de EntryRegistry. */
  fieldId?:     string;
}

/** Gegroepeerde collectie van `FinanceItem`-regels met een optioneel gecalculeerd totaal. */
export interface FinanceBucket {
  items:             FinanceItem[];
  totalAmountCents?: number;
}

/** Gecombineerde inkomsten- en uitgaven-buckets voor één huishouden. */
export interface FinanceState {
  income:   FinanceBucket;
  expenses: FinanceBucket;
}

/**
 * Resultaat van `dataProcessor.reconcileWithSetup()`: vergelijkt CSV-inkomen
 * met de wizard-invoer en geeft de definitieve waarde terug.
 */
export interface FinancialIncomeSummary {
  /** Herkomst van het inkomen: `'csv'` of `'setup'`. */
  source:        string;
  /** Definitief inkomen in centen na reconciliatie. */
  finalIncome:   number;
  /** `true` als het CSV-inkomen significant afwijkt van de wizard-waarde. */
  isDiscrepancy: boolean;
}

// ─── Geld & audit ─────────────────────────────────────────────────────────────

/**
 * ISO-compliant geldbedrag. Altijd EUR; altijd in centen via `amountCents`
 * in de rest van het domein — dit type gebruikt `amount` als interop-waarde
 * voor de `ResearchValidator`.
 */
export interface Money {
  amount:   number;
  currency: 'EUR';
}

/**
 * Auditrecord van een ongedane actie (undo).
 * Bewaard voor herleidbaarheid; verlaat het apparaat niet.
 */
export interface UndoResult {
  id:            string;
  /** Bedrag als getal (niet centen) — uitsluitend voor audit-logging. */
  amount:        number;
  currency:      'EUR';
  description?:  string;
  /** Mensleesbare reden voor de undo. */
  reason:        string;
  /** ISO 8601 tijdstempel. */
  timestamp:     string;
  schemaVersion: string;
}

// ─── Huishoudleden ────────────────────────────────────────────────────────────

/**
 * Leeftijdscategorie van een huishoudlid.
 * Gebruikt door `PrivacyAirlock.toMemberType()` om vrije-tekst-input te normaliseren.
 */
export type MemberType = 'adult' | 'child' | 'teenager' | 'senior' | 'puber';

/**
 * Een huishoudlid met volledige persoonsdata, uitsluitend voor lokale opslag.
 *
 * @remarks
 * Dit object bevat PII (`firstName`, `lastName`) en mag het apparaat **nooit** verlaten.
 * Gebruik `AnonymizedResearchPayload` voor externe data-stromen.
 *
 * De index-signatuur `[key: string]: unknown` is een tijdelijke escape-hatch
 * voor legacy-velden uit de wizard; zie TODO in `research.ts`.
 */
export interface ResearchMember {
  /** Lokale UUID van het lid. */
  entityId:      string;
  /** Koppeling naar de EntryRegistry. */
  fieldId:       string;
  memberType:    MemberType;
  firstName:     string;
  lastName:      string;
  dateOfBirth?:  string;
  gender?:       string;
  age?:          number;
  [key: string]: unknown;
}

// ─── CSV-import ───────────────────────────────────────────────────────────────

/**
 * Eén geparsde CSV-transactie, verrijkt met metadata voor audit-doeleinden.
 *
 * @remarks
 * **TODO — Architecturele schuld**: de `extends Record<string, unknown>` is een
 * tijdelijke linter-fix voor onbekende CSV-velden. Verwijder deze zodra er een
 * strikte mapping op de grens van `MasterOrchestrator` is geïmplementeerd.
 *
 * `amountCents` is de canonieke waarde (ADR-12); `amount` is aanwezig als
 * interop-veld voor de `ResearchValidator`.
 */
export interface CsvItem extends Record<string, unknown> {
  id:           string;
  /** ISO 8601 datum. */
  date:         string;
  description:  string;
  /** Canoniek bedrag in eurocenten (ADR-12). */
  amountCents:  number;
  category?:    string;
  /** `true` als de gebruiker dit item heeft genegeerd tijdens analyse. */
  isIgnored?:   boolean;
  /** Interop-bedrag in euro's voor de ResearchValidator. */
  amount:       number;
  /** Originele CSV-kolommen als ruwe map — voor audit en herleidbaarheid. */
  original:     Record<string, unknown>;
}

// ─── Ongevalideerde wizard-input ──────────────────────────────────────────────

/**
 * Ruwe UI-data zoals binnengekomen vanuit de wizard, vóór validatie en mapping.
 *
 * @remarks
 * Dit type is de input van `PrivacyAirlock.collectAndDistributeData()`.
 * Het is bewust breed getypt met een index-signatuur om progressieve wizard-invulling
 * op te vangen. Gebruik dit type **alleen** aan de ingang van de PrivacyAirlock;
 * daarna altijd werken met `ResearchMember` of `AnonymizedResearchPayload`.
 */
export interface RawUIData {
  setup?:      Record<string, unknown>;
  household?:  { members: unknown[] };
  finance?:    Record<string, unknown>;
  fullName?:   string;
  firstName?:  string;
  lastName?:   string;
  memberType?: string;
  type?:       string;
  id?:         string;
  fieldId?:    string;
  age?:        number;
  /** Nederlandse alias voor `age`, afkomstig uit legacy wizard-velden. */
  leeftijd?:   number;
  amount?:     number;
  category?:   string;
  [key: string]: unknown;
}

// ─── Geanonimiseerde research-output ─────────────────────────────────────────

/**
 * Privacy-veilige payload voor statistisch onderzoek en externe opslag.
 *
 * @remarks
 * Bevat **geen** PII: geen namen, geen e-mailadressen, geen volledige postcodes.
 * `researchId` is een gehashte vervanging voor de lokale `entityId`
 * (zie `PrivacyAirlock.makeResearchId()`).
 * `assertNoPIILeak()` in `PrivacyAirlock` verifieert dit contract vóór elke export.
 */
export interface AnonymizedResearchPayload {
  /** Versie van dit payload-schema, voor backwards-compatibiliteit. */
  version?:        string;
  /** ISO 8601 tijdstempel van aanmaak. */
  timestamp:       string;
  anonymizedData?: Record<string, unknown>;
  metadata?: {
    source: 'wizard' | 'import';
    os:     string;
  };
  /** Gehashte member-ID — herleidbaar noch naar naam noch naar apparaat. */
  researchId?:  string;
  memberType?:  MemberType;
  age?:         number;
  /** Bedrag in euro's (niet centen) — uitsluitend voor geaggregeerde analyse. */
  amount?:      number;
  category?:    string;
}

// ─── Database-contract ────────────────────────────────────────────────────────

/**
 * Volledig database-contract voor push via N8N naar externe opslag.
 *
 * @remarks
 * `isSpecialStatus` is een berekend veld via `ResearchValidator.mapToContract()`.
 * Dit veld is nog niet actief; zie de TODO in dit bestand over de N8N-integratie.
 *
 * @example
 * const contract = ResearchValidator.mapToContract(id, externalId, members);
 * await database.save(contract);
 */
export interface ResearchContract {
  id:             string;
  externalId:     string;
  /** Berekend statusveld; waarde-semantiek bepaald door `ResearchValidator`. */
  isSpecialStatus: number;
  data: {
    members: ResearchMember[];
  };
}

/**
 * Semver-versienummer van het `ResearchContract`-schema.
 * Ophogen bij structurele wijzigingen in `ResearchMember` om
 * de integriteit van de onderzoeksdataset te waarborgen.
 */
export const CONTRACT_VERSION = '1.0.0';
