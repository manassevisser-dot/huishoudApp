// src/ui/sections/CsvAnalysisFeedback.tsx
/**
 * @file_intent Pure presentatie-component voor het CSV-analyse resultaat.
 * @repo_architecture UI Layer - View/Component (Section). Puur binding — geen logica.
 * @contract
 *   - Ontvangt een volledig gebouwde `CsvAnalysisFeedbackVM` via props.
 *   - Bevat nul business-logica, nul formattering, nul null-checks op domain data.
 *   - Volgt het FinancialSummary-patroon: UI bindt alleen aan pre-formatted strings.
 *   - Kleurrollen worden via resolveColor() opgezocht — geen computed index op ColorScheme.
 *   - Alle strings komen uit het VM (gebouwd vanuit WizStrings) — geen hardcoded tekst.
 * @ai_instruction
 *   Wijzig dit bestand NIET voor inhoudelijke aanpassingen (teksten, logica, formatting).
 *   Die horen in CsvAnalysisFeedbackVMFactory.ts of WizStrings.ts.
 *   Dit bestand mag alleen worden gewijzigd voor layout/styling aanpassingen.
 * @see CsvAnalysisFeedbackVMFactory — bouwt de VM
 * @see WizStrings.csvAnalysis — levert alle strings
 * @see CsvAnalysisFeedbackContainer — connected wrapper die VM bouwt en doorgeeft
 */
import * as React from 'react';
import { View, Text } from 'react-native';
import { useAppStyles } from '@ui/styles/useAppStyles';
import { SummaryRow } from '@ui/sections/FinancialSummary';
import { useFormState } from '@ui/providers/FormStateProvider';
import { CsvAnalysisFeedbackVMFactory } from '@app/orchestrators/factory/CsvAnalysisFeedbackVMFactory';
import type { CsvAnalysisResult } from '@app/orchestrators/types/csvUpload.types';
import type {
  CsvAnalysisFeedbackVM,
  WarningItemVM,
  SummaryRowVM,
  SetupComparisonVM,
  ColorRole,
} from '@ui/types/viewModels';

// ─── Type alias voor colors — geen domain-import nodig ────────────────────────
type AppColors = ReturnType<typeof useAppStyles>['colors'];

/**
 * Type-veilige kleurresolutie.
 * ColorScheme heeft geen index-signature — computed access `colors[role]` geeft een
 * error-type. Deze helper maakt een expliciete Record<ColorRole, string>-mapping
 * zodat elke branch volledig getypt is.
 */
function resolveColor(colors: AppColors, role: ColorRole): string {
  const map: Record<ColorRole, string> = {
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    textPrimary: colors.textPrimary,
  };
  return map[role];
}

// ─── Sub-componenten ──────────────────────────────────────────────────────────

interface WarningBadgeProps {
  item: WarningItemVM;
}

const WarningBadge: React.FC<WarningBadgeProps> = ({ item }) => {
  const { colors } = useAppStyles();
  const color = resolveColor(colors, item.colorRole);
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        padding: 10,
        borderRadius: 8,
        // TODO: vervang door warningBackground token in StyleRegistry
        backgroundColor: color + '1A',
      }}
    >
      <Text style={{ color, fontWeight: '700', fontSize: 13 }}>{item.label}</Text>
    </View>
  );
};

// ─── Lege staat ───────────────────────────────────────────────────────────────

interface EmptyStateProps {
  vm: Pick<CsvAnalysisFeedbackVM, 'emptyTitle' | 'emptyMessage'>;
}

const EmptyState: React.FC<EmptyStateProps> = ({ vm }) => {
  const { styles } = useAppStyles();
  return (
    <View style={styles.summaryDetail}>
      <Text style={styles.screenTitle}>{vm.emptyTitle}</Text>
      <Text style={styles.summaryLabel}>{vm.emptyMessage}</Text>
    </View>
  );
};

// ─── Periode-overzicht ────────────────────────────────────────────────────────

interface PeriodSectionProps {
  title: string;
  rows: SummaryRowVM[];
  spaceTop: number;
}

const PeriodSection: React.FC<PeriodSectionProps> = ({ title, rows, spaceTop }) => {
  const { styles, colors } = useAppStyles();
  return (
    <>
      <Text style={[styles.summaryLabel, { marginTop: spaceTop, fontWeight: '700' }]}>
        {title}
      </Text>
      {rows.map((row: SummaryRowVM) => (
        <SummaryRow
          key={row.label}
          label={row.label}
          value={row.value}
          valueColor={resolveColor(colors, row.colorRole)}
          styles={styles}
        />
      ))}
    </>
  );
};

// ─── Vergelijkingssectie ──────────────────────────────────────────────────────

interface ComparisonSectionProps {
  vm: SetupComparisonVM;
  spaceTop: number;
}

const ComparisonSection: React.FC<ComparisonSectionProps> = ({ vm, spaceTop }) => {
  const { styles, colors } = useAppStyles();
  return (
    <>
      <Text style={[styles.summaryLabel, { marginTop: spaceTop, fontWeight: '700' }]}>
        {vm.title}
      </Text>
      {vm.rows.map((row: SummaryRowVM) => (
        <SummaryRow
          key={row.label}
          label={row.label}
          value={row.value}
          valueColor={resolveColor(colors, row.colorRole)}
          styles={styles}
        />
      ))}
    </>
  );
};

// ─── Presentatie-component (pure binding) ─────────────────────────────────────

interface CsvAnalysisFeedbackProps {
  vm: CsvAnalysisFeedbackVM;
}

export const CsvAnalysisFeedback: React.FC<CsvAnalysisFeedbackProps> = ({ vm }) => {
  const { styles, Tokens } = useAppStyles();

  if (vm.isEmpty === true) {
    return <EmptyState vm={vm} />;
  }

  return (
    <View style={styles.summaryDetail}>
      <Text style={styles.screenTitle}>{vm.title}</Text>

      {vm.warnings.map((w: WarningItemVM) => (
        <WarningBadge key={w.id} item={w} />
      ))}

      <PeriodSection
        title={vm.periodTitle}
        rows={vm.periodRows}
        spaceTop={Tokens.Space.md}
      />

      {vm.showSetupComparison === true && vm.setupComparison !== null && (
        <ComparisonSection
          vm={vm.setupComparison}
          spaceTop={Tokens.Space.md}
        />
      )}

      <View style={{ height: Tokens.Space.md }} />
    </View>
  );
};

// ─── Connected container ──────────────────────────────────────────────────────
/**
 * Thin wrapper die state leest, VM bouwt via de factory en doorgeeft.
 * Gebruik dit component in screens/navigators — niet de presentatiecomponent rechtstreeks.
 * De presentatie-component is volledig ontkoppeld van state.
 */
export const CsvAnalysisFeedbackContainer: React.FC = () => {
  const { state } = useFormState();

  // Stap 1: viewModels naar Record brengen (state.viewModels is Partial<...> | undefined)
  const viewModelMap: Record<string, unknown> =
    state.viewModels !== null && state.viewModels !== undefined
      ? (state.viewModels as Record<string, unknown>)
      : {};

  // Stap 2: csvAnalysis ophalen als unknown, dan casten naar het verwachte type
  const csvAnalysisRaw: unknown = viewModelMap['csvAnalysis'];
  const rawAnalysis =
    csvAnalysisRaw !== undefined ? (csvAnalysisRaw as CsvAnalysisResult) : undefined;

  const vm = CsvAnalysisFeedbackVMFactory.build(rawAnalysis);

  return <CsvAnalysisFeedback vm={vm} />;
};
