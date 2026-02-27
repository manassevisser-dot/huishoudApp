// src/app/orchestrators/factory/CsvAnalysisFeedbackVMFactory.ts
/**
 * @file_intent Pure factory die een `CsvAnalysisResult` (domain DTO) vertaalt naar
 *   `CsvAnalysisFeedbackVM` (UI ViewModel). Dit is de Anti-Corruption Layer tussen
 *   de CSV-analyse domain output en de presentatie-laag.
 * @repo_architecture Mobile Industry (MI) - Presentation Factory Layer.
 *   Zit in dezelfde laag als ScreenViewModelFactory en StyleFactory.
 * @term_definition
 *   CsvAnalysisResult = Domain DTO met ruwe centen en booleans.
 *   CsvAnalysisFeedbackVM = UI-klaar ViewModel: pre-formatted strings, kleurollen,
 *     isEmpty-flag. UI hoeft niets te berekenen of te formatteren.
 * @contract
 *   - Enige verantwoordelijkheid: CsvAnalysisResult → CsvAnalysisFeedbackVM.
 *   - formatCurrency() wordt hier aangeroepen, niet in de UI.
 *   - Alle strings komen uit WizStrings.csvAnalysis, niet uit de UI.
 *   - Kleurollen zijn semantisch ('success'/'error'), niet hex-waarden.
 *   - Bij undefined/null input: retourneert een geldige "lege staat" VM.
 * @ai_instruction
 *   Voeg hier logica toe wanneer de analyse-presentatie uitbreidt
 *   (bijv. nieuwe waarschuwingstypen, extra vergelijkingsrijen).
 *   De UI (CsvAnalysisFeedback.tsx) mag NOOIT worden aangepast voor logic-wijzigingen.
 */
import type { CsvAnalysisResult } from '@app/orchestrators/types/csvUpload.types';
import { formatCurrency } from '@domain/helpers/numbers';
import WizStrings from '@config/WizStrings';
import type {
  CsvAnalysisFeedbackVM,
  WarningItemVM,
  SummaryRowVM,
  SetupComparisonVM,
  ColorRole,
} from '@ui/types/viewModels';

const S = WizStrings.csvAnalysis;

// ─── Lege staat ───────────────────────────────────────────────────────────────

const EMPTY_VM: CsvAnalysisFeedbackVM = {
  isEmpty: true,
  emptyTitle: S.emptyTitle,
  emptyMessage: S.emptyMessage,
  // Gevulde staat leeg initialiseren — nooit gebruikt als isEmpty === true
  title: '',
  warnings: [],
  periodTitle: '',
  periodRows: [],
  showSetupComparison: false,
  setupComparison: null,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildWarnings(
  isDiscrepancy: boolean,
  hasMissingCosts: boolean,
): WarningItemVM[] {
  const items: WarningItemVM[] = [];
  if (isDiscrepancy) {
    items.push({ id: 'discrepancy', label: S.warningDiscrepancy, colorRole: 'warning' });
  }
  if (hasMissingCosts) {
    items.push({ id: 'missingCosts', label: S.warningMissingCosts, colorRole: 'warning' });
  }
  return items;
}

function buildPeriodRows(
  periodSummary: CsvAnalysisResult['periodSummary'],
): SummaryRowVM[] {
  const balanceColorRole: ColorRole =
    periodSummary.balanceCents >= 0 ? 'success' : 'error';

  return [
    {
      label: S.labelTotalIncome,
      value: formatCurrency(periodSummary.totalIncomeCents),
      colorRole: 'success',
    },
    {
      label: S.labelTotalExpenses,
      value: formatCurrency(periodSummary.totalExpensesCents),
      colorRole: 'error',
    },
    {
      label: S.labelBalance,
      value: formatCurrency(periodSummary.balanceCents),
      colorRole: balanceColorRole,
    },
    {
      label: S.labelTransactionCount,
      value: String(periodSummary.transactionCount),
      colorRole: 'textPrimary',
    },
  ];
}

function buildSetupComparison(
  comparison: NonNullable<CsvAnalysisResult['setupComparison']>,
): SetupComparisonVM {
  const diffColorRole: ColorRole = comparison.diffCents >= 0 ? 'success' : 'error';

  return {
    title: S.comparisonTitle,
    rows: [
      {
        label: S.labelCsvIncome,
        value: formatCurrency(comparison.csvIncomeCents),
        colorRole: 'success',
      },
      {
        label: S.labelSetupIncome,
        value: formatCurrency(comparison.setupIncomeCents),
        colorRole: 'textPrimary',
      },
      {
        label: S.labelDifference,
        value: formatCurrency(comparison.diffCents),
        colorRole: diffColorRole,
      },
    ],
  };
}

// ─── Publieke factory ─────────────────────────────────────────────────────────

export const CsvAnalysisFeedbackVMFactory = {
  /**
   * Bouwt een CsvAnalysisFeedbackVM op basis van een CsvAnalysisResult.
   * @param analysis - Domain DTO uit viewModels.csvAnalysis. undefined = lege staat.
   */
  build(analysis: CsvAnalysisResult | undefined | null): CsvAnalysisFeedbackVM {
    if (analysis == null) {
      return EMPTY_VM;
    }

    const { isDiscrepancy, hasMissingCosts, periodSummary, setupComparison } = analysis;

    return {
      isEmpty: false,
      emptyTitle: S.emptyTitle,
      emptyMessage: S.emptyMessage,

      title: S.title,
      warnings: buildWarnings(isDiscrepancy, hasMissingCosts),

      periodTitle: S.periodTitle,
      periodRows: buildPeriodRows(periodSummary),

      showSetupComparison: setupComparison != null,
      setupComparison:
        setupComparison != null ? buildSetupComparison(setupComparison) : null,
    };
  },
};
