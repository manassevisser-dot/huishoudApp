// src/app/orchestrators/RenderOrchestrator.ts
/**
 * @file_intent Transformeert statische definities en actuele state naar FieldViewModels.
 * @repo_architecture Mobile Industry (MI) - Presentation Logic Layer.
 * @term_definition OptionsKey = De referentie naar een set keuzemogelijkheden in de OptionsRegistry.
 * @contract Stateless (behalve de injectie van FSO). Koppelt fieldIds aan data en keuzelijsten.
 * @ai_instruction Dit is de 'halffabrikaat-fase'. Het spuugt FieldViewModels uit die nog GEEN visuele stijlen bevatten; dat gebeurt pas in de PrimitiveOrchestrator.
 */

import { FormStateOrchestrator } from './FormStateOrchestrator';
import {
  GENERAL_OPTIONS,
  HOUSEHOLD_OPTIONS,
  FINANCE_OPTIONS,
} from '@domain/registry/OptionsRegistry';
import { EntryRegistry } from '@domain/registry/EntryRegistry';
import { PrimitiveType } from '@domain/registry/PrimitiveRegistry';
import type { FieldViewModel } from './interfaces/IUIOrchestrator';

/**
 * RENDER ORCHESTRATOR
 * Taak: ruwe field-defs + actuele state -> FieldViewModel (Veld-fase).
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

// Optioneel: lokaal type voor screen/sectie VM (niet de globale ScreenViewModel!)
export type ScreenViewModel = {
  screenId: string;
  titleToken: string;
  fields: FieldViewModel[];
};

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

    const definition = EntryRegistry.getDefinition(fieldId);
    if (definition == null) {
      console.warn(`[RenderOrchestrator] unknown fieldId: ${fieldId}`);
      return null;
    }

    // Waarde ophalen uit de centrale staat
    const value = this.fso.getValue(fieldId);

    // Opties resolven indien nodig
    const options =
  definition.optionsKey !== undefined ? this.getOptions(definition.optionsKey) : undefined;

    /**
     * De FieldViewModel (Veld-fase)
     * Hier vindt de eerste koppeling tussen Registry en State plaats.
     * (Let op: we geven tokens door, resolven van labels kan hoger in de UI.)
     */
    const vm: FieldViewModel = {
      fieldId,
      primitiveType: definition.primitiveType as PrimitiveType,
      labelToken: definition.labelToken,
      placeholderToken: definition.placeholderToken,
      value,
      visibilityRuleName: definition.visibilityRuleName,
      options,
    
      error: null, // later verrijkt door Validation/UI flow
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
   * Bouwt een Screen/Section-achtig model (NIET de globale ScreenViewModel uit UI-manager).
   * Handig voor legacy/small screens.
   */
  public buildScreenViewModel(screenConfig: {
    screenId: string;
    titleToken: string;
    fields: Array<{ fieldId: string }>;
  }): ScreenViewModel {
    const ids: string[] = Array.isArray(screenConfig?.fields)
      ? screenConfig.fields
          .map((f) => (isNonEmptyString(f?.fieldId) ? f.fieldId.trim() : ''))
          .filter(isNonEmptyString)
      : [];

    const entryVMs = this.buildFieldViewModels(ids);

    return {
      screenId: screenConfig.screenId,
      titleToken: screenConfig.titleToken,
      fields: entryVMs,
    };
  }

  /**
   * Private helper om opties uit de registry te vissen.
   */
  private getOptions(optionsKey: string): readonly string[] {
    const key = isNonEmptyString(optionsKey) ? optionsKey : '';
    if (key.length === 0) return [];

    const set = (ALL_OPTIONS as AllOptionsMap)[key];
    if (set == null) {
      console.warn(`[RenderOrchestrator] unknown optionsKey "${key}"`);
      return [];
    }
    return set;
  }
}