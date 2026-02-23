// src/ui/sections/CsvAnalysisFeedback.tsx
/**
 * @file_intent Toont het resultaat van de CSV-analyse: discrepantie, ontbrekende kosten,
 *   periode-overzicht en vergelijking met wizard-inkomen.
 * @repo_architecture UI Layer - View/Component (Section). Presentatie-only — geen side effects.
 *   Volgt het FinancialSummary-patroon: leest uit viewModels, rendert met useAppStyles.
 * @term_definition
 *   CsvAnalysisResult = Het berekende analyse-resultaat in viewModels.csvAnalysis (Fase 6).
 *   SummaryRow = Hergebruikt uit FinancialSummary.tsx voor consistente label+waarde weergave.
 * @contract
 *   Leest state.viewModels?.csvAnalysis uit FormState.
 *   Als csvAnalysis undefined is (voor Fase 6 of na RESET): toont lege staat.
 *   Geen dispatch, geen orchestrator-aanroep, geen navigatie.
 * @ai_instruction
 *   CsvAnalysisResult wordt gevuld door CsvAnalysisService via CsvUploadWorkflow (Fase 6).
 *   Cent-naar-euro formattering via formatCurrency() uit @domain/helpers/numbers.
 *     Niet lokaal: formatCurrency is NL-locale SSOT (nl-NL, EUR, 2 decimalen).
 *   viewModels.csvAnalysis is pas beschikbaar na Fase 6 (workflow).
 *   Tot die tijd toont dit component de lege staat.
 * @changes [Fase 6-prep]
 *   centsToDisplay() verwijderd — vervangen door formatCurrency() (@domain/helpers/numbers).
 *   Cast op viewModels verwijderd zodra Fase 5 FormState schema bijgewerkt is.
 */
import * as React from 'react';
import { View, Text } from 'react-native';
import { useFormState } from '@ui/providers/FormStateProvider';
import { useAppStyles } from '@ui/styles/useAppStyles';
import { SummaryRow } from '@ui/sections/FinancialSummary';
import type { CsvAnalysisResult } from '@app/orchestrators/types/csvUpload.types';
import { formatCurrency } from '@domain/helpers/numbers';

// ─── Subcomponenten ───────────────────────────────────────────────────────────

interface WarningBadgeProps {
  label: string;
  color: string;
}

const WarningBadge: React.FC<WarningBadgeProps> = ({ label, color }) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      padding: 10,
      borderRadius: 8,
      backgroundColor: color + '1A', // 10% opacity achtergrond
    }}
  >
    <Text style={{ color, fontWeight: '700', fontSize: 13 }}>{label}</Text>
  </View>
);

// ─── Lege staat ───────────────────────────────────────────────────────────────

const EmptyState: React.FC = () => {
  const { styles } = useAppStyles();
  return (
    <View style={styles.summaryDetail}>
      <Text style={styles.screenTitle}>CSV Analyse</Text>
      <Text style={styles.summaryLabel}>
        Importeer een CSV-bestand om het analyse-resultaat te zien.
      </Text>
    </View>
  );
};

// ─── Hoofd component ──────────────────────────────────────────────────────────

/**
 * Leest viewModels.csvAnalysis en rendert het analyse-resultaat.
 * Toont lege staat als csvAnalysis nog niet beschikbaar is (voor Fase 6).
 */
export const CsvAnalysisFeedback: React.FC = () => {
  const { state } = useFormState();
  const { styles, colors, Tokens } = useAppStyles();

  // viewModels.csvAnalysis bestaat pas na Fase 6 (workflow + CsvAnalysisService)
  // Cast via unknown totdat Fase 5 de FormState types volledig synchroniseert
  const analysis = (state.viewModels as Record<string, unknown>)?.['csvAnalysis'] as
    | CsvAnalysisResult
    | undefined;

  if (analysis === undefined || analysis === null) {
    return <EmptyState />;
  }

  const { isDiscrepancy, hasMissingCosts, periodSummary, setupComparison } = analysis;

  return (
    <View style={styles.summaryDetail}>
      <Text style={styles.screenTitle}>CSV Analyse Resultaat</Text>

      {/* ── Waarschuwingen ───────────────────────────────────────── */}
      {isDiscrepancy && (
        <WarningBadge
          label="⚠ Inkomen in CSV wijkt af van wizard-opgave"
          color={colors.warning ?? '#F59E0B'}
        />
      )}
      {hasMissingCosts && (
        <WarningBadge
          label="⚠ Woonlasten gevonden die niet verwacht werden"
          color={colors.warning ?? '#F59E0B'}
        />
      )}

      {/* ── Periode-overzicht ────────────────────────────────────── */}
      <Text style={[styles.summaryLabel, { marginTop: Tokens.Space.md, fontWeight: '700' }]}>
        Periode-overzicht
      </Text>
      <SummaryRow
        label="Totaal inkomsten:"
        value={formatCurrency(periodSummary.totalIncomeCents)}
        valueColor={colors.success}
        styles={styles}
      />
      <SummaryRow
        label="Totaal uitgaven:"
        value={formatCurrency(periodSummary.totalExpensesCents)}
        valueColor={colors.error}
        styles={styles}
      />
      <View style={styles.summaryRowTotal}>
        <Text style={styles.summaryLabelBold}>Saldo:</Text>
        <Text
          style={[
            styles.summaryValueBold,
            { color: periodSummary.balanceCents >= 0 ? colors.success : colors.error },
          ]}
        >
          {formatCurrency(periodSummary.balanceCents)}
        </Text>
      </View>
      <SummaryRow
        label="Aantal transacties:"
        value={String(periodSummary.transactionCount)}
        valueColor={colors.text ?? '#111827'}
        styles={styles}
      />

      {/* ── Setup-vergelijking ───────────────────────────────────── */}
      {setupComparison !== null && setupComparison !== undefined && (
        <>
          <Text
            style={[styles.summaryLabel, { marginTop: Tokens.Space.md, fontWeight: '700' }]}
          >
            Vergelijking met wizard
          </Text>
          <SummaryRow
            label="Inkomen in CSV:"
            value={formatCurrency(setupComparison.csvIncomeCents)}
            valueColor={colors.success}
            styles={styles}
          />
          <SummaryRow
            label="Inkomen in wizard:"
            value={formatCurrency(setupComparison.setupIncomeCents)}
            valueColor={colors.text ?? '#111827'}
            styles={styles}
          />
          <SummaryRow
            label="Verschil:"
            value={formatCurrency(setupComparison.diffCents)}
            valueColor={setupComparison.diffCents >= 0 ? colors.success : colors.error}
            styles={styles}
          />
        </>
      )}

      <View style={{ height: Tokens.Space.md }} />
    </View>
  );
};
