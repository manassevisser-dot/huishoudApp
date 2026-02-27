// src/domain/constants/businessRules.ts

/**
 * Gedeelde business-rule drempelwaarden voor financiële analyse.
 *
 * @module domain/constants
 * @see {@link ./README.md | Constants — Details}
 *
 * @remarks
 * Alleen constanten die door **minstens twee modules** worden gebruikt horen hier.
 * Module-specifieke drempelwaarden blijven in hun eigen bestand.
 */

/**
 * Drempelwaarde voor inkomensdiscrepantie: €50,00 (5 000 centen).
 *
 * Als het verschil tussen csv-inkomen en wizard-inkomen groter is dan dit bedrag,
 * wordt `isDiscrepancy = true` in `CsvAnalysisResult`.
 *
 * @remarks
 * Gekozen als absolute drempel i.p.v. procentueel: bij kleine inkomens (€200) zou
 * een percentage van 10% al bij €20 afwijking markeren — te gevoelig voor dagelijkse
 * variatie. €50 is een stabiele, intuïtieve grens voor gebruikers.
 *
 * Gebruikt door: `CsvAnalysisService`, `StatementIntakePipeline`.
 */
export const INCOME_DISCREPANCY_THRESHOLD_CENTS = 5_000; // €50,00

/**
 * Minimaal aantal transacties voor een zinvolle periode-analyse.
 * Onder dit aantal toont de UI een waarschuwing in plaats van een analyse-resultaat.
 */
export const MIN_TRANSACTIONS_FOR_ANALYSIS = 3;

/**
 * Canonieke categorie-naam voor woonlasten-transacties (ING/Rabobank `CATEGORY_RULES`).
 *
 * @remarks
 * Enkelvoudige SSOT — niet hardcoded herhalen in `CsvAnalysisService` of `detectMissingHousingCosts`.
 */
export const CATEGORY_WONEN = 'Wonen' as const;
