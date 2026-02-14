// src/ui/styles/PlatformStyles.ts
//
// PLATFORM STYLES — de enige plek waar Platform.select leeft.
// Shadows worden hier berekend en door useAppStyles toegepast
// op de keys die dat nodig hebben.

import { Platform, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { Tokens } from '@domain/constants/Tokens';
import type { ColorScheme } from '@domain/constants/Colors';



// ── Shadow level → platform-specifieke stijl ─────────────────
export type AnyStyle = ViewStyle | TextStyle | ImageStyle  
export type ShadowLevel = 'level1' | 'level2' | 'level3';

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

// ── Shadow-map: welke style-keys krijgen welke shadow ────────
// Dit is de SSOT voor "key X heeft shadow level Y".
// useAppStyles past dit automatisch toe na het assemblen.

export const SHADOW_MAP: Record<string, ShadowLevel> = {
  button:        'level2',
  headerBar:     'level1',
  card:          'level1',
  dashboardCard: 'level3',
} as const;

// ── Helper: pas shadows toe op assembled styles ──────────────

export function applyShadows(
  assembled: Record<string, AnyStyle>,
  c: ColorScheme,
): Record<string, AnyStyle> {
  const result = { ...assembled };

  for (const [key, level] of Object.entries(SHADOW_MAP)) {
    const baseStyle = result[key];
    if (baseStyle !== undefined) {
      // Gebruik een type-safe spread door te casten naar ViewStyle
      // Dit mag in de UI-laag omdat shadows alleen op View-niveau werken.
      result[key] = { 
        ...(baseStyle as ViewStyle), 
        ...getPlatformShadow(c, level) 
      } as AnyStyle;
    }
  }

  return result;
}