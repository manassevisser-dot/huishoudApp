// src/app/orchestrators/types/render.types.ts
/**
 * Render-ready view model types: de finale shapes die de UI direct consumeert.
 *
 * @module app/orchestrators/types
 * @see {@link ../README.md | Orchestrators — Details}
 *
 * @remarks
 * Bevat uitsluitend types — geen logica. Re-geëxporteerd door `MasterOrchestrator`
 * voor backward compatibility met bestaande consumers.
 *
 * `RenderEntryVM.styleIntent` is een doorgethread veld: het wordt één-op-één gekopieerd
 * van `EntryDefinition.styleIntent` (domeinlaag) naar dit type (orchestratorlaag).
 * De orchestrator voegt **geen logica toe** — hij geeft de intentie enkel door.
 * De vertaling van intentie naar een concrete stijlsleutel vindt uitsluitend plaats
 * in `entry.mappers.ts` (UI-laag), via `ACTION_STYLE_MAP`.
 */
import type { StyleIntent } from '@domain/registry/EntryRegistry';

/**
 * Volledig scherm-model, gereed voor directe UI-rendering.
 *
 * @remarks `type` bepaalt de renderingstrategie (bijv. `'wizard'`, `'dashboard'`).
 */
export interface RenderScreenVM {
  screenId: string;
  title: string;
  type: string;
  style?: unknown;
  sections: RenderSectionVM[];
  navigation: { next?: string; previous?: string };
}

/** Één sectie binnen een `RenderScreenVM`, met layout-hint en geneste entries. */
export interface RenderSectionVM {
  sectionId: string;
  title: string;
  layout: string;
  uiModel?: string;
  style?: unknown;
  children: RenderEntryVM[];
}

/**
 * Één veld-entry, volledig gereed voor de primitive-renderer.
 *
 * @remarks
 * `onChange` is al gebonden aan `MasterOrchestrator.updateField()` door `UIOrchestrator`.
 * De UI hoeft geen orchestrator-referentie bij te houden.
 */
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
  /**
   * Semantische intentie voor ACTION primitives — doorgethread vanuit `EntryDefinition`.
   *
   * @remarks
   * De orchestrator kopieert dit veld één-op-één; er wordt geen logica toegevoegd.
   * Non-ACTION primitives laten dit veld weg (`undefined`).
   *
   * @see {@link StyleIntent} voor geldige waarden
   * @see `ACTION_STYLE_MAP` in `entry.mappers.ts` voor de stijlvertaling
   */
  styleIntent?: StyleIntent;
  onChange: (value: unknown) => void;
}
