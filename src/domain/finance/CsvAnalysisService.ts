// src/domain/finance/CsvAnalysisService.ts
/**
 * @file_intent Stateless service voor analyse van CSV-transacties t.o.v. wizard-setup.
 * @repo_architecture Domain Layer - Finance (Business Logic).
 * @term_definition
 *   analyse() = Berekent periodeSamenvatting + vergelijking met wizard-inkomen.
 *   Reconcile = Vergelijkt csv-inkomen met wizard-finance, detecteert afwijkingen.
 * @contract
 *   Puur functioneel: geen state, geen side-effects, geen constructor-dependencies.
 *   Retourneert altijd CsvAnalysisResult — nooit undefined of null.
 *   CsvAnalysisResult hoort in viewModels, NOOIT in data (zie csvUpload.types.ts).
 * @dependencies
 *   toCents()             — @domain/helpers/numbers      (amount → centen, float-safe)
 *   formatCurrency()      — @domain/helpers/numbers      (centen → NL-locale display string)
 *   computePhoenixSummary — @domain/rules/calculateRules (wizard-inkomen uit finance)
 *   dataProcessor         — @domain/finance/StatementIntakePipeline (categorie-fallback)
 *   INCOME_DISCREPANCY_THRESHOLD_CENTS — @domain/constants/businessRules (gedeelde drempel)
 *   CATEGORY_WONEN        — @domain/constants/businessRules (enkelvoudige string-SSOT)
 * @changes [Fase 6-prep]
 *   Methode-signatuur: analyse(transactions, setupData, finance).
 *   analyse() opgesplitst in computePeriodTotals() + computeReconciliation() (<30 regels elk).
 *   discrepancyDetails gebruikt formatCurrency() i.p.v. handmatige euro-opmaak (ADR-05).
 *   detectPeriod() hernoemd naar _detectPeriod (gereserveerd voor Fase 6, nog niet in gebruik).
 */

import type { SetupData, Finance } from '@core/types/core';
import type {
  ParsedCsvTransaction,
  CsvAnalysisResult,
} from '@app/orchestrators/types/csvUpload.types';
import { toCents, formatCurrency } from '@domain/helpers/numbers';
import { computePhoenixSummary } from '@domain/rules/calculateRules';
import { dataProcessor } from '@domain/finance/StatementIntakePipeline';
import {
  INCOME_DISCREPANCY_THRESHOLD_CENTS,
  CATEGORY_WONEN,
} from '@domain/constants/businessRules';

// ─── Private helpers ──────────────────────────────────────────────────────────

/**
 * Bepaalt de effectieve categorie van een transactie.
 * Valt terug op dataProcessor.categorize() voor transacties zonder categorie.
 */
function effectiveCategory(tx: ParsedCsvTransaction): string {
  if (tx.category !== '' && tx.category !== 'Overig') {
    return tx.category;
  }
  return dataProcessor.categorize(tx.description);
}

function isWonenTransaction(tx: ParsedCsvTransaction): boolean {
  return effectiveCategory(tx) === CATEGORY_WONEN;
}

/**
 * Bepaalt of woonlasten als 'ontbrekend' worden beschouwd:
 * CSV bevat woonlast-transacties, maar de wizard heeft €0 voor alle woonposten.
 */
function detectMissingHousingCosts(
  transactions: ParsedCsvTransaction[],
  setupData: SetupData | null,
  finance: Finance | null,
): boolean {
  if (!transactions.some(isWonenTransaction)) return false;
  if (finance === null || setupData === null) return false;
  if (setupData.woningType === 'Gratis inwonend') return false;

  const expenses = finance.expenses as Record<string, unknown>;
  return (
    Number(expenses['kaleHuur'] ?? 0) === 0 &&
    Number(expenses['hypotheekBruto'] ?? 0) === 0 &&
    Number(expenses['woonlasten'] ?? 0) === 0
  );
}

/**
 * Berekent periode-totalen uit de actieve (niet-genegeerde) transacties.
 * Gereserveerd voor Fase 6: _detectPeriod() voegt from/to toe aan de samenvatting.
 */
function computePeriodTotals(activeTx: ParsedCsvTransaction[]): {
  totalIncomeCents: number;
  totalExpensesCents: number;
  balanceCents: number;
} {
  const totalIncomeCents = activeTx
    .filter((tx) => tx.amount > 0)
    .reduce((sum, tx) => sum + toCents(tx.amount), 0);

  const totalExpensesCents = activeTx
    .filter((tx) => tx.amount < 0)
    .reduce((sum, tx) => sum + toCents(Math.abs(tx.amount)), 0);

  return { totalIncomeCents, totalExpensesCents, balanceCents: totalIncomeCents - totalExpensesCents };
}

/**
 * Vergelijkt csv-inkomen met wizard-inkomen en bepaalt discrepantie.
 * Drempel via INCOME_DISCREPANCY_THRESHOLD_CENTS (€50, gedeelde SSOT).
 * discrepancyDetails via formatCurrency() — geen handmatige euro-opmaak (ADR-05).
 */
function computeReconciliation(
  totalIncomeCents: number,
  finance: Finance | null,
): {
  setupIncomeCents: number;
  diffCents: number;
  isDiscrepancy: boolean;
  discrepancyDetails: string | undefined;
  setupComparison: CsvAnalysisResult['setupComparison'];
} {
  const setupIncomeCents =
    finance !== null ? computePhoenixSummary(finance).totalIncomeCents : 0;

  const diffCents = totalIncomeCents - setupIncomeCents;
  const isDiscrepancy =
    totalIncomeCents > 0 && Math.abs(diffCents) > INCOME_DISCREPANCY_THRESHOLD_CENTS;

  const discrepancyDetails = isDiscrepancy
    ? `CSV-inkomen wijkt ${formatCurrency(Math.abs(diffCents))} af van wizard-inkomen`
    : undefined;

  const setupComparison =
    totalIncomeCents > 0
      ? { csvIncomeCents: totalIncomeCents, setupIncomeCents, diffCents }
      : null;

  return { setupIncomeCents, diffCents, isDiscrepancy, discrepancyDetails, setupComparison };
}

/**
 * Gereserveerd voor Fase 6: detecteert de vroegste en laatste datum in de transacties.
 * Werkt correct op YYYY-MM-DD ISO-strings (lexicografisch == chronologisch).
 * Prefix _ geeft aan: gedefinieerd maar bewust nog niet aangeroepen.
 */

function _detectPeriod(transactions: ParsedCsvTransaction[]): { from: string; to: string } | null {
  const dates = transactions.map((tx) => tx.date).filter((d) => d !== '');
  if (dates.length === 0) return null;
  return {
    from: dates.reduce((a, b) => (a < b ? a : b)),
    to: dates.reduce((a, b) => (a > b ? a : b)),
  };
}

// ─── Publieke API ─────────────────────────────────────────────────────────────

export class CsvAnalysisService {
  /**
   * Analyseert CSV-transacties en vergelijkt met wizard-finance.
   *
   * @param transactions  ACL-cleaned transacties (uit ImportOrchestrator)
   * @param setupData     Wizard setup-data (voor woontype-check), mag null zijn
   * @param finance       Wizard finance-data (voor wizard-inkomen berekening), mag null zijn
   * @returns CsvAnalysisResult — altijd volledig ingevuld, nooit null
   */
  public static analyse(
    transactions: ParsedCsvTransaction[],
    setupData: SetupData | null,
    finance: Finance | null,
  ): CsvAnalysisResult {
    const activeTx = transactions.filter((tx) => tx.isIgnored !== true);

    const { totalIncomeCents, totalExpensesCents, balanceCents } =
      computePeriodTotals(activeTx);

    const { isDiscrepancy, discrepancyDetails, setupComparison } =
      computeReconciliation(totalIncomeCents, finance);

    const hasMissingCosts = detectMissingHousingCosts(transactions, setupData, finance);

    return {
      isDiscrepancy,
      hasMissingCosts,
      discrepancyDetails,
      periodSummary: {
        totalIncomeCents,
        totalExpensesCents,
        balanceCents,
        transactionCount: activeTx.length,
      },
      setupComparison,
    };
  }
}
