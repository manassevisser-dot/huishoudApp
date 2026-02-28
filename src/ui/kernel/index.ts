/**
 * @file_intent Anti-Corruption Layer (ACL) — het enige toegestane kruispunt
 *   van @domain naar de UI-laag. Alle @domain-imports in src/ui/ lopen
 *   uitsluitend via dit bestand.
 *
 * @repo_architecture UI Layer - Kernel/Port. Dunne re-export barrel zonder
 *   logica. UI-components importeren NOOIT rechtstreeks uit @domain; altijd
 *   via @ui/kernel. Het integrity-guard (UI-DECOUPLE-006) sluit deze directory
 *   expliciet uit en handhaaft de grens voor alle andere UI-bestanden.
 *
 * @contract
 *   - Puur re-exports. Geen transformaties, geen logica, geen state.
 *   - Wijzigingen aan dit bestand vereisen review: elke toevoeging is een
 *     bewuste verruiming van de domein/UI-grens.
 *   - Behoud de scheiding in secties: runtime constanten, style-assembly,
 *     en type-only exports.
 *
 * @ai_instruction
 *   Voeg hier alleen toe wat UI *echt* nodig heeft vanuit @domain en wat
 *   nergens anders in de UI-laag beschikbaar is. Twijfel je? Voeg het NIET
 *   toe — laat de integrity-guard de grens bewaken.
 */
// src/ui/kernel/index.ts

// ── Runtime constanten ─────────────────────────────────────────────────────
// Spacing, shadows, grid-waarden. Geen toestandslogica.
export { Tokens } from '@domain/constants/Tokens';

// Kleurenschema per thema. Gebruikt door useAppStyles + componenten die
// direct kleuren nodig hebben (bv. FooterContainer).
export { Colors } from '@domain/constants/Colors';

// Navigatiesleutels voor sectie-identificatie in CsvUploadScreen.
export { UI_SECTIONS } from '@domain/constants/uiSections';

// De render-woordenschat van UI: welk primitive rendert welk component.
// Uitsluitend als discriminant in switch-statements (DynamicEntry, DynamicPrimitive).
export { PRIMITIVE_TYPES } from '@domain/registry/PrimitiveRegistry';

// ── Style-assembly (uitsluitend voor useAppStyles) ─────────────────────────
// Stijlregels uit de domeinlaag om Thema's te kunnen maken. Uitsluitend
// useAppStyles.ts mag deze functies importeren — niet individuele componenten.
export {
  makeLayout,
  makeHeader,
  makeButtons,
  makeCards,
  makeChips,
  makeDashboard,
  makeSummary,
  makeTypography,
  makeAlerts,
  makeToggles,
  makeCheckboxes,
  makeHelpers,
  makeContainers,
} from '@domain/registry/StyleRegistry';

// ── Types (enkel type-imports — geen runtime impact) ───────────────────────
// TypeScript wist deze volledig bij compilatie. Ze zijn hier gegroepeerd
// zodat UI-bestanden één stabiel import-pad hebben.
export type { Theme, ColorScheme } from '@domain/constants/Colors';

export type {
  PrimitiveType,
  PrimitiveStyleRule,
  BasePrimitiveViewModel,
  PrimitiveViewModel,
  PrimitiveMetadata,
  CounterViewModel,
  CurrencyViewModel,
  TextViewModel,
  NumberViewModel,
  ChipViewModel,
  ChipGroupViewModel,
  RadioOptionViewModel,
  RadioViewModel,
  ToggleViewModel,
  LabelViewModel,
  DateViewModel,
  ActionViewModel,
} from '@domain/registry/PrimitiveRegistry';

/**
 * Semantische intentie voor ACTION primitives.
 * 
 * @remarks
 * Bepaalt de visuele variant van een actie-knop (primair, secundair, destructief).
 * Wordt door de mapper vertaald naar de juiste stijlsleutel in AppStyles.
 */
export type { StyleIntent } from '@domain/registry/EntryRegistry';