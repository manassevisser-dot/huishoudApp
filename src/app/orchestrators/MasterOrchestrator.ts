// src/app/orchestrators/MasterOrchestrator.ts
/**
 * Centrale façade die alle applicatie-acties delegeert naar gespecialiseerde orchestrators.
 *
 * @module app/orchestrators
 * @see {@link ./README.md | MasterOrchestrator — Details}
 *
 * @remarks
 * Bevat geen eigen businesslogica — elke methode delegeert naar een sub-orchestrator of workflow.
 * Publieke API is vastgelegd in `MasterOrchestratorAPI`.
 */

// ─── Type imports ────────────────────────────────────────────────────
import type { FormStateOrchestrator } from './FormStateOrchestrator';
import type { IBusinessOrchestrator } from './interfaces/IBusinessOrchestrator';
import type { IValidationOrchestrator } from './interfaces/IValidationOrchestrator';
import type { INavigationOrchestrator } from './interfaces/INavigationOrchestrator';
import type { IThemeOrchestrator } from './interfaces/IThemeOrchestrator';
import type { MasterOrchestratorAPI, CsvUploadParams } from '@app/types/MasterOrchestratorAPI';
import type { IValueOrchestrator } from './interfaces/IValueOrchestrator';
import type { ResearchOrchestrator } from '@app/orchestrators/ResearchOrchestrator';
import type { DataManager } from './managers/DataManager';
import type { UIOrchestrator } from './UIOrchestrator';  // Nu UIOrchestrator ipv IUIOrchestrator

// ─── Concrete klasse imports (voor workflow-instantiatie) ────────────
import { BusinessManager } from './managers/BusinessManager';
import { ValidationOrchestrator } from './ValidationOrchestrator';
import { DailyTransactionWorkflow } from '@app/workflows/DailyTransactionWorkflow';
import { SettingsWorkflow } from '@app/workflows/SettingsWorkflow';
import { ResetWorkflow } from '@app/workflows/ResetWorkflow';
import type { MappingContext } from './UIOrchestrator';
// ─── Re-export types voor backward compatibility ──────────────────────
// MasterOrchestratorAPI.ts importeert RenderScreenVM vanuit MasterOrchestrator.
// Door re-export blijft die import werken zonder aanpassing.
export type { RenderScreenVM, RenderSectionVM, RenderEntryVM } from './types/render.types';

// ─── Cluster types (ongewijzigd t.o.v. origineel) ────────────────────

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
  ui: UIOrchestrator;           // Was IUIOrchestrator — nu UIOrchestrator voor buildRenderScreen()
  navigation: INavigationOrchestrator;
  theme: IThemeOrchestrator;
};

// ═══════════════════════════════════════════════════════════════════
// MASTER ORCHESTRATOR — PURE FAÇADE
// ═══════════════════════════════════════════════════════════════════

export class MasterOrchestrator implements MasterOrchestratorAPI {
  // ─── Publieke properties (ongewijzigd) ───────────────────────────
  public readonly theme: IThemeOrchestrator;
  public readonly navigation: INavigationOrchestrator;
  public readonly ui: UIOrchestrator;

  // ─── Interne workflow-instanties ─────────────────────────────────
  private readonly businessManager: BusinessManager;
  private readonly validationOrch: ValidationOrchestrator;
  private readonly dailyWorkflow: DailyTransactionWorkflow;
  private readonly settingsWorkflow: SettingsWorkflow;
  private readonly resetWorkflow: ResetWorkflow;

  constructor(
    private readonly fso: FormStateOrchestrator,
    private readonly domain: DomainCluster,
    private readonly app: AppCluster,
  ) {
    this.theme = this.app.theme;
    this.navigation = this.app.navigation;
    this.ui = this.app.ui;

    // Concretiseer de orchestrators die we als typed-instantie nodig hebben
    // (voor methoden die niet op de interface staan, zoals recompute en updateAndValidate)
    this.businessManager = this.domain.business as BusinessManager;
    this.validationOrch = this.domain.validation as ValidationOrchestrator;
    this.dailyWorkflow = new DailyTransactionWorkflow();
    this.settingsWorkflow = new SettingsWorkflow();
    this.resetWorkflow = new ResetWorkflow();
  }

  // ═══════════════════════════════════════════════════════════════
  // DELEGATIES — geen eigen logica
  // ═══════════════════════════════════════════════════════════════

  /** Delegeert naar UIOrchestrator.buildRenderScreen() [Fase 4] */
  public buildRenderScreen(screenId: string) {
    const context: MappingContext = {
      fso: this.fso,
      onFieldChange: (fieldId, value) => { this.updateField(fieldId, value); },
      onNavigate: (target) => { this.navigateTo(target); },
      onCommand: (command) => { this.dispatchCommand(command); },
      valueResolvers: {
        // 'theme' leeft in ThemeManager, niet in FormState — synchrone getter
        theme: () => this.theme.getTheme() === 'dark',
      },
    };
    return this.app.ui.buildRenderScreen(screenId, context);
  }

  /**
   * Vertaalt een scherm-ID (navigationTarget uit EntryRegistry) naar de juiste
   * navigatiemethode. Centrale plek — voeg nieuwe schermen hier toe.
   */
  /**
   * Dispatcht een reducer-command vanuit een ACTION-entry met commandTarget.
   * Gescheiden van navigateTo: reducer-acties muteren state, navigatie muteert scherm.
   */
  private dispatchCommand(command: string): void {
    switch (command) {
      case 'UNDO':      this.fso.dispatch({ type: 'UNDO_TRANSACTION' });  break;
      case 'REDO':      this.fso.dispatch({ type: 'REDO_TRANSACTION' });  break;
      case 'CLEAR_ALL': this.fso.dispatch({ type: 'CLEAR_TRANSACTIONS' }); break;
      default: break; // fail-silent voor onbekende commands
    }
  }

  private navigateTo(target: string): void {
    switch (target) {
      case 'WIZARD':     this.app.navigation.startWizard();   break; // LandingScreen → WIZARD_SETUP_HOUSEHOLD
      case 'DASHBOARD':  this.app.navigation.goToDashboard(); break;
      case 'SETTINGS':   this.app.navigation.goToSettings();  break;
      case 'CSV_UPLOAD': this.app.navigation.goToCsvUpload(); break;
      case 'RESET':      this.app.navigation.goToReset();     break;
      case 'OPTIONS':    this.app.navigation.goToOptions();   break;
      case 'UNDO':       this.app.navigation.goToUndo();      break;
      default: break; // onbekende target: fail-silent
    }
  }

  /** Delegeert naar UIOrchestrator.isVisible() → VisibilityOrchestrator */
  public isVisible(ruleName: string, memberId?: string): boolean {
    return this.app.ui.isVisible(ruleName, memberId);
  }

  /** Delegeert naar ValidationOrchestrator.updateAndValidate() [Fase 3]
   *  Intercepteert settings-velden (bijv. 'theme') vóór de validatiepipeline.
   */
  public updateField(fieldId: string, value: unknown): void {
    if (fieldId === 'theme') {
      // Settings-pad: geen FormState-mutatie, geen validatie — SettingsWorkflow handelt af
      this.settingsWorkflow.execute(fieldId, value, this.theme);
      return;
    }
    this.validationOrch.updateAndValidate(fieldId, value);
  }

  /** Delegeert naar NavigationOrchestrator */
  public onNavigateBack(): void {
    this.app.navigation.navigateBack();
  }

  /** Delegeert naar NavigationOrchestrator */
  public onNavigateNext(): void {
    this.app.navigation.navigateNext();
  }

  /**
   * Delegeert naar NavigationOrchestrator.canNavigateNext().
   * ⚠️ Bewakingsregel: canNavigateNext() is AUTORITEIT in NavigationOrchestrator — niet opnieuw implementeren.
   * De sectionId-parameter uit de originele MasterOrchestrator wordt genegeerd;
   * NavigationOrchestrator bepaalt zelf het huidige scherm via FSO.
   */
  public canNavigateNext(_sectionId: string): boolean {
    return this.app.navigation.canNavigateNext();
  }

  /** Delegeert naar DataManager.executeImportWorkflow() [Fase 3+8] */
  public async handleCsvImport(params: CsvUploadParams): Promise<void> {
    await this.domain.data.executeImportWorkflow(
      params,
      { fso: this.fso, research: this.domain.research, business: this.businessManager },
    );
  }

  /** Delegeert naar DailyTransactionWorkflow.execute() [Fase 6] */
  public saveDailyTransaction(): boolean {
    return this.dailyWorkflow.execute(this.fso, this.businessManager);
  }

  /** Delegeert naar ResetWorkflow.execute().
   *  Navigatie is impliciet via reducer (activeStep-mutatie) — geen extra navigatieaanroep nodig.
   */
  public executeReset(type: 'full' | 'setup'): void {
    this.resetWorkflow.execute(type, this.fso);
  }
}
