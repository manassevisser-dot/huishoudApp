// [ORIGINEEL — zie src/app/orchestrators/MasterOrchestrator.ts]
// Bewaard als referentie. Niet aanpassen.
// SCHETS/MasterOrchestrator.ts (Corrected Version)
/**
 * @file_intent De centrale hub en facade voor alle applicatie-acties.
 * @ai_instruction This is the corrected version addressing all previous compilation errors.
 *   - Removed unused IUIBuilder interface.
 *   - Completely rewrote handleCsvImport to align with the new architecture.
 *   - Uses the correct dispatch actions ('UPDATE_DATA', 'UPDATE_VIEWMODEL').
 *   - Handles the data flow between data/research orchestrators correctly.
 */

import type {IUIOrchestrator} from './interfaces/IUIOrchestrator';
import type { FormStateOrchestrator } from './FormStateOrchestrator';
import type { IBusinessOrchestrator } from './interfaces/IBusinessOrchestrator';
import type { IValidationOrchestrator, SectionValidationResult } from './interfaces/IValidationOrchestrator';
import type { INavigationOrchestrator } from './interfaces/INavigationOrchestrator';
import type { IThemeOrchestrator } from './interfaces/IThemeOrchestrator';
import type { MasterOrchestratorAPI } from '@app/types/MasterOrchestratorAPI';
import { validateAtBoundary } from '@adapters/validation/validateAtBoundary';
import { logger } from '@adapters/audit/AuditLoggerAdapter';
import { resolveFieldId, EntryRegistry } from '@domain/registry/EntryRegistry';
import { labelFromToken } from '@domain/constants/labelResolver';
import { computePhoenixSummary } from '@domain/rules/calculateRules';
import type {
  StyledScreenVM,
  StyledSectionVM,
  StyledEntryVM,
} from '@app/orchestrators/factory/StyleFactory';
import { IValueOrchestrator } from './interfaces/IValueOrchestrator';
import type { ResearchOrchestrator, MasterProcessResult } from '@app/orchestrators/ResearchOrchestrator';
import { DATA_KEYS } from '@domain/constants/datakeys';
import type { DataManager } from './managers/DataManager';
import type { ExpenseItem } from '@core/types/core'; 

export interface RenderScreenVM {
  screenId: string;
  title: string;
  type: string;
  style?: unknown;
  sections: RenderSectionVM[];
  navigation: { next?: string; previous?: string };
}

export interface RenderSectionVM {
  sectionId: string;
  title: string;
  layout: string;
  uiModel?: string;
  style?: unknown;
  children: RenderEntryVM[];
}

export interface RenderEntryVM {
  entryId: string;
  fieldId: string;
  label: string;
  placeholder?: string;
  primitiveType: string;
  value: unknown;
  isVisible: boolean;
  options?: readonly string[];
  optionsKey?: string;
  style?: unknown;
  childStyle?: unknown;
  onChange: (value: unknown) => void;
}

interface IVisibilityEvaluator {
  evaluate(ruleName: string, memberId?: string): boolean;
}

type DomainCluster = {
  data: DataManager;
  business: IBusinessOrchestrator;
  validation: IValidationOrchestrator;
  visibility: IVisibilityEvaluator;
  value: IValueOrchestrator;
  research: ResearchOrchestrator;
};

type AppCluster = {
  ui: IUIOrchestrator;
  navigation: INavigationOrchestrator;
  theme: IThemeOrchestrator;
};

export class MasterOrchestrator implements MasterOrchestratorAPI {
  public readonly theme: IThemeOrchestrator;
  public readonly navigation: INavigationOrchestrator;
  public readonly ui: IUIOrchestrator;

  constructor(
    private readonly fso: FormStateOrchestrator,
    private readonly domain: DomainCluster,
    private readonly app: AppCluster,
  ) {
    this.theme = this.app.theme;
    this.navigation = this.app.navigation;
    this.ui = this.app.ui;
  }

  public buildRenderScreen(screenId: string): RenderScreenVM {
    const styled = this.app.ui.buildScreen(screenId);
    return this.toRenderScreen(styled);
  }

  private toRenderScreen(svm: StyledScreenVM): RenderScreenVM {
    return {
      screenId: svm.screenId,
      title: labelFromToken(svm.titleToken),
      type: svm.type,
      style: svm.style,
      navigation: svm.navigation,
      sections: svm.sections.map((s) => this.toRenderSection(s)),
    };
  }

  private toRenderSection(section: StyledSectionVM): RenderSectionVM {
    return {
      sectionId: section.sectionId,
      title: labelFromToken(section.titleToken),
      layout: section.layout,
      uiModel: section.uiModel,
      style: section.style,
      children: section.children.map((e) => this.toRenderEntry(e)),
    };
  }

  private toRenderEntry(entry: StyledEntryVM): RenderEntryVM {
    const entryDef = EntryRegistry.getDefinition(entry.entryId);
    if (entryDef === null) {
      throw new Error(`Entry '${entry.entryId}' not found in EntryRegistry`);
    }
    const fieldId = resolveFieldId(entry.entryId, entryDef);
    const isVisible = this.evaluateVisibility(entry.visibilityRuleName);
    return {
      entryId: entry.entryId,
      fieldId,
      label: labelFromToken(entry.labelToken),
      placeholder: entry.placeholderToken,
      primitiveType: entry.child.primitiveType,
      value: isVisible ? this.fso.getValue(fieldId) : undefined,
      isVisible,
      options: entry.options,
      optionsKey: entry.optionsKey,
      style: entry.style,
      childStyle: entry.child.style,
      onChange: (newValue: unknown) => { this.updateField(fieldId, newValue); },
    };
  }

  private evaluateVisibility(ruleName?: string): boolean {
    if (ruleName === undefined || ruleName === '') return true;
    return this.domain.visibility.evaluate(ruleName);
  }

  public isVisible(ruleName: string, memberId?: string): boolean {
    return this.domain.visibility.evaluate(ruleName, memberId);
  }

  public onNavigateBack(): void { this.app.navigation.navigateBack(); }
  public canNavigateNext(sectionId: string): boolean { return this.validateSection(sectionId).isValid; }
  public onNavigateNext(): void { this.app.navigation.navigateNext(); }

  public updateField(fieldId: string, value: unknown): void {
    const result = validateAtBoundary(fieldId, value);
    if (!result.success) {
      logger.warn('field_update_validation_failed', { orchestrator: 'master', action: 'updateField', fieldId, value, errorCode: result.error });
      return;
    }
    this.fso.updateField(fieldId, result.data);
    this.recomputeBusinessState();
  }

  public async handleCsvImport(csvText: string): Promise<void> {
    const state = this.fso.getState();
    const localImportResult = this.domain.data.processCsvImport({ csvText, state });
    if (localImportResult.status !== 'success') {
      if (localImportResult.status === 'error') logger.error('csv_parse_failed', { orchestrator: 'master', action: 'handleCsvImport', error: localImportResult.errorMessage });
      else if (localImportResult.status === 'empty') logger.warn('csv_parse_empty', { orchestrator: 'master', action: 'handleCsvImport', count: 0 });
      return;
    }
    const finalResult = this.domain.research.processAllData(state.data.household.members, localImportResult.transactions, state.data.setup);
    this.dispatchImportData(finalResult.local.finance);
    this.recomputeBusinessState();
    this.logImportCompletion(finalResult);
  }

  private dispatchImportData(financeData: MasterProcessResult['local']['finance']): void {
    this.fso.dispatch({ type: 'UPDATE_DATA', payload: { [DATA_KEYS.FINANCE]: { income: { items: financeData.transactions.filter(tx => tx.amount > 0) }, expenses: { items: financeData.transactions.filter(tx => tx.amount < 0) }, hasMissingCosts: financeData.hasMissingCosts } } });
  }

  private logImportCompletion(result: MasterProcessResult): void {
    const count = result.local.finance.transactions.length;
    logger.info('csv_import_success', { orchestrator: 'master', action: 'handleCsvImport', count });
    if (result.local.finance.summary.isDiscrepancy === true) logger.warn('csv_import_discrepancy_found', { orchestrator: 'master', action: 'handleCsvImport', details: result.local.finance.summary });
  }

  public saveDailyTransaction(): boolean {
    const state = this.fso.getState();
    const tx = state.data.latestTransaction;
    if (tx === null || tx === undefined) { logger.warn('transaction_form_not_initialized', { orchestrator: 'master', action: 'saveDailyTransaction' }); return false; }
    if (tx.latestTransactionAmount === undefined || tx.latestTransactionAmount <= 0) { logger.warn('transaction_invalid_amount', { orchestrator: 'master', action: 'saveDailyTransaction', amount: tx.latestTransactionAmount }); return false; }
    if (tx.latestTransactionCategory === null || tx.latestTransactionCategory === undefined || tx.latestTransactionCategory === '') { logger.warn('transaction_category_required', { orchestrator: 'master', action: 'saveDailyTransaction' }); return false; }
    const category = tx.latestTransactionCategory as string;
    const expenseItem = this.buildExpenseItemForTransaction(tx, category);
    this.persistTransactionAndReset(expenseItem);
    this.recomputeBusinessState();
    logger.info('transaction_saved', { orchestrator: 'master', action: 'saveDailyTransaction', fieldId: expenseItem.fieldId });
    return true;
  }

  private buildExpenseItemForTransaction(tx: NonNullable<Exclude<ReturnType<typeof this.fso.getState>['data']['latestTransaction'], null | undefined>>, category: string): ExpenseItem {
    return { fieldId: `expense_${Date.now()}`, amount: tx.latestTransactionAmount ?? 0, category, description: tx.latestTransactionDescription ?? '', paymentMethod: tx.latestPaymentMethod ?? 'pin', date: tx.latestTransactionDate ?? new Date().toISOString().split('T')[0] } as ExpenseItem;
  }

  private persistTransactionAndReset(expenseItem: ExpenseItem): void {
    const state = this.fso.getState();
    const currentExpenses: ExpenseItem[] = state.data.finance.expenses.items ?? [];
    const updatedExpenses = [...currentExpenses, expenseItem];
    const financeData = { income: state.data.finance.income, expenses: { ...state.data.finance.expenses, items: updatedExpenses } };
    const summary = computePhoenixSummary(financeData);
    this.fso.dispatch({ type: 'UPDATE_DATA', payload: { finance: { ...state.data.finance, expenses: { ...state.data.finance.expenses, items: updatedExpenses, totalAmount: summary.totalExpensesCents } }, latestTransaction: { latestTransactionDate: new Date().toISOString().split('T')[0], latestTransactionAmount: 0, latestTransactionCategory: null, latestTransactionDescription: '', latestPaymentMethod: 'pin' } } });
  }

  private validateSection(sectionId: string): SectionValidationResult {
    const state = this.fso.getState();
    return this.domain.validation.validateSection(sectionId, state.data);
  }

  private recomputeBusinessState(): void {
    const summary = this.domain.business.prepareFinancialViewModel(this.fso.getState());
    this.fso.dispatch({ type: 'UPDATE_VIEWMODEL', payload: { financialSummary: summary } });
  }
}
