/**
 * @file_intent Centraliseert en abstraheert platform-specifieke stijlverschillen, met een primaire focus op de rendering van schaduws voor iOS en Android. Het biedt een systeem om declaratief aan te geven *dat* een component een schaduw moet hebben, zonder dat de aanroeper hoeft te weten *hoe* die schaduw op elk platform wordt geïmplementeerd.
 * @repo_architecture UI Layer - Style Abstraction. Dit bestand is een fundamenteel onderdeel van het styling-systeem. Het bevindt zich onder de `useAppStyles`-hook en levert de low-level, platform-bewuste implementatiedetails, specifiek voor schaduws. Het is een directe dependency van de hoofd-style-assembler (`useAppStyles`).
 * @term_definition
 *   - `Platform.select`: Een React Native API om platform-specifieke waarden te definiëren. Dit bestand capsuleert het gebruik hiervan voor stijlen.
 *   - `ShadowLevel`: Een abstractie ('level1', 'level2', 'level3'), gedefinieerd in de `Tokens`, die verschillende schaduw-intensiteiten representeert, los van de implementatie.
 *   - `SHADOW_MAP`: De "Single Source of Truth". Deze mapping koppelt een semantische stijl-key (bijv. 'card') aan een specifieke `ShadowLevel`.
 *   - `getPlatformShadow`: De functie die een `ShadowLevel` vertaalt naar concrete iOS (`shadow...`) of Android (`elevation`) stijl-property's.
 *   - `applyShadows`: Een utility-functie die de gegenereerde platform-specifieke schaduws injecteert in het hoofd-stylesheet-object.
 * @contract 1. `getPlatformShadow` ontvangt een kleurschema en een `ShadowLevel` en retourneert een platform-specifiek stijl-object. 2. `SHADOW_MAP` definieert welke semantische stijl-keys een schaduw krijgen. 3. `applyShadows` ontvangt het complete, maar schaduwloze, stylesheet en het kleurschema. Het itereert over `SHADOW_MAP` en voegt de juiste schaduw-stijlen toe aan de corresponderende styles, en retourneert het nieuwe, complete stylesheet.
 * @ai_instruction Om een component een schaduw te geven, pas je niet de stijl van het component direct aan. In plaats daarvan voeg je een entry toe aan de `SHADOW_MAP` in dit bestand. Om bijvoorbeeld een nieuwe `mijnNieuweStijl` een `level1` schaduw te geven, voeg je `'mijnNieuweStijl': 'level1'` toe aan `SHADOW_MAP`. De `useAppStyles`-hook regelt de rest. Je hoeft `getPlatformShadow` alleen te bewerken als je het uiterlijk van de schaduw-levels zelf wilt aanpassen.
 */
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