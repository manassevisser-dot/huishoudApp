// src/domain/constants/Tokens.ts

/**
 * Atomaire design tokens: spacing, typografie, border-radius, afmetingen, schaduwen en opacity.
 *
 * @module domain/constants
 * @see {@link ./README.md | Constants — Details}
 *
 * @remarks
 * `Tokens` is de laagste laag van het design-systeem — thema-onafhankelijk.
 * Kleuren horen in `Colors.ts`; layout-patronen in `LayoutTokens.ts`.
 *
 * Wees terughoudend met nieuwe tokens: het doel is een **beperkte, consistente set**.
 */

/**
 * Spacing-schaal in pixels. Gebruik als `padding`, `margin` of `gap`.
 *
 * @example
 * paddingHorizontal: Space.lg  // 16
 */
export const Space = {
  xs:    4,
  sm:    8,
  badge: 6,
  md:    12,
  lg:    16,
  xl:    20,
  xxl:   24,
} as const;

/**
 * Typografie-schaal in pixels. Gebruik als `fontSize`.
 *
 * @example
 * fontSize: Type.md  // 16 — standaard body
 */
export const Type = {
  xs:  12,
  sm:  14,
  md:  16,
  lg:  17,
  xl:  18,
  h2:  28,
  kpi: 48,
} as const;

/**
 * Border-radius-schaal in pixels.
 *
 * @example
 * borderRadius: Radius.md  // 8 — standaard kaart
 */
export const Radius = {
  xs:     4,
  sm:     6,
  md:     8,
  lg:     10,
  xl:     12,
  round:  20,
  circle: 999,
  pill:   20,
} as const;

/**
 * Vaste afmetingen voor interactieve elementen.
 *
 * @remarks
 * `hitTarget: 44` volgt de Apple HIG minimum tappable area.
 */
export const Sizes = {
  inputHeight:  48,
  checkbox:     24,
  toggleWidth:  80,
  /** Minimale tappable area (Apple HIG). */
  hitTarget:    44,
  counterValue: 48,
} as const;

// Interne shadow-definitie-objecten — exporteer alleen via `Shadows`
const shadowSm = { ios: { y: 1, radius: 2, opacity: 0.05 }, android: { elevation: 2 } };
const shadowMd = { ios: { y: 2, radius: 4, opacity: 0.1  }, android: { elevation: 3 } };
const shadowLg = { ios: { y: 2, radius: 8, opacity: 0.1  }, android: { elevation: 4 } };

/**
 * Schaduw-definities voor iOS (shadowOffset/Radius/Opacity) en Android (elevation).
 *
 * @remarks
 * `level1/2/3` zijn aliassen voor `sm/md/lg` voor backwards-compatibiliteit.
 * Gebruik in nieuwe code altijd `sm/md/lg`.
 *
 * @example
 * ...Shadows.md.ios  // { y: 2, radius: 4, opacity: 0.1 }
 */
export const Shadows = {
  sm:     shadowSm,
  md:     shadowMd,
  lg:     shadowLg,
  /** @deprecated Gebruik `Shadows.sm`. */
  level1: shadowSm,
  /** @deprecated Gebruik `Shadows.md`. */
  level2: shadowMd,
  /** @deprecated Gebruik `Shadows.lg`. */
  level3: shadowLg,
} as const;

/**
 * Opacity-schaal voor `opacity`-stijlprop.
 *
 * @example
 * opacity: isDisabled ? Opacity.disabled : Opacity.solid
 */
export const Opacity = {
  transparent: 0,
  disabled:    0.5,
  solid:       1,
} as const;

/**
 * Samengevoegd token-object: alle groepen op één plek.
 *
 * @example
 * import { Tokens } from '@domain/constants/Tokens';
 * Tokens.Space.lg  // 16
 */
export const Tokens = { Space, Type, Radius, Sizes, Shadows, Opacity } as const;

/** TypeScript-type van het volledige `Tokens`-object. */
export type TokensType = typeof Tokens;
