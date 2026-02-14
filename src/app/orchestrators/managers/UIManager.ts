// src/app/orchestrators/UIManager.ts
import { FormStateOrchestrator } from "@app/orchestrators/FormStateOrchestrator";
import {
  VisibilityOrchestrator,
  VisibilityParams,
} from "@app/orchestrators/VisibilityOrchestrator";
import { RenderOrchestrator } from "@app/orchestrators/RenderOrchestrator";
import { ComponentOrchestrator } from "@app/orchestrators/ComponentOrchestrator";

import type {
  IUIOrchestrator,
  FieldViewModel,
  PageViewModel,
  PageConfig,
} from "@app/orchestrators/interfaces/IUIOrchestrator";
import type { ComponentViewModel } from "@domain/registry/ComponentRegistry";

const hasString = (v: unknown): v is string =>
  typeof v === "string" && v.trim().length > 0;

/**
 * UI MANAGER
 * Coördineert de flow: Render -> Visibility -> Component transformatie.
 */
export class UIManager implements IUIOrchestrator {
  private readonly render: RenderOrchestrator;
  private readonly visibility: VisibilityOrchestrator;
  private readonly component?: ComponentOrchestrator;

  constructor(
    fso: FormStateOrchestrator,
    visibility: VisibilityOrchestrator,
    updateField?: (fieldId: string, value: unknown) => void,
  ) {
    this.visibility = visibility;
    this.render = new RenderOrchestrator(fso);

    if (typeof updateField === "function") {
      this.component = new ComponentOrchestrator(updateField);
    }
  }

  public buildFieldViewModel(
    fieldId: string,
    context?: VisibilityParams, // <--- Hersteld: gebruik de import
  ): FieldViewModel | null {
    if (!hasString(fieldId)) return null; // 1. Haal de basis VM op (Render-fase)

    const vm = this.render.buildFieldViewModel(fieldId);
    if (vm === null) return null; // 2. Pas Visibility toe

    if (hasString(vm.visibilityRuleName)) {
      const ok = this.visibility.evaluate(
        vm.visibilityRuleName,
        context?.memberId,
      );
      if (!ok) return null;
    }

    return vm;
  }

  public buildFieldViewModels(
    fieldIds: string[],
    context?: VisibilityParams, // <--- Hersteld: gebruik de import
  ): FieldViewModel[] {
    if (!Array.isArray(fieldIds) || fieldIds.length === 0) return [];
    return fieldIds
      .map((fid) => this.buildFieldViewModel(fid, context))
      .filter((vm): vm is FieldViewModel => vm !== null);
  }

  public buildPageViewModel(
    pageConfig: PageConfig,
    context?: VisibilityParams, // <--- Hersteld: gebruik de import
  ): PageViewModel {
    const ids = Array.isArray(pageConfig.fields)
      ? pageConfig.fields.map((f) => f.fieldId).filter(hasString)
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
    context?: VisibilityParams, // <--- Hersteld: gebruik de import
  ): ComponentViewModel[] {
    if (
      this.component === undefined ||
      !Array.isArray(fieldIds) ||
      fieldIds.length === 0
    )
      return [];

    // Hier komen de draden samen: van Field naar Component
    const fieldVMs = this.buildFieldViewModels(fieldIds, context);

    return fieldVMs
      .map((vm) => this.component!.buildComponentViewModel(vm))
      .filter((cvm): cvm is ComponentViewModel => cvm !== null);
  }
}
