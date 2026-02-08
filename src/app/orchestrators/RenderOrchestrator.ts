// src/app/orchestrators/RenderOrchestrator.ts

import { FormStateOrchestrator } from './FormStateOrchestrator';
import {
  GENERAL_OPTIONS,
  HOUSEHOLD_OPTIONS,
  FINANCE_OPTIONS,
} from '@domain/registry/options';
import { getFieldDefinition } from '@domain/registry/FieldRegistry';

// ───────────────────────────────────────────────────────────────
// Lokale VM-types (vervang door jouw centrale types wanneer beschikbaar)
export interface FieldViewModel {
  fieldId: string;
  componentType: string;
  labelToken: string;
  placeholderToken?: string;
  value: unknown;
  visibilityRuleName?: string;
  options?: readonly string[];
  error?: string | null;
  uiModel?: string;
}

export interface PageViewModel {
  pageId: string;
  titleToken: string;
  fields: FieldViewModel[];
}
// ───────────────────────────────────────────────────────────────

// SSOT options — module-scope (NIET in de class)
const ALL_OPTIONS = {
  ...GENERAL_OPTIONS,
  ...HOUSEHOLD_OPTIONS,
  ...FINANCE_OPTIONS,
} as const;

type AllOptionsMap = Record<string, readonly string[] | undefined>;

// Kleine guards (vriendelijk voor @typescript-eslint/strict-boolean-expressions)
const isNonEmptyString = (v: unknown): v is string =>
  typeof v === 'string' && v.trim().length > 0;

/**
 * RenderOrchestrator
 *
 * - Bouwt FieldViewModels uit field configs + actuele state
 * - Leest opties uit de centrale registry (options.ts)
 * - Evalueert GEEN visibility; geeft alleen visibilityRuleName door
 */
export class RenderOrchestrator {
  constructor(private readonly fso: FormStateOrchestrator) {}

  /**
   * Bouw een FieldViewModel voor één veld.
   * @returns FieldViewModel of null (onbekend veld of ontbrekende def.)
   */
  public buildFieldViewModel(fieldId: string): FieldViewModel | null {
    if (!isNonEmptyString(fieldId)) {
      console.warn('[RenderOrchestrator] Empty fieldId.');
      return null;
    }

    const definition = getFieldDefinition(fieldId);
    if (definition === null) {
      console.warn(`[RenderOrchestrator] Unknown fieldId: ${fieldId}`);
      return null;
    }

    const value = this.fso.getValue(fieldId); // unknown is ok; UI/field formatteert

    let options: readonly string[] | undefined;
    if (isNonEmptyString(definition.optionsKey)) {
      options = this.getOptions(definition.optionsKey);
    }

    const vm: FieldViewModel = {
      fieldId,
      componentType: String(definition.componentType),
      labelToken: definition.labelToken,
      placeholderToken: definition.placeholderToken,
      value,
      visibilityRuleName: definition.visibilityRuleName,
      options,
      uiModel: definition.uiModel,
    };

    return vm;
  }

  /**
   * Bouw meerdere VM's uit een rij fieldIds.
   */
  public buildFieldViewModels(fieldIds: string[]): FieldViewModel[] {
    if (!Array.isArray(fieldIds) || fieldIds.length === 0) return [];
    return fieldIds
      .map((fid) => this.buildFieldViewModel(fid))
      .filter((vm): vm is FieldViewModel => vm !== null);
  }

  /**
   * Bouw een PageViewModel uit pageConfig.
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

  // ─────────────────────────────────────────────────────────────
  // Options uit SSOT
  // ─────────────────────────────────────────────────────────────
  private getOptions(optionsKey: string): readonly string[] {
    const key = isNonEmptyString(optionsKey) ? optionsKey : '';
    if (key.length === 0) {
      console.warn('[RenderOrchestrator] Empty optionsKey -> returning [].');
      return [];
    }

    const set = (ALL_OPTIONS as AllOptionsMap)[key];
    if (set === null || set === undefined) {
      console.warn(`[RenderOrchestrator] Unknown optionsKey "${key}" -> returning [].`);
      return [];
    }
    return set;
  }
}