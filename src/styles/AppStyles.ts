// src/styles/AppStyles.ts
import { StyleSheet } from 'react-native';
import Colors from './Colors';

export const getAppStyles = (theme: 'light' | 'dark') => {
  const c = Colors[theme];

  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    pageContainer: {
      flex: 1,
      paddingTop: 10,
    },
    scrollContent: {
      paddingHorizontal: 20,
    },
    pageTitle: {
      fontSize: 28,
      fontWeight: '700',
      marginBottom: 24,
      color: c.text,
    },
    headerBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
      backgroundColor: c.card,
    },
    headerTitle: {
      fontSize: 17,
      fontWeight: '600',
      color: c.text,
    },
    headerButton: {
      padding: 8,
    },
    headerButtonText: {
      fontSize: 17,
      color: c.primary,
    },
    fieldContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 17,
      fontWeight: '600',
      color: c.text,
      marginBottom: 8,
    },
    labelError: {
      color: c.error,
    },
    input: {
      backgroundColor: c.input,
      borderRadius: 10,
      padding: 14,
      fontSize: 17,
      color: c.text,
      borderWidth: 1,
      borderColor: c.border,
    },
    numericWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.input,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: c.border,
      paddingHorizontal: 14,
    },
    currencyPrefix: {
      fontSize: 17,
      color: c.subtleText,
      marginRight: 4,
    },
    numericInput: {
      flex: 1,
      paddingVertical: 14,
      fontSize: 17,
      color: c.text,
    },
    inputError: {
      borderColor: c.error,
      borderWidth: 2,
    },
    errorText: {
      color: c.error,
      marginTop: 6,
      fontSize: 13,
    },
    warningTextOrange: {
      color: c.warning,
      fontSize: 14,
      marginTop: 4,
      marginLeft: 4,
    },
    warningTextRed: {
      color: c.error,
      fontSize: 14,
      marginTop: 4,
      marginLeft: 4,
      fontWeight: '600',
    },
    navigationHint: {
      fontSize: 14,
      color: c.subtleText,
      textAlign: 'right',
      marginTop: 12,
      marginRight: 8,
      fontStyle: 'italic',
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -5,
    },
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
    },
    gridItemSelected: {
      backgroundColor: c.primary,
      borderColor: c.primary,
    },
    gridItemText: {
      fontSize: 14,
      fontWeight: '600',
      color: c.text,
      textAlign: 'center',
    },
    gridItemTextSelected: {
      color: '#FFFFFF',
    },
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
    button: {
      flex: 1,
      backgroundColor: c.primary,
      padding: 16,
      borderRadius: 10,
      alignItems: 'center',
      marginLeft: 10,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 17,
      fontWeight: '700',
    },
    secondaryButton: {
      backgroundColor: c.secondary,
      marginLeft: 0,
      marginRight: 10,
    },
    secondaryButtonText: {
      color: c.secondaryText,
      fontSize: 17,
      fontWeight: '600',
    },
    toggleWrapper: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    toggleButton: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      borderRadius: 8,
      minWidth: 80,
      alignItems: 'center',
    },
    toggleActive: {
      backgroundColor: c.success,
    },
    toggleInactive: {
      backgroundColor: c.secondary,
    },
    toggleText: {
      fontSize: 17,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    chipContainer: {
      flexDirection: 'row',
      paddingVertical: 4,
    },
    chip: {
      backgroundColor: c.secondary,
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 20,
      marginRight: 10,
      borderWidth: 1,
      borderColor: c.border,
    },
    chipSelected: {
      backgroundColor: c.primary,
      borderColor: c.primary,
    },
    chipError: {
      borderColor: c.error,
      borderWidth: 2,
    },
    chipText: {
      fontSize: 15,
      color: c.text,
      fontWeight: '500',
    },
    chipTextSelected: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
    dashboardCard: {
      backgroundColor: c.card,
      padding: 20,
      borderRadius: 12,
      marginBottom: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: theme === 'light' ? 0.1 : 0.2,
      shadowRadius: 8,
      borderLeftWidth: 5,
      borderLeftColor: c.primary,
      borderBottomWidth: 5,
      borderBottomColor: c.primary,
    },
    dashboardLabel: {
      fontSize: 16,
      color: c.subtleText,
      marginBottom: 8,
    },
    dashboardKPI: {
      fontSize: 48,
      fontWeight: '700',
      marginBottom: 16,
      color: c.text,
    },
    dashboardMessage: {
      fontSize: 16,
      color: c.text,
      lineHeight: 24,
    },
    summarySection: {
      backgroundColor: c.card,
      padding: 20,
      borderRadius: 12,
      marginBottom: 24,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
    },
    summaryRowTotal: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: 12,
      marginTop: 8,
      borderTopWidth: 2,
      borderTopColor: c.border,
    },
    summaryLabel: {
      fontSize: 16,
      color: c.subtleText,
    },
    summaryLabelBold: {
      fontSize: 16,
      fontWeight: '700',
      color: c.text,
    },
    summaryValue: {
      fontSize: 16,
      fontWeight: '600',
      color: c.text,
    },
    summaryValueBold: {
      fontSize: 18,
      fontWeight: '700',
      color: c.text,
    },
    summaryDetail: {
      fontSize: 14,
      color: c.subtleText,
      marginBottom: 20,
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: c.border,
      backgroundColor: 'transparent',
    },
    checkboxSelected: {
      backgroundColor: c.primary,
      borderColor: c.primary,
    },
    loadingText: {
        marginTop: 10,
        color: c.text
    }
  });
};
