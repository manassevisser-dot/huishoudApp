// src/app/orchestrators/interfaces/IUIOrchestrator.ts

import { ComponentViewModel as ConcreteComponentViewModel } from '@domain/registry/ComponentRegistry';

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

/**
 * We gebruiken nu het sterke type uit de Registry. 
 * Dit type bevat de ComponentStyleRule (onze domein-stijl-regels).
 */
export type ComponentViewModel = ConcreteComponentViewModel;

/**
 * Contract voor de UI-cluster (Render → Visibility → Component).
 * UIManager implementeert dit contract.
 */
export interface IUIOrchestrator {
  isVisible(ruleName: string, memberId?: string): boolean;

  buildFieldViewModel(
    fieldId: string,
    context?: { memberId?: string },
  ): FieldViewModel | null;

  buildFieldViewModels(
    fieldIds: string[],
    context?: { memberId?: string },
  ): FieldViewModel[];

  buildPageViewModel(
    pageConfig: {
      pageId: string;
      titleToken: string;
      fields: Array<{ fieldId: string }>;
    },
    context?: { memberId?: string },
  ): PageViewModel;

  /**
   * Volledige pipeline t/m Component-VM’s.
   * Levert nu gegarandeerd ViewModels met domein-gestuurde styling.
   */
  buildPageComponentViewModels(
    fieldIds: string[],
    context?: { memberId?: string },
  ): ComponentViewModel[];
}