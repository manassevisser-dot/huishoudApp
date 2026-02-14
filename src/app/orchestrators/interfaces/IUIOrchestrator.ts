// src/app/orchestrators/interfaces/IUIOrchestrator.ts

import { ComponentType, ComponentViewModel } from '@domain/registry/ComponentRegistry';

export type PageConfig = {
  pageId: string;
  titleToken: string;
  fields: Array<{ fieldId: string }>;
};

export interface FieldViewModel {
  fieldId: string;
  componentType: ComponentType;
  labelToken: string;
  placeholderToken?: string;
  value: unknown;
  options?: readonly string[];
  error?: string | null;
  uiModel?: string;
  visibilityRuleName?: string;
}

export interface PageViewModel {
  pageId: string;
  titleToken: string;
  fields: FieldViewModel[];
}

export interface IUIOrchestrator {
  buildFieldViewModel(fieldId: string): FieldViewModel | null;
  buildPageViewModel(pageConfig: PageConfig): PageViewModel; 
  buildPageComponentViewModels(fieldIds: string[]): ComponentViewModel[];
}