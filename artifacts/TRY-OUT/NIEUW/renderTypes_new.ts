// src/app/orchestrators/types/render.types.ts
/**
 * @file_intent Geïsoleerde type-definities voor render-ready view models.
 * @repo_architecture Mobile Industry (MI) - Type Definition Layer.
 * @term_definition RenderScreenVM = Het finale, render-klare model dat de UI direct kan consumeren.
 * @contract Bevat ALLEEN types, geen logica. Geïmporteerd door UIOrchestrator en MasterOrchestrator (re-export).
 * @migration Verplaatst uit MasterOrchestrator.ts. MasterOrchestrator re-exporteert deze types voor
 *   backward compatibility zodat consumers (MasterOrchestratorAPI.ts) geen imports hoeven aan te passen.
 */

export interface RenderScreenVM {
  screenId: string;
  title: string;
  type: string;
  style?: unknown;
  sections: RenderSectionVM[];
  navigation: { next?: string; previous?: string };
}

export interface RenderSectionVM {
  sectionId: string;
  title: string;
  layout: string;
  uiModel?: string;
  style?: unknown;
  children: RenderEntryVM[];
}

export interface RenderEntryVM {
  entryId: string;
  fieldId: string;
  label: string;
  placeholder?: string;
  primitiveType: string;
  value: unknown;
  isVisible: boolean;
  options?: readonly string[];
  optionsKey?: string;
  style?: unknown;
  childStyle?: unknown;
  onChange: (value: unknown) => void;
}
