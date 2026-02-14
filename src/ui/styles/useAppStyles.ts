

// src/ui/styles/useAppStyles.ts
import { StyleSheet } from 'react-native';
import { useTheme } from '@ui/providers/ThemeProvider';
import { Colors, Theme } from '@domain/constants/Colors';
import { Tokens } from '@domain/constants/Tokens';
import { applyShadows, AnyStyle } from './PlatformStyles';

// Importeer ALLES uit de StyleRegistry — de SSOT
import {
  makeLayout,
  makeHeader,
  makeForms,
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

// Cache per thema
const styleCache: Partial<Record<Theme, ReturnType<typeof StyleSheet.create>>> = {};

export function getAppStyles(theme: Theme) {
  const cachedStyles = styleCache[theme];
  if (cachedStyles !== undefined) {
    return cachedStyles;
  }

  const c = Colors[theme];

  // 1. Assembleer alle domein-regels (pure tokens, geen platform-code)
  const assembled = {
    ...makeLayout(c),
    ...makeHeader(c),
    ...makeForms(c),
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

export function useAppStyles() {
  const { theme } = useTheme();
  const styles = getAppStyles(theme);
  const colors = Colors[theme];
  return { styles, colors, Tokens };
}