// src/domain/registry/StyleRegistry.ts
//
// STYLE REGISTRY — Single Source of Truth
// ════════════════════════════════════════════════════════════
// Alle style-modules worden hier geëxporteerd.
// Consumers importeren ALTIJD uit deze registry, nooit direct uit modules.
//
// Architectuur:
//   LayoutTokens  →  structuur-patronen (row, centered, pinBottom)
//   Tokens/Colors →  waarden (Space.lg, c.primary)
//   Modules       →  combineren tokens tot benoemde regels (button, card, ...)
//   StyleRegistry →  SSOT index — deze file
//   useAppStyles  →  StyleSheet.create + PlatformStyles (shadow)
//
// Type-safety: alle key-types worden afgeleid via ReturnType, niet handmatig.

// ── Factory re-exports ───────────────────────────────────────
export { makeAlerts,      type AlertStyles }      from '../styles/modules/Alerts';
export { makeButtons,     type ButtonStyles }     from '../styles/modules/Buttons';
export { makeCards,       type CardsStyles }      from '../styles/modules/Cards';
export { makeCheckboxes,  type CheckboxStyles }   from '../styles/modules/Checkboxes';
export { makeChips,       type ChipStyles }       from '../styles/modules/Chips';
export { makeContainers,  type ContainerStyles }  from '../styles/modules/Containers';
export { makeDashboard,   type DashboardStyles }  from '../styles/modules/Dashboard';
export { makeForms,       type FormStyles }       from '../styles/modules/Forms';
export { makeHeader,      type HeaderStyles }     from '../styles/modules/Header';
export { makeHelpers,     type HelperStyles }     from '../styles/modules/Helpers';
export { makeLayout,      type LayoutStyles }     from '../styles/modules/Layout';
export { makeSummary,     type SummaryStyles }    from '../styles/modules/Summary';
export { makeToggles,     type ToggleStyles }     from '../styles/modules/Toggles';
export { makeTypography,  type TypographyStyles } from '../styles/modules/Typography';

// ── Afgeleide key-unions (voor type-safe lookups) ────────────
import type { makeAlerts }     from '../styles/modules/Alerts';
import type { makeButtons }    from '../styles/modules/Buttons';
import type { makeCards }      from '../styles/modules/Cards';
import type { makeCheckboxes } from '../styles/modules/Checkboxes';
import type { makeChips }      from '../styles/modules/Chips';
import type { makeContainers } from '../styles/modules/Containers';
import type { makeDashboard }  from '../styles/modules/Dashboard';
import type { makeForms }      from '../styles/modules/Forms';
import type { makeHeader }     from '../styles/modules/Header';
import type { makeHelpers }    from '../styles/modules/Helpers';
import type { makeLayout }     from '../styles/modules/Layout';
import type { makeSummary }    from '../styles/modules/Summary';
import type { makeToggles }    from '../styles/modules/Toggles';
import type { makeTypography } from '../styles/modules/Typography';

export type AlertsKeys     = keyof ReturnType<typeof makeAlerts>;
export type ButtonsKeys    = keyof ReturnType<typeof makeButtons>;
export type CardsKeys      = keyof ReturnType<typeof makeCards>;
export type CheckboxesKeys = keyof ReturnType<typeof makeCheckboxes>;
export type ChipsKeys      = keyof ReturnType<typeof makeChips>;
export type ContainersKeys = keyof ReturnType<typeof makeContainers>;
export type DashboardKeys  = keyof ReturnType<typeof makeDashboard>;
export type FormsKeys      = keyof ReturnType<typeof makeForms>;
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
  FORMS:       'Forms',
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
  [STYLE_MODULES.FORMS]:       FormsKeys;
  [STYLE_MODULES.HEADER]:      HeaderKeys;
  [STYLE_MODULES.HELPERS]:     HelpersKeys;
  [STYLE_MODULES.LAYOUT]:      LayoutKeys;
  [STYLE_MODULES.SUMMARY]:     SummaryKeys;
  [STYLE_MODULES.TOGGLES]:     TogglesKeys;
  [STYLE_MODULES.TYPOGRAPHY]:  TypographyKeys;
}