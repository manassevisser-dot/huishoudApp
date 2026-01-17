// src/styles/modules/Forms.ts
// CU-008.3: Interactie (Forms) — semantische kleuren + Tokens, geen hardcoded hex
import { ViewStyle, TextStyle } from 'react-native';
import { Space, Type, Radius } from '@styles/Tokens';
import type { ColorScheme } from '@styles/Colors';

/**
 * Fabriek: form-velden (labels, inputs, numeric/money), foutmeldingen
 * Functie < 20 regels
 */
export function makeForms(c: ColorScheme) {
  return {
    // === OUDE ALIASES (voor backwards compatibility) ===
    label: {
      fontSize: Type.lg,
      fontWeight: '600',
      color: c.textPrimary,
      marginBottom: Space.sm,
    },
    labelError: { color: c.error },
    errorTextStyle: {
      color: c.error,
      marginTop: Space.xs,
      fontSize: Type.sm,
    },

    // === NIEUWE NAMEN (behouden) ===
    fieldContainer: { marginBottom: Space.lg },
    fieldLabel: {
      fontSize: Type.lg,
      fontWeight: '600',
      color: c.textPrimary,
      marginBottom: Space.sm,
    },
    fieldLabelError: { color: c.error },

    input: {
      backgroundColor: c.inputBackground,
      borderRadius: Radius.lg,
      padding: 14,
      fontSize: Type.lg,
      color: c.textPrimary,
      borderWidth: 1,
      borderColor: c.border,
    },
    inputError: { borderColor: c.error, borderWidth: 2 },
    errorText: {
      color: c.error,
      marginTop: Space.xs,
      fontSize: Type.sm,
    },

    // === NUMERIC & MONEY ===
    numericWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: c.inputBackground,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: c.border,
      paddingHorizontal: 14,
    },
    currencyPrefix: {
      fontSize: Type.lg,
      color: c.textTertiary,
      marginRight: Space.xs,
    },
    numericInput: {
      flex: 1,
      paddingVertical: 14,
      fontSize: Type.lg,
      color: c.textPrimary,
    },

    // Money row (nieuwe naam)
    moneyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: Radius.md,
      paddingHorizontal: Space.md,
      backgroundColor: c.inputBackground,
      height: 48,
    },
    moneyPrefix: {
      fontSize: Type.md,
      fontWeight: '600',
      color: c.textSecondary,
      marginRight: Space.xs,
    },
    moneyTextInput: {
      flex: 1,
      height: '100%',
      fontSize: Type.md,
      color: c.textPrimary,
      paddingVertical: 0,
    },

    // Legacy alias (oude naam)
    inputMoneyRow: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 8,
      paddingHorizontal: Space.md,
      backgroundColor: c.inputBackground,
      height: 48,
    },

    helperText: {
      fontSize: Type.xs,
      color: c.textSecondary,
      marginTop: Space.xs,
    },
    moneyInputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 8,
      paddingHorizontal: Space.md,
      backgroundColor: c.inputBackground,
      height: 48,
    } as ViewStyle,

    currencySymbol: {
      fontSize: Type.lg,
      color: c.textSecondary,
      marginRight: Space.sm,
    } as TextStyle,

    textInput: { flex: 1, height: 48, fontSize: Type.md, color: c.textPrimary } as TextStyle,
  } as const;
}

export type FormStyles = ReturnType<typeof makeForms>;
