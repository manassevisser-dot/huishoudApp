import { SectionViewModel } from '@app/orchestrators/SectionOrchestrator';
import { PrimitiveType } from '@domain/registry/PrimitiveRegistry';

export interface FieldViewModel {
  fieldId: string;
  primitiveType: PrimitiveType;
  labelToken: string;
  placeholderToken?: string;
  value: unknown;
  options?: readonly string[];
  error?: string | null;
  uiModel?: string;
  visibilityRuleName?: string;
}

export interface ScreenViewModel {
  screenId: string;
  title: string;
  type: string;
  sections: SectionViewModel[];
  navigation: {
    next?: string;
    previous?: string;
  };
}

export interface IUIOrchestrator {
  buildScreen(screenId: string): ScreenViewModel | null;
  buildFieldViewModel(fieldId: string): FieldViewModel | null;
}