// src/domain/constants/businessRules.ts
/**
 * @file_intent Centraliseert business-rule constanten die door meerdere services worden gedeeld.
 * @repo_architecture Domain Layer - Constants (SSOT).
 * @term_definition
 *   INCOME_DISCREPANCY_THRESHOLD_CENTS = De absolute drempelwaarde (in centen) waarboven een
 *     verschil tussen csv-inkomen en wizard-inkomen als significant wordt beschouwd.
 * @contract
 *   Elke business-rule drempel of grenswaarde hoort hier — niet verspreid over service-bestanden.
 *   Beide CsvAnalysisService en StatementIntakePipeline gebruiken INCOME_DISCREPANCY_THRESHOLD_CENTS.
 * @ai_instruction
 *   Voeg hier ALLEEN constanten toe die door minstens twee modules worden gedeeld.
 *   Modulespecifieke drempelwaarden horen in hun eigen bestand.
 */

/**
 * Drempelwaarde voor inkomensdiscrepantie: €50,00.
 * Als het verschil tussen csv-inkomen en wizard-inkomen groter is dan dit bedrag,
 * wordt isDiscrepancy = true in CsvAnalysisResult.
 *
 * Keuze voor absolute drempel i.p.v. procentueel:
 * - Kleine inkomens (€200) zouden bij 10% al bij €20 afwijking markeren (te gevoelig)
 * - €50 is een stabiele, intuïtieve grens voor gebruikers
 */
export const INCOME_DISCREPANCY_THRESHOLD_CENTS = 5_000; // € 50,00

/**
 * Minimaal aantal transacties voor een zinvolle periode-analyse.
 * Onder dit aantal toont de UI een waarschuwing i.p.v. analyse-resultaat.
 */
export const MIN_TRANSACTIONS_FOR_ANALYSIS = 3;

/**
 * Categorie-naam voor woonlasten-transacties (ING/Rabobank CATEGORY_RULES).
 * Enkelvoudige SSOT — niet hardcoded in meerdere services.
 */
export const CATEGORY_WONEN = 'Wonen' as const;
