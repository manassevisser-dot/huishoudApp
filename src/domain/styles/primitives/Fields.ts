// src/domain/styles/modules/Forms.ts
import { Space, Type, Radius } from '@domain/constants/Tokens';
import { Layout } from '@domain/constants/LayoutTokens';
import type { ColorScheme } from '@domain/constants/Colors';

function makeFormLabels(c: ColorScheme) {
  return {
    label: { fontSize: Type.lg, fontWeight: '600' as const, color: c.textPrimary, marginBottom: Space.sm },
    labelError: { color: c.error },
    errorTextStyle: { color: c.error, marginTop: Space.xs, fontSize: Type.sm },
    entryLabel: { fontSize: Type.lg, fontWeight: '600' as const, color: c.textPrimary, marginBottom: Space.sm },
    entryLabelError: { color: c.error },
    errorText: { color: c.error, marginTop: Space.xs, fontSize: Type.sm },
    helperText: { fontSize: Type.xs, color: c.textSecondary, marginTop: Space.xs },
  };
}

function makeMoneyInputs(c: ColorScheme) {
  return {
    moneyRow: {
      ...Layout.rowCenter,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: Radius.md,
      paddingHorizontal: Space.md,
      backgroundColor: c.inputBackground,
      height: 48,
    },
    moneyPrefix: { fontSize: Type.md, fontWeight: '600' as const, color: c.textSecondary, marginRight: Space.xs },
    moneyTextInput: {
      ...Layout.fullWidth,
      height: '100%' as const,
      fontSize: Type.md,
      color: c.textPrimary,
      paddingVertical: 0,
    },
  };
}

function makeNumericInputs(c: ColorScheme) {
  return {
    numericWrapper: {
      ...Layout.rowCenter,
      backgroundColor: c.inputBackground,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: c.border,
      paddingHorizontal: 14,
    },
    currencyPrefix: { fontSize: Type.lg, color: c.textTertiary, marginRight: Space.xs },
    numericInput: { ...Layout.fullWidth, paddingVertical: 14, fontSize: Type.lg, color: c.textPrimary },
    ...makeMoneyInputs(c),
  };
}

function makeFormInputs(c: ColorScheme) {
  return {
    entryContainer: { marginBottom: Space.lg },
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
    ...makeNumericInputs(c),
  };
}

function makeFormLegacy(c: ColorScheme) {
  return {
    inputMoneyRow: {
      ...Layout.rowCenter,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 8,
      paddingHorizontal: Space.md,
      backgroundColor: c.inputBackground,
      height: 48,
    },
    moneyInputWrapper: {
      ...Layout.rowCenter,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 8,
      paddingHorizontal: Space.md,
      backgroundColor: c.inputBackground,
      height: 48,
    },
    currencySymbol: { fontSize: Type.lg, color: c.textSecondary, marginRight: Space.sm },
    textInput: { ...Layout.fullWidth, height: 48, fontSize: Type.md, color: c.textPrimary },
  };
}

export function makeForms(c: ColorScheme) {
  return {
    ...makeFormLabels(c),
    ...makeFormInputs(c),
    ...makeFormLegacy(c),
  } as const;
}

export type FormStyles = ReturnType<typeof makeForms>;