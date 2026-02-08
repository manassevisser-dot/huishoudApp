// src/app/orchestrators/UIManager.ts
import { FormStateOrchestrator } from '@app/orchestrators/FormStateOrchestrator';
import { VisibilityOrchestrator } from '@app/orchestrators/VisibilityOrchestrator';
import { RenderOrchestrator } from '@app/orchestrators/RenderOrchestrator';
import { ComponentOrchestrator } from '@app/orchestrators/ComponentOrchestrator';

import type {
  IUIOrchestrator,
  FieldViewModel,
  PageViewModel,
  ComponentViewModel,
} from '@app/orchestrators/interfaces/IUIOrchestrator';

const hasString = (v: unknown): v is string => typeof v === 'string' && v.trim().length > 0;

/**
 * ═══════════════════════════════════════════════════════════
 * UI MANAGER
 * ═══════════════════════════════════════════════════════════
 * Verantwoordelijk voor de coördinatie tussen zichtbaarheid,
 * rendering en component-opbouw.
 * * Geen stijlen meer in de constructor: de ComponentOrchestrator
 * regelt dit nu zelf via de domein-factories.
 */
export class UIManager implements IUIOrchestrator {
  private readonly render: RenderOrchestrator;
  private readonly visibility: VisibilityOrchestrator;
  private readonly component?: ComponentOrchestrator;

  constructor(
    fso: FormStateOrchestrator,
    visibility: VisibilityOrchestrator,
    updateField?: (fieldId: string, value: unknown) => void,
    // styles is hier definitief verwijderd
  ) {
    this.visibility = visibility;
    this.render = new RenderOrchestrator(fso);
    
    if (updateField !== null && updateField !== undefined) {
      // De ComponentOrchestrator krijgt alleen nog de callback
      this.component = new ComponentOrchestrator(updateField);
    }
  }

  public isVisible(ruleName: string, memberId?: string): boolean {
    return this.visibility.evaluate(ruleName, memberId);
  }

  public buildFieldViewModel(
    fieldId: string,
    context?: { memberId?: string },
  ): FieldViewModel | null {
    if (!hasString(fieldId)) return null;

    const vm = this.render.buildFieldViewModel(fieldId);
    if (vm === null || vm === undefined) return null;

    if (hasString(vm.visibilityRuleName)) {
      const ok = this.visibility.evaluate(vm.visibilityRuleName, context?.memberId);
      if (!ok) return null;
    }

    return vm;
  }

  public buildFieldViewModels(
    fieldIds: string[],
    context?: { memberId?: string },
  ): FieldViewModel[] {
    if (!Array.isArray(fieldIds) || fieldIds.length === 0) return [];
    return fieldIds
      .map(fid => this.buildFieldViewModel(fid, context))
      .filter((vm): vm is FieldViewModel => vm !== null);
  }

  public buildPageViewModel(
    pageConfig: {
      pageId: string;
      titleToken: string;
      fields: Array<{ fieldId: string }>;
    },
    context?: { memberId?: string },
  ): PageViewModel {
    const ids = Array.isArray(pageConfig.fields)
      ? pageConfig.fields.map(f => f.fieldId).filter(hasString)
      : [];
    const fields = this.buildFieldViewModels(ids, context);
    return {
      pageId: pageConfig.pageId,
      titleToken: pageConfig.titleToken,
      fields,
    };
  }

  public buildPageComponentViewModels(
    fieldIds: string[],
    context?: { memberId?: string },
  ): ComponentViewModel[] {
    if (this.component === null || this.component === undefined) return [];
    if (!Array.isArray(fieldIds) || fieldIds.length === 0) return [];

    const fieldVMs = this.buildFieldViewModels(fieldIds, context);
    
    return fieldVMs
      .map(vm => this.component!.buildComponentViewModel(vm))
      // ComponentViewModel komt nu uit de Registry en bevat de domein-stijlen
      .filter((cvm): cvm is ComponentViewModel => cvm != null);
  }
}

export default UIManager;