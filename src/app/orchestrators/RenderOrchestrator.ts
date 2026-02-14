// src/app/orchestrators/RenderOrchestrator.ts

import { FormStateOrchestrator } from './FormStateOrchestrator';
import {
  GENERAL_OPTIONS,
  HOUSEHOLD_OPTIONS,
  FINANCE_OPTIONS,
} from '@domain/registry/options';
import { getFieldDefinition } from '@domain/registry/FieldRegistry';
import { ComponentType } from '@domain/registry/ComponentRegistry';
import { FieldViewModel, PageViewModel } from './interfaces/IUIOrchestrator';

/**
 * RENDER ORCHESTRATOR
 * * Taak: Het verzamelen van ruwe veldgegevens (identiteit, tokens, waarde, opties)
 * naar een FieldViewModel (Veld-fase).
 */

// SSOT options — gecombineerd uit domein registries
const ALL_OPTIONS = {
  ...GENERAL_OPTIONS,
  ...HOUSEHOLD_OPTIONS,
  ...FINANCE_OPTIONS,
} as const;

type AllOptionsMap = Record<string, readonly string[] | undefined>;

// Type-guard voor string checks
const isNonEmptyString = (v: unknown): v is string =>
  typeof v === 'string' && v.trim().length > 0;

export class RenderOrchestrator {
  constructor(private readonly fso: FormStateOrchestrator) {}

  /**
   * Bouw een FieldViewModel voor één veld.
   * Combineert de statische definitie met de actuele staat uit FSO.
   */
  public buildFieldViewModel(fieldId: string): FieldViewModel | null {
    if (!isNonEmptyString(fieldId)) {
      console.warn('[RenderOrchestrator] Empty fieldId.');
      return null;
    }

    const definition = getFieldDefinition(fieldId);
    if (definition === null) {
      console.warn(`[RenderOrchestrator] unknown fieldId: ${fieldId}`);
      return null;
    }

    // Waarde ophalen uit de centrale staat
    const value = this.fso.getValue(fieldId);

    // Opties resolven indien nodig
    let options: readonly string[] | undefined;
    if (isNonEmptyString(definition.optionsKey)) {
      options = this.getOptions(definition.optionsKey);
    }

    /**
     * De FieldViewModel (Veld-fase)
     * Hier vindt de eerste koppeling tussen Registry en State plaats.
     */
    const vm: FieldViewModel = {
      fieldId,
      componentType: definition.componentType as ComponentType,
      labelToken: definition.labelToken,
      placeholderToken: definition.placeholderToken,
      value,
      visibilityRuleName: definition.visibilityRuleName,
      options,
      uiModel: definition.uiModel,
      error: null, // Wordt later verrijkt door de Validation/UI flow
    };

    return vm;
  }

  /**
   * Bouwt meerdere VM's voor een collectie IDs.
   */
  public buildFieldViewModels(fieldIds: string[]): FieldViewModel[] {
    if (!Array.isArray(fieldIds) || fieldIds.length === 0) return [];
    return fieldIds
      .map((fid) => this.buildFieldViewModel(fid))
      .filter((vm): vm is FieldViewModel => vm !== null);
  }

  /**
   * Bouwt een PageViewModel voor een complete sectie/pagina.
   */
  public buildPageViewModel(pageConfig: {
    pageId: string;
    titleToken: string;
    fields: Array<{ fieldId: string }>;
  }): PageViewModel {
    const ids: string[] = Array.isArray(pageConfig?.fields)
      ? pageConfig.fields
          .map((f) => (isNonEmptyString(f?.fieldId) ? f.fieldId.trim() : ''))
          .filter(isNonEmptyString)
      : [];

    const fieldVMs = this.buildFieldViewModels(ids);

    return {
      pageId: pageConfig.pageId,
      titleToken: pageConfig.titleToken,
      fields: fieldVMs,
    };
  }

  /**
   * Private helper om opties uit de registry te vissen.
   */
  private getOptions(optionsKey: string): readonly string[] {
    const key = isNonEmptyString(optionsKey) ? optionsKey : '';
    if (key.length === 0) return [];

    const set = (ALL_OPTIONS as AllOptionsMap)[key];
    if (set === null || set === undefined) {
      console.warn(`[RenderOrchestrator] unknown optionsKey "${key}"`);
      return [];
    }
    return set;
  }
}