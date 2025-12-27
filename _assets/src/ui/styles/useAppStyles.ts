// src/styles/useAppStyles.ts
// CU-008.6: De Orchestrator (Main Factory)
import { StyleSheet } from 'react-native';
import { useTheme } from '@app/context/ThemeContext';
import { Colors, Theme } from '@styles/Colors';
import { Tokens } from '@styles/Tokens';
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
  makeToggles,      // ← NIEUW
  makeCheckboxes,   // ← NIEUW
  makeHelpers,      // ← NIEUW
} from '@styles/modules';

const styleCache: Partial<Record<Theme, ReturnType<typeof StyleSheet.create>>> = {};

export function getAppStyles(theme: Theme) {
  if (styleCache[theme]) return styleCache[theme]!;
  const c = Colors[theme];

  const assembled = {
    ...makeLayout(c), // Layout
    ...makeHeader(c), // Header
    ...makeForms(c), // Forms
    ...makeButtons(c), // Buttons
    ...makeCards(c), // Cards
    ...makeChips(c), // Chips
    ...makeDashboard(c), // Dashboard
    ...makeSummary(c), // Summary
    ...makeTypography(c), // Typography
    ...makeAlerts(c), // Alerts
    ...makeToggles(c),      // ←Toggles NIEUW
    ...makeCheckboxes(c),   // ← Checkboxes NIEUW
    ...makeHelpers(c),      // ← Helpers NIEUW
  } as const;

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
