// src/domain/registry/StyleRegistry.ts
/**
 * @file_intent De Single Source of Truth voor alle visuele stijlen en thema-tokens.
 * @repo_architecture Mobile Industry (MI) - De 'Appearance' laag. Definieert HOE de dozen en doosjes eruitzien.
 * @term_definition StyleModule = Een verzameling gerelateerde stijlregels. StyleKey = De specifieke klasse binnen een module.
 * @contract Componenten importeren NOOIT direct uit style-files, maar ALTIJD via de registry of de useAppStyles hook.
 * @ai_instruction Gebruik afgeleide types (ReturnType) voor nieuwe modules. Voeg nieuwe modules zowel aan de exports als aan STYLE_MODULES toe.
 */

// ── Factory re-exports ───────────────────────────────────────
export { makeAlerts,      type AlertStyles }      from '@domain/styles/primitives/Alerts';
export { makeButtons,     type ButtonStyles }     from '@domain/styles/primitives/Buttons';
export { makeCards,       type CardsStyles }      from '@domain/styles/primitives/Cards';
export { makeCheckboxes,  type CheckboxStyles }   from '@domain/styles/primitives/Checkboxes';
export { makeChips,       type ChipStyles }       from '@domain/styles/primitives/Chips';
export { makeContainers,  type ContainerStyles }  from '@domain/styles/primitives/Containers';
export { makeDashboard,   type DashboardStyles }  from '@domain/styles/sections/Dashboard';
export { makeHeader,      type HeaderStyles }     from '@domain/styles/primitives/Header';
export { makeHelpers,     type HelperStyles }     from '@domain/styles/primitives/Helpers';
export { makeLayout,      type LayoutStyles }     from '@domain/styles/primitives/Layout';
export { makeSummary,     type SummaryStyles }    from '@domain/styles/sections/Summary';
export { makeToggles,     type ToggleStyles }     from '@domain/styles/primitives/Toggles';
export { makeTypography,  type TypographyStyles } from '@domain/styles/primitives/Typography';

// ── Afgeleide key-unions (voor type-safe lookups) ────────────
import type { makeAlerts }     from '@domain/styles/primitives/Alerts';
import type { makeButtons }    from '@domain/styles/primitives/Buttons';
import type { makeCards }      from '@domain/styles/primitives/Cards';
import type { makeCheckboxes } from '@domain/styles/primitives/Checkboxes';
import type { makeChips }      from '@domain/styles/primitives/Chips';
import type { makeContainers } from '@domain/styles/primitives/Containers';
import type { makeDashboard }  from '@domain/styles/sections/Dashboard';
import type { makeHeader }     from '@domain/styles/primitives/Header';
import type { makeHelpers }    from '@domain/styles/primitives/Helpers';
import type { makeLayout }     from '@domain/styles/primitives/Layout';
import type { makeSummary }    from '@domain/styles/sections/Summary';
import type { makeToggles }    from '@domain/styles/primitives/Toggles';
import type { makeTypography } from '@domain/styles/primitives/Typography';

export type AlertsKeys     = keyof ReturnType<typeof makeAlerts>;
export type ButtonsKeys    = keyof ReturnType<typeof makeButtons>;
export type CardsKeys      = keyof ReturnType<typeof makeCards>;
export type CheckboxesKeys = keyof ReturnType<typeof makeCheckboxes>;
export type ChipsKeys      = keyof ReturnType<typeof makeChips>;
export type ContainersKeys = keyof ReturnType<typeof makeContainers>;
export type DashboardKeys  = keyof ReturnType<typeof makeDashboard>;
export type HeaderKeys     = keyof ReturnType<typeof makeHeader>;
export type HelpersKeys    = keyof ReturnType<typeof makeHelpers>;
export type LayoutKeys     = keyof ReturnType<typeof makeLayout>;
export type SummaryKeys    = keyof ReturnType<typeof makeSummary>;
export type TogglesKeys    = keyof ReturnType<typeof makeToggles>;
export type TypographyKeys = keyof ReturnType<typeof makeTypography>;

// ── Module-naam SSOT ─────────────────────────────────────────
export const STYLE_MODULES = {
  ALERTS:      'Alerts',
  BUTTONS:     'Buttons',
  CARDS:       'Cards',
  CHECKBOXES:  'Checkboxes',
  CHIPS:       'Chips',
  CONTAINERS:  'Containers',
  DASHBOARD:   'Dashboard',
  HEADER:      'Header',
  HELPERS:     'Helpers',
  LAYOUT:      'Layout',
  SUMMARY:     'Summary',
  TOGGLES:     'Toggles',
  TYPOGRAPHY:  'Typography',
} as const;

export type StyleModuleName = typeof STYLE_MODULES[keyof typeof STYLE_MODULES];

// ── Key-per-module interface (voor registry lookups) ─────────
export interface IStyleRegistry {
  [STYLE_MODULES.ALERTS]:      AlertsKeys;
  [STYLE_MODULES.BUTTONS]:     ButtonsKeys;
  [STYLE_MODULES.CARDS]:       CardsKeys;
  [STYLE_MODULES.CHECKBOXES]:  CheckboxesKeys;
  [STYLE_MODULES.CHIPS]:       ChipsKeys;
  [STYLE_MODULES.CONTAINERS]:  ContainersKeys;
  [STYLE_MODULES.DASHBOARD]:   DashboardKeys;
  [STYLE_MODULES.HEADER]:      HeaderKeys;
  [STYLE_MODULES.HELPERS]:     HelpersKeys;
  [STYLE_MODULES.LAYOUT]:      LayoutKeys;
  [STYLE_MODULES.SUMMARY]:     SummaryKeys;
  [STYLE_MODULES.TOGGLES]:     TogglesKeys;
  [STYLE_MODULES.TYPOGRAPHY]:  TypographyKeys;
}

/**
 * ═══════════════════════════════════════════════════════════
 * STYLE REGISTRY OBJECT
 * ═══════════════════════════════════════════════════════════
 */

export const StyleRegistry = {
  /**
   * Geeft alle geregistreerde module-namen terug.
   */
  getAllModules: (): StyleModuleName[] => Object.values(STYLE_MODULES),
  /**
   * Controleert of een module-naam valide is.
   */
  isValidModule: (name: string): name is StyleModuleName => 
    Object.values(STYLE_MODULES).includes(name as StyleModuleName) === true,
};