// src/app/orchestrators/MasterOrchestrator.ts
/**
 * @file_intent De centrale façade voor alle applicatie-acties. Geen eigen logica — puur delegatie.
 * @repo_architecture Mobile Industry (MI) - Facade Layer.
 * @term_definition Façade = Een dunne orkestrator die publieke API-methoden doorleidt naar
 *   gespecialiseerde orchestrators. Bevat geen eigen businesslogica of mapping.
 * @contract
 *   - Publieke API (MasterOrchestratorAPI) is ongewijzigd — geen breaking changes voor consumers.
 *   - RenderScreenVM types worden re-geëxporteerd voor backward compatibility (MasterOrchestratorAPI.ts).
 *   - useStableOrchestrator constructor-signatuur blijft (fso, DomainCluster, AppCluster).
 * @ai_instruction
 *   Voeg GEEN logica toe aan deze klasse. Als een methode meer doet dan delegeren, is het verkeerd.
 *   BusinessManager.recompute() vervangt recomputeBusinessState() — die methode bestaat niet meer.
 *   ValidationOrchestrator.updateAndValidate() vervangt de updateField-logica.
 *   UIOrchestrator.buildRenderScreen() vervangt de mapping-logica.
 *   DataManager.executeImportWorkflow() vervangt handleCsvImport-logica.
 *   DailyTransactionWorkflow.execute() vervangt saveDailyTransaction-logica.
 * @changes [Fase 7] Alle private helpers verwijderd. Master bevat alleen constructor + delegaties.
 *   Verwijderd: recomputeBusinessState, toRenderScreen/Section/Entry, evaluateVisibility,
 *     validateSection, buildExpenseItemForTransaction, persistTransactionAndReset,
 *     dispatchImportData, logImportCompletion.
 *   Verwijderd: ACL TODO (opgelost, zie OPEN_EINDJES.md).
 *
 * ⚠️ OPMERKING VOOR useStableOrchestrator.ts (KLEINE AANPASSING VEREIST):
 *   - `ui = new UIManager()` → `ui = new UIOrchestrator(visibility)`
 *   - UIOrchestrator heeft visibility nodig via constructor (zie UIOrchestrator_new.ts)
 *   - Alle andere assemblagecode blijft ongewijzigd.
 */

// ─── Type imports ────────────────────────────────────────────────────
import type { FormStateOrchestrator } from './FormStateOrchestrator';
import type { IBusinessOrchestrator } from './interfaces/IBusinessOrchestrator';
import type { IValidationOrchestrator } from './interfaces/IValidationOrchestrator';
import type { INavigationOrchestrator } from './interfaces/INavigationOrchestrator';
import type { IThemeOrchestrator } from './interfaces/IThemeOrchestrator';
import type { MasterOrchestratorAPI } from '@app/types/MasterOrchestratorAPI';
import type { IValueOrchestrator } from './interfaces/IValueOrchestrator';
import type { ResearchOrchestrator } from '@app/orchestrators/ResearchOrchestrator';
import type { DataManager } from './managers/DataManager';
import type { UIOrchestrator } from './UIOrchestrator';  // Nu UIOrchestrator ipv IUIOrchestrator

// ─── Concrete klasse imports (voor workflow-instantiatie) ────────────
import { BusinessManager } from './managers/BusinessManager';
import { ValidationOrchestrator } from './ValidationOrchestrator';
import { DailyTransactionWorkflow } from '@app/workflows/DailyTransactionWorkflow';

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
  }

  // ═══════════════════════════════════════════════════════════════
  // DELEGATIES — geen eigen logica
  // ═══════════════════════════════════════════════════════════════

  /** Delegeert naar UIOrchestrator.buildRenderScreen() [Fase 4] */
  public buildRenderScreen(screenId: string) {
    return this.app.ui.buildRenderScreen(
      screenId,
      this.fso,
      (fieldId, value) => this.updateField(fieldId, value),
    );
  }

  /** Delegeert naar UIOrchestrator.isVisible() → VisibilityOrchestrator */
  public isVisible(ruleName: string, memberId?: string): boolean {
    return this.app.ui.isVisible(ruleName, memberId);
  }

  /** Delegeert naar ValidationOrchestrator.updateAndValidate() [Fase 3] */
  public updateField(fieldId: string, value: unknown): void {
    this.validationOrch.updateAndValidate(fieldId, value, this.fso, this.businessManager);
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

  /** Delegeert naar DataManager.executeImportWorkflow() [Fase 5] */
  public async handleCsvImport(csvText: string): Promise<void> {
    await this.domain.data.executeImportWorkflow(
      csvText,
      this.fso,
      this.domain.research,
      this.businessManager,
    );
  }

  /** Delegeert naar DailyTransactionWorkflow.execute() [Fase 6] */
  public saveDailyTransaction(): boolean {
    return this.dailyWorkflow.execute(this.fso, this.businessManager);
  }
}
