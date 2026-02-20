import type { PrimitiveType } from '@domain/registry/PrimitiveRegistry';

export interface ScreenViewModel {
  screenId: string;
  title?: string;
  titleToken?: string;
  type: string;
  styleKey?: string;
  sections: SectionViewModel[];
  navigation: {
    next?: string;
    previous?: string;
  };
}

export interface SectionViewModel {
  sectionId: string;
  title: string;
  styleKey?: string;
  children: EntryViewModel[];
}

export interface EntryViewModel {
  entryId: string;
  label?: string;
  labelToken?: string;
  styleKey?: string;
  child: PrimitiveViewModel;
  isVisible?: boolean; // wordt NIET door de factory gezet
}

export interface PrimitiveViewModel {
  entryId: string;              // instance-id == entryId
  primitiveType: PrimitiveType; // uit jouw PrimitiveRegistry
  styleKey?: string;
}

export interface IUIOrchestrator {
  buildScreen(screenId: string): ScreenViewModel | null;
}