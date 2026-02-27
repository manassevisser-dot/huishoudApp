// src/core/types/core.ts

/**
 * Publieke type-API van de applicatie: re-exporteert Zod-afgeleide types
 * uit de adapter-laag en definieert convenience-aliassen voor diep geneste
 * `FormState`-secties.
 *
 * @module core/types
 * @see {@link ./README.md | Core Types — Details}
 * @see {@link ../../adapters/validation/formStateSchema.ts | FormStateSchema — bron van truth}
 *
 * @remarks
 * Dit bestand is het **enige importpunt** voor FormState-afgeleide types buiten
 * de adapter-laag. Importeer nooit direct uit `formStateSchema` in orchestrators of UI.
 */

import {
  FormState,
  Member,
  Auto,
  DataSection,
  CsvImportState,
  CsvAnalysisResult,
  TransactionRecord,
  TransactionHistory,
} from '@adapters/validation/formStateSchema';

/**
 * Re-exports van Zod-afgeleide types.
 * De definities leven in `formStateSchema.ts`; hier worden ze publiek gemaakt.
 */
export type {
  /** Volledige applicatie-state, afgeleid uit `FormStateSchema`. */
  FormState,
  /** Één huishoudlid, afgeleid uit `MemberSchema`. */
  Member,
  /** Één voertuig, afgeleid uit `AutoSchema`. */
  Auto,
  /** Union van de vier data-secties: `'setup' | 'household' | 'finance' | 'latestTransaction'`. */
  DataSection,
  /** State van een CSV-import, inclusief transacties en metadata. */
  CsvImportState,
  /** Resultaat van een CSV-analyse: discrepantie-vlaggen en periode-samenvatting. */
  CsvAnalysisResult,
  /** Eén opgeslagen transactie in de undo-stack (`amountCents`, ISO-datum). */
  TransactionRecord,
  /** Past/present/future-stack voor undo/redo van transacties. */
  TransactionHistory,
};

/** Interne utility: extraheert het element-type uit een (readonly) array. */
type ElementOf<T> = T extends readonly (infer U)[] ? U : never;

// ─── Convenience-aliassen voor diep geneste FormState-secties ────────────────

/** Huishoud-configuratie: aantal mensen, woningtype, huisdieren, etc. */
export type SetupData    = FormState['data']['setup'];

/** Huishoud-samenstelling: members-array en toeslag-bedragen. */
export type Household    = FormState['data']['household'];

/** Financiën: income + expenses als item-lijsten met totalen. */
export type Finance      = FormState['data']['finance'];

/** CSV-import state, optioneel aanwezig in `FormState.data`. */
export type CsvImportData = FormState['data']['csvImport'];

/** Alias voor `CsvAnalysisResult` — het berekende ViewModel voor het analyse-scherm. */
export type CsvAnalysisVM = CsvAnalysisResult;

/**
 * Eén item uit `Finance.income.items`.
 *
 * @example
 * function renderIncome(item: IncomeItem) { ... }
 */
export type IncomeItem  = ElementOf<NonNullable<Finance['income']['items']>>;

/**
 * Eén item uit `Finance.expenses.items`.
 *
 * @example
 * function renderExpense(item: ExpenseItem) { ... }
 */
export type ExpenseItem = ElementOf<NonNullable<Finance['expenses']['items']>>;

// ─── Utility types ────────────────────────────────────────────────────────────

/**
 * Maakt alle eigenschappen van `T` recursief optioneel.
 * Gebruik dit voor partiële state-updates in reducer-payloads.
 *
 * @typeParam T - Het type waarvan een partiële versie nodig is
 *
 * @example
 * function patchSetup(patch: DeepPartial<SetupData>): void { ... }
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? DeepPartial<U>[]
    : T[P] extends object
    ? DeepPartial<T[P]>
    : T[P];
};
