// src/app/orchestrators/UIOrchestrator.ts
/**
 * @file_intent Implementeert de IUIOrchestrator interface en coördineert de volledige UI-bouwlogica,
 *   inclusief de transformatie van StyledScreenVM naar render-ready RenderScreenVM.
 * @repo_architecture Application Layer - Orchestrator.
 * @term_definition
 *   StyledScreenVM = Het tussenmodel na ScreenViewModelFactory + StyleFactory (intern, niet UI-klaar).
 *   RenderScreenVM = Het finale model dat de UI direct kan consumeren (labels resolved, onChange gebonden).
 * @contract
 *   buildScreen()       → geeft StyledScreenVM (ongewijzigd, backward compatible)
 *   buildRenderScreen() → geeft RenderScreenVM (nieuw, vervangt Master.buildRenderScreen)
 *   isVisible()         → delegeert naar VisibilityOrchestrator
 * @ai_instruction De mapping-logica (toRenderScreen/Section/Entry) is verplaatst uit MasterOrchestrator.
 *   MasterOrchestrator roept nu buildRenderScreen() aan en bevat geen eigen mapping-logica meer.
 *   VisibilityOrchestrator wordt via constructor geïnjecteerd.
 *   FormStateOrchestrator wordt als methode-parameter ontvangen (stateless, geen constructor-dep).
 * @changes [Fase 4] Toegevoegd: buildRenderScreen(), isVisible(), private mapping-helpers.
 *   Verplaatst uit MasterOrchestrator: toRenderScreen, toRenderSection, toRenderEntry, evaluateVisibility.
 */

import { UIManager } from './managers/UIManager';
import { IUIOrchestrator } from './interfaces/IUIOrchestrator';
import type { StyledScreenVM, StyledSectionVM, StyledEntryVM } from '@app/orchestrators/factory/StyleFactory';
import type { FormStateOrchestrator } from './FormStateOrchestrator';
import type { VisibilityOrchestrator } from './VisibilityOrchestrator';
import { resolveFieldId, EntryRegistry } from '@domain/registry/EntryRegistry';
import { labelFromToken } from '@domain/constants/labelResolver';
import type { RenderScreenVM, RenderSectionVM, RenderEntryVM } from './types/render.types';

export class UIOrchestrator implements IUIOrchestrator {
  private readonly uiManager: UIManager;

  /**
   * @param visibility - Geïnjecteerd voor isVisible() en evaluateVisibility() in mapping.
   *   useStableOrchestrator maakt UIOrchestrator aan met de bestaande VisibilityOrchestrator instantie.
   *   ⚠️ Wijziging in useStableOrchestrator: vervang `new UIManager()` door
   *     `new UIOrchestrator(visibility)` zodat de rendering visibility-aware wordt.
   */
  constructor(private readonly visibility: VisibilityOrchestrator) {
    this.uiManager = new UIManager();
  }

  // ─── Bestaande methode (ongewijzigd, backward compatible) ────────

  public buildScreen(screenId: string): StyledScreenVM {
    return this.uiManager.buildScreen(screenId);
  }

  // ─── Nieuw: render-ready screen [Fase 4] ─────────────────────────

  /**
   * Bouwt een volledig render-klaar scherm.
   * Vervangt MasterOrchestrator.buildRenderScreen() volledig.
   *
   * @param screenId - Het te bouwen scherm.
   * @param fso - Doorgegeven als param voor getValue(); houdt UIOrchestrator stateless.
   * @param onFieldChange - Callback naar ValidationOrchestrator.updateAndValidate().
   *   Wordt gebonden als onChange in elke RenderEntryVM. Master geeft zijn eigen
   *   updateField() door als callback zodat er geen circulaire dep ontstaat.
   */
  public buildRenderScreen(
    screenId: string,
    fso: FormStateOrchestrator,
    onFieldChange: (fieldId: string, value: unknown) => void,
  ): RenderScreenVM {
    const styled = this.buildScreen(screenId);
    return this.mapToRenderScreen(styled, fso, onFieldChange);
  }

  // ─── Visibility delegatie [Fase 4] ───────────────────────────────

  public isVisible(ruleName: string, memberId?: string): boolean {
    return this.visibility.evaluate(ruleName, memberId);
  }

  // ─── Private mapping-helpers (verplaatst uit MasterOrchestrator) ─

  private mapToRenderScreen(
    svm: StyledScreenVM,
    fso: FormStateOrchestrator,
    onFieldChange: (fieldId: string, value: unknown) => void,
  ): RenderScreenVM {
    return {
      screenId: svm.screenId,
      title: labelFromToken(svm.titleToken),
      type: svm.type,
      style: svm.style,
      navigation: svm.navigation,
      sections: svm.sections.map((s) => this.mapToRenderSection(s, fso, onFieldChange)),
    };
  }

  private mapToRenderSection(
    section: StyledSectionVM,
    fso: FormStateOrchestrator,
    onFieldChange: (fieldId: string, value: unknown) => void,
  ): RenderSectionVM {
    return {
      sectionId: section.sectionId,
      title: labelFromToken(section.titleToken),
      layout: section.layout,
      uiModel: section.uiModel,
      style: section.style,
      children: section.children.map((e) => this.mapToRenderEntry(e, fso, onFieldChange)),
    };
  }

  private mapToRenderEntry(
    entry: StyledEntryVM,
    fso: FormStateOrchestrator,
    onFieldChange: (fieldId: string, value: unknown) => void,
  ): RenderEntryVM {
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
      value: isVisible ? fso.getValue(fieldId) : undefined,
      isVisible,
      options: entry.options,
      optionsKey: entry.optionsKey,
      style: entry.style,
      childStyle: entry.child.style,
      onChange: (newValue: unknown) => {
        onFieldChange(fieldId, newValue);
      },
    };
  }

  /**
   * Evalueert zichtbaarheid via de geïnjecteerde VisibilityOrchestrator.
   * Lege of ontbrekende ruleName = standaard zichtbaar (fail-open voor rendering).
   */
  private evaluateVisibility(ruleName?: string): boolean {
    if (ruleName === undefined || ruleName === '') {
      return true;
    }
    return this.visibility.evaluate(ruleName);
  }
}
