/**
 * @file_intent Dient als een "barrel"-bestand dat alle `ViewModel`-types uit de `@domain`-laag
 *   verzamelt en opnieuw exporteert, én als definitieplaats voor UI-eigen ViewModel-types.
 * @repo_architecture UI Layer - Type Definition Facade.
 * @contract
 *   - Re-exporteert domain PrimitiveRegistry types via dit stabiele import-pad.
 *   - Definieert UI-eigen ViewModels die geen domain-imports nodig hebben
 *     (CsvAnalysisFeedbackVM en hulptypes).
 * @ai_instruction UI-componenten importeren types altijd vanuit dit bestand,
 *   nooit rechtstreeks uit `@domain`. Nieuwe UI-eigen ViewModel-types worden
 *   hier toegevoegd, niet in de domain-laag.
 */
// src/ui/types/viewModels.ts

export type {
  // ──────────── BASE ────────────
  PrimitiveStyleRule,
  PrimitiveType,
  BasePrimitiveViewModel,
  PrimitiveViewModel,

  // ──────────── CONCRETE VIEW MODELS ────────────
  CounterViewModel,
  CurrencyViewModel,
  TextViewModel,
  NumberViewModel,

  // ──────────── CHIP GROUP ────────────
  ChipViewModel,
  ChipGroupViewModel,

  // ──────────── RADIO ────────────
  RadioOptionViewModel,
  RadioViewModel,

  // ──────────── TOGGLE ────────────
  ToggleViewModel,

  // ──────────── LABEL ────────────
  LabelViewModel,

  // ──────────── DATE ────────────
  DateViewModel,

  // ──────────── METADATA ────────────
  PrimitiveMetadata,
} from '@ui/kernel';

/**
 * UI-utility type: universele FieldViewModel alias.
 */
import type { PrimitiveViewModel as DomainUnion } from '@ui/kernel';
export type UIFieldViewModel = DomainUnion;

// ─────────────────────────────────────────────────────────────────────────────
// UI-LAYER SPECIFIC TYPES
// Geen domain-imports — puur string-unions en interfaces.
// ─────────────────────────────────────────────────────────────────────────────

export interface UIPrimitiveViewModel {
  entryId: string;
  primitiveType: string;
  styleKey?: string;
}

export interface UIEntryViewModel {
  entryId: string;
  labelToken: string;
  placeholderToken?: string;
  options?: readonly string[];
  optionsKey?: string;
  visibilityRuleName?: string;
  child: UIPrimitiveViewModel;
}

export interface UISectionViewModel {
  sectionId: string;
  titleToken: string;
  layout: 'list' | 'grid' | 'card' | 'stepper';
  uiModel?: 'numericWrapper' | 'collapsible' | 'swipeable' | 'readonly';
  children: UIEntryViewModel[];
}

export interface UIScreenViewModel {
  screenId: string;
  titleToken: string;
  type: string;
  sections: UISectionViewModel[];
  navigation: {
    next?: string;
    previous?: string;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// CsvAnalysisFeedback ViewModel
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Semantische kleur-rol — UI mapt dit naar `colors[colorRole]`.
 * Bewust geen import van ColorScheme: puur string union, geen domain-afhankelijkheid.
 */
export type ColorRole = 'success' | 'error' | 'warning' | 'textPrimary';

/** Eén waarschuwingsbadge (discrepantie, ontbrekende kosten) */
export interface WarningItemVM {
  /** Stabiele key voor React list-rendering */
  id: string;
  /** Pre-geformatteerde label uit WizStrings.csvAnalysis */
  label: string;
  colorRole: ColorRole;
}

/** Eén rij in periode-overzicht of vergelijkingssectie */
export interface SummaryRowVM {
  label: string;
  /** Pre-geformatteerde waarde, bijv. '€ 1.234,56' of '42' */
  value: string;
  colorRole: ColorRole;
}

/** Vergelijkingssectie CSV-inkomen vs. wizard-inkomen */
export interface SetupComparisonVM {
  title: string;
  rows: SummaryRowVM[];
}

/**
 * Volledig ViewModel voor CsvAnalysisFeedback.
 * Gebouwd door CsvAnalysisFeedbackVMFactory in de orchestrator-laag.
 * UI bindt alleen — geen centen, geen null-checks, geen formattering.
 */
export interface CsvAnalysisFeedbackVM {
  /** true → render lege staat; false → render analyse */
  isEmpty: boolean;

  // ── Lege staat ──────────────────────────────────────────────
  emptyTitle: string;
  emptyMessage: string;

  // ── Gevulde staat ────────────────────────────────────────────
  title: string;
  warnings: WarningItemVM[];

  periodTitle: string;
  periodRows: SummaryRowVM[];

  showSetupComparison: boolean;
  setupComparison: SetupComparisonVM | null;
}
