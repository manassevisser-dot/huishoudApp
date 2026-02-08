// src/ui/styles/useAppStyles.ts
// UPDATED: makeContainers toegevoegd
import { StyleSheet } from 'react-native';
import { useTheme } from '@app/context/ThemeContext';
import { Colors, Theme } from '@domain/constants/Colors';
import { Tokens } from '@domain/constants/Tokens';
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
  makeContainers,  // 🆕 NIEUW
} from '@styles/modules';

// Cache voor de gegenereerde stijlen per thema
const styleCache: Partial<Record<Theme, ReturnType<typeof StyleSheet.create>>> = {};

export function getAppStyles(theme: Theme) {
  // FIX: Expliciete check op undefined voor de linter
  const cachedStyles = styleCache[theme];
  if (cachedStyles !== undefined) {
    return cachedStyles;
  }

  const c = Colors[theme];

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
    ...makeContainers(c),  // 🆕 NIEUW
  };

  const styles = StyleSheet.create(assembled);
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