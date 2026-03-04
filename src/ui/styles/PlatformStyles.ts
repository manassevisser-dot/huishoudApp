/**
 * Abstraheert platform-specifieke schaduw-implementaties voor iOS en Android.
 * 
 * @module ui/styles
 * @see {@link ./README.md | PlatformStyles - Details}
 * 
 * @remarks
 * - Gebruikt `Platform.select` om declaratieve shadow-levels te mappen naar native props
 * - `SHADOW_MAP` is de SSOT voor welke styles een schaduw krijgen
 */
import { Platform, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { Tokens } from '@ui/kernel';
import type { ColorScheme } from '@ui/kernel';

export type AnyStyle = ViewStyle | TextStyle | ImageStyle;
export type ShadowLevel = 'level1' | 'level2' | 'level3';

/**
 * Genereert platform-specifieke schaduw-props voor een gegeven level.
 * 
 * @param c - Actief kleurschema (voor shadowColor)
 * @param level - Schaduw-intensiteit ('level1' | 'level2' | 'level3')
 * @returns Platform-specifiek stijl-object met shadow-props
 * 
 * @example
 * const shadow = getPlatformShadow(colors, 'level1');
 * // iOS: { shadowColor, shadowOffset, ... }
 * // Android: { elevation: 2 }
 */
export function getPlatformShadow(c: ColorScheme, level: ShadowLevel) {
  const sh = Tokens.Shadows[level];
  return Platform.select({
    ios: {
      shadowColor: c.shadow,
      shadowOffset: { width: 0, height: sh.ios.y },
      shadowOpacity: sh.ios.opacity,
      shadowRadius: sh.ios.radius,
    },
    android: { elevation: sh.android.elevation },
    default: {},
  }) ?? {};
}

/**
 * Mapping van semantische style-keys naar schaduw-levels.
 * 
 * @remarks
 * - Voeg hier nieuwe entries toe om een style een schaduw te geven
 * - Wijzig niet de values tenzij het visuele design van levels verandert
 */
export const SHADOW_MAP: Record<string, ShadowLevel> = {
  button:        'level2',
  headerBar:     'level1',
  card:          'level1',
  dashboardCard: 'level3',
  toast:         'level1',
  modalCard:     'level2',
} as const;

/**
 * Injecteert platform-specifieke schaduwen in een geassembleerd stylesheet.
 * 
 * @param assembled - Stylesheet zonder schaduwen (pure tokens)
 * @param c - Actief kleurschema
 * @returns Nieuw stylesheet met schaduwen toegevoegd op keys uit `SHADOW_MAP`
 * 
 * @example
 * const withShadows = applyShadows(assembledStyles, colors);
 * // { card: { backgroundColor: '#fff', shadowColor: '#000', ... } }
 */
export function applyShadows(
  assembled: Record<string, AnyStyle>,
  c: ColorScheme,
): Record<string, AnyStyle> {
  const result: Record<string, AnyStyle> = { ...assembled };

  for (const [key, level] of Object.entries(SHADOW_MAP)) {
    const baseStyle = result[key];
    if (baseStyle !== undefined) {
      result[key] = { 
        ...baseStyle, 
        ...getPlatformShadow(c, level) 
      };
    }
  }

  return result;
}