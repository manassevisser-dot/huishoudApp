// src/styles/AppStyles.ts

import { StyleSheet } from 'react-native';
import { Colors, Theme } from './Colors';

// StyleSheet cache - prevents recreation on every render
const styleCache: Partial<Record<Theme, ReturnType<typeof StyleSheet.create>>> = {};

/**
 * Dynamic style factory - creates theme-aware StyleSheet
 * 
 * Performance:
 *   - First call per theme: Creates and caches StyleSheet (~5-10ms)
 *   - Subsequent calls: Returns cached reference (~0.01ms)
 *   - Memory: 2 StyleSheets total (light + dark)
 * 
 * @param theme - 'light' or 'dark'
 * @returns Cached StyleSheet for the specified theme
 */
export function getAppStyles(theme: Theme) {
  // Return cached styles if they exist
  if (styleCache[theme]) {
    return styleCache[theme]!;
  }
  
  const c = Colors[theme];

  const styles = StyleSheet.create({
    // === CONTAINERS ===
    container: { flex: 1, backgroundColor: c.background },
    pageContainer: { flex: 1, paddingTop: 10 },
    scrollContent: { paddingBottom: 120, paddingHorizontal: 20 },

    // === HEADERS ===
    pageTitle: { fontSize: 28, fontWeight: '700', marginBottom: 24, color: c.textPrimary },
    headerBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
      backgroundColor: c.background,
    },
    headerTitle: { fontSize: 17, fontWeight: '600', color: c.textPrimary },
    headerButton: { padding: 8 },
    headerButtonText: { fontSize: 17, color: c.primary },

    // === FIELDS ===
    fieldContainer: { marginBottom: 20 },
    label: { fontSize: 17, fontWeight: '600', color: c.textPrimary, marginBottom: 8 },
    labelError: { color: c.error },
    input: { backgroundColor: c.inputBackground, borderRadius: 10, padding: 14, fontSize: 17, color: c.textPrimary, borderWidth: 1, borderColor: c.border },
    numericWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.inputBackground,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: c.border,
      paddingHorizontal: 14,
    },
    currencyPrefix: { fontSize: 17, color: c.textTertiary, marginRight: 4 },
    numericInput: { flex: 1, paddingVertical: 14, fontSize: 17, color: c.textPrimary },
    inputError: { borderColor: c.error, borderWidth: 2 },
    errorText: { color: c.error, marginTop: 6, fontSize: 13 },

    // === WARNINGS ===
    warningTextOrange: { color: c.warning, fontSize: 14, marginTop: 4, marginLeft: 4 },
    warningTextRed: { color: c.error, fontSize: 14, marginTop: 4, marginLeft: 4, fontWeight: '600' },

    // === NAVIGATION HINT ===
    navigationHint: { fontSize: 14, color: c.textTertiary, textAlign: 'right', marginTop: 12, marginRight: 8, fontStyle: 'italic' },

    // === GRID FOR CATEGORIES ===
    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -5 },
    gridItem: {
      width: '30%',
      flexGrow: 1,
      backgroundColor: c.card,
      paddingVertical: 16,
      paddingHorizontal: 8,
      margin: 5,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: c.border,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
    },
    gridItemSelected: { backgroundColor: c.selected, borderColor: c.selected },
    gridItemText: { fontSize: 14, fontWeight: '600', color: c.textPrimary, textAlign: 'center' },
    gridItemTextSelected: { color: c.selectedText },

    // === BUTTONS ===
    buttonContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 20,
      backgroundColor: c.background,
      borderTopWidth: 1,
      borderTopColor: c.border,
    },
    button: { flex: 1, backgroundColor: c.primary, padding: 16, borderRadius: 10, alignItems: 'center', marginLeft: 10 },
    buttonText: { color: c.primaryText, fontSize: 17, fontWeight: '700' },
    secondaryButton: { backgroundColor: c.secondary, marginLeft: 0, marginRight: 10 },
    secondaryButtonText: { color: c.secondaryText, fontSize: 17, fontWeight: '600' },

    // === TOGGLES & CHIPS ===
    toggleWrapper: { flexDirection: 'row', justifyContent: 'flex-start' },
    toggleButton: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, minWidth: 80, alignItems: 'center' },
    toggleActive: { backgroundColor: c.success },
    toggleInactive: { backgroundColor: c.secondary },
    toggleText: { fontSize: 17, fontWeight: '600', color: c.successText },
    chipContainer: { flexDirection: 'row', paddingVertical: 4 },
    chip: { backgroundColor: c.secondary, paddingVertical: 10, paddingHorizontal: 16, borderRadius: 20, marginRight: 10, borderWidth: 1, borderColor: c.border },
    chipSelected: { backgroundColor: c.selected, borderColor: c.selected },
    chipError: { borderColor: c.error, borderWidth: 2 },
    chipText: { fontSize: 15, color: c.textPrimary, fontWeight: '500' },
    chipTextSelected: { color: c.selectedText, fontWeight: '600' },

    // === CHECKBOXES ===
    checkbox: { width: 24, height: 24, borderRadius: 4, borderWidth: 2, borderColor: c.border, backgroundColor: c.card },
    checkboxSelected: { borderColor: c.primary, backgroundColor: c.primary },

    // === DASHBOARD ===
    dashboardCard: { backgroundColor: c.card, padding: 20, borderRadius: 12, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8 },
    dashboardLabel: { fontSize: 16, color: c.textSecondary, marginBottom: 8 },
    dashboardKPI: { fontSize: 48, fontWeight: '700', marginBottom: 16 },
    dashboardMessage: { fontSize: 16, color: c.textPrimary, lineHeight: 24 },

    summarySection: { backgroundColor: c.card, padding: 20, borderRadius: 12, marginBottom: 24 },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: c.borderLight },
    summaryRowTotal: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 0, paddingTop: 16, marginTop: 8, borderTopWidth: 2, borderTopColor: c.border },
    summaryLabel: { fontSize: 16, color: c.textSecondary },
    summaryLabelBold: { fontSize: 16, fontWeight: '700', color: c.textPrimary },
    summaryValue: { fontSize: 16, fontWeight: '600', color: c.textPrimary },
    summaryValueBold: { fontSize: 18, fontWeight: '700' },
    summaryDetail: { fontSize: 14, color: c.textSecondary, marginBottom: 20 },
  });

  styleCache[theme] = styles;
  return styles;
}

// Type alias voor autocompletion en type safety
export type AppStyles = ReturnType<typeof getAppStyles>;
