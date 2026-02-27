// src/domain/constants/LayoutTokens.ts

/**
 * Herbruikbare, semantische flexbox- en positioneringspatronen als style-objecten.
 *
 * @module domain/constants
 * @see {@link ./README.md | Constants — Details}
 * @see {@link ./Tokens.ts | Tokens — spacing-waarden}
 *
 * @remarks
 * `Layout`-tokens zijn puur structureel: flexbox-richting, uitlijning, positionering.
 * Geen kleuren, geen thema-waarden. Spacing-waarden komen uitsluitend uit `Tokens.Space`.
 *
 * Gebruik via spread in `StyleRegistry`-modules:
 * ```typescript
 * container: { ...Layout.rowBetweenCenter, padding: Space.lg }
 * ```
 */

import { Tokens } from '@domain/constants/Tokens';

/**
 * Re-export van `Tokens.Space` voor convenience in `LayoutTokens`-consumers
 * die al `Layout` importeren en geen losse `Tokens`-import willen.
 */
export const Space = Tokens.Space;

/**
 * Alle layout-tokens gegroepeerd per patroon.
 *
 * @example
 * // In een StyleRegistry-module:
 * headerRow: { ...Layout.rowBetweenCenter, paddingHorizontal: Space.lg }
 */
export const Layout = {
  // ── Flex basis ──────────────────────────────────────────────────────────
  /** `flex: 1` — vult beschikbare ruimte. */
  fullWidth:        { flex: 1 } as const,

  // ── Row-varianten ───────────────────────────────────────────────────────
  /** Horizontale rij zonder verdere uitlijning. */
  row:              { flexDirection: 'row' as const },
  /** Horizontale rij, kinderen verspreid over de volledige breedte. */
  rowBetween:       { flexDirection: 'row' as const, justifyContent: 'space-between' as const },
  /** Horizontale rij, kinderen verticaal gecentreerd. */
  rowCenter:        { flexDirection: 'row' as const, alignItems: 'center' as const },
  /** Horizontale rij, kinderen verspreid én verticaal gecentreerd. */
  rowBetweenCenter: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'center' as const },
  /** Horizontale rij met wrapping. */
  rowWrap:          { flexDirection: 'row' as const, flexWrap: 'wrap' as const },
  /** Horizontale rij met wrapping, horizontaal gecentreerd. */
  rowWrapCenter:    { flexDirection: 'row' as const, flexWrap: 'wrap' as const, justifyContent: 'center' as const },
  /** Horizontale rij, volledig gecentreerd (horizontaal + verticaal). */
  rowCentered:      { flexDirection: 'row' as const, alignItems: 'center' as const, justifyContent: 'center' as const },

  // ── Uitlijning ──────────────────────────────────────────────────────────
  /** Volledig gecentreerd (kolom-richting). */
  centered:         { alignItems: 'center' as const, justifyContent: 'center' as const },
  /** Tekst horizontaal gecentreerd. */
  centerText:       { textAlign: 'center' as const },
  /** Tekst rechts uitgelijnd. */
  rightText:        { textAlign: 'right' as const },

  // ── Positionering ───────────────────────────────────────────────────────
  /** Absoluut gepositioneerd element (vereist `top/left/right/bottom` van de consumer). */
  absolute:         { position: 'absolute' as const },
  /** Relatief gepositioneerd element (default, explicieter dan impliciet). */
  relative:         { position: 'relative' as const },
  /** Verbergt overflow (bijv. voor afgeronde hoeken). */
  hidden:           { overflow: 'hidden' as const },
  /** Vastgepind aan de onderkant van het scherm. */
  pinBottom:        { position: 'absolute' as const, bottom: 0, left: 0, right: 0 },

  // ── Samengestelde tokens ────────────────────────────────────────────────
  /**
   * Standaard footer-afmetingen.
   * Geen style-object maar maatvaste waarden — consumer assembleert de stijl zelf.
   */
  footer: {
    minHeight:         80,
    horizontalPadding: Space.xl,
    verticalPadding:   Space.md,
    /** Minimale bottom-padding als `insets.bottom === 0`. */
    safeAreaMin:       16,
  },

  /** Standaard knoppenrij voor navigatie-footers. */
  buttonRow: {
    flexDirection:  'row' as const,
    alignItems:     'center' as const,
    justifyContent: 'space-between' as const,
    width:          '100%',
  },
} as const;

/** Union van alle geldige `Layout`-sleutels. */
export type LayoutToken = keyof typeof Layout;
