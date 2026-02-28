/**
 * Assembleert en levert het volledige, ge-cached stylesheet voor het actieve thema.
 *
 * @module ui/styles
 * @see {@link ./README.md | Styles — Details}
 *
 * @remarks
 * `getAppStyles` doorloopt drie stappen:
 * 1. Alle `make…`-functies samenvoegen tot één object (pure tokens, geen platform-code)
 * 2. Platform-specifieke schaduwen toepassen via `applyShadows`
 * 3. `StyleSheet.create()` aanroepen en het resultaat per thema cachen
 *
 * Het cache-mechanisme (`styleCache`) voorkomt dat het stylesheet bij elke render
 * opnieuw wordt berekend. Bij thema-wissel wordt een nieuwe entry aangemaakt.
 */
import { StyleSheet } from 'react-native';
import { useTheme } from '@ui/providers/ThemeProvider';
import { applyShadows, AnyStyle } from './PlatformStyles';
import {
  Colors,
  Tokens,
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
} from '@ui/kernel';
import { makeForms } from '@domain/styles/primitives/Fields';
import type { Theme } from '@ui/kernel';

// Cache per thema
const styleCache: Partial<Record<Theme, ReturnType<typeof StyleSheet.create>>> = {};

/**
 * Bouwt en cachet het volledige stylesheet voor een gegeven thema.
 *
 * @param theme - Het actieve thema (`'light'` of `'dark'`)
 * @returns Ge-cached `StyleSheet`-object met alle geassembleerde stijlen
 */
export function getAppStyles(theme: Theme) {
  const cachedStyles = styleCache[theme];
  if (cachedStyles !== undefined) {
    return cachedStyles;
  }

  const c = Colors[theme];

  // 1. Assembleer alle domein-regels (pure tokens, geen platform-code)
  const assembled = {
    ...makeLayout(c),
    ...makeForms(c),
    ...makeHeader(c),
    ...makeButtons(c),
    ...makeCards(c),
    ...makeChips(c),
    ...makeDashboard(c),
    ...makeSummary(c),
    ...makeTypography(c),
    ...makeAlerts(c),
    ...makeToggles(c),
    ...makeCheckboxes(c),
    ...makeHelpers(c),
    ...makeContainers(c),
  };

  // 2. Pas platform-specifieke shadows toe (de enige RN-afhankelijke stap)
  const withShadows = applyShadows(
    assembled as unknown as Record<string, AnyStyle>,
    c
  );

  // 3. Maak StyleSheet (RN optimalisatie)
  const styles = StyleSheet.create(withShadows);
  styleCache[theme] = styles;
  return styles;
}

export type AppStyles = ReturnType<typeof getAppStyles>;

/**
 * React-hook die het stylesheet, de kleuren en de Tokens voor het actieve thema levert.
 *
 * @returns `{ styles, colors, Tokens }` — klaar voor gebruik als `style`-prop
 *
 * @example
 * const { styles, colors } = useAppStyles();
 * <View style={styles.inputContainer} />
 */
export function useAppStyles() {
  const { theme } = useTheme();
  const styles = getAppStyles(theme);
  const colors = Colors[theme];
  return { styles, colors, Tokens };
}