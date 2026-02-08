// src/styles/modules/Forms.ts
import { ViewStyle, TextStyle } from 'react-native';
import { Space, Type, Radius } from '@domain/constants/Tokens';
import type { ColorScheme } from '@domain/constants/Colors';

// 1. Labels & Error meldingen
const getLabelStyles = (c: ColorScheme) => ({
  label: { fontSize: Type.lg, fontWeight: '600' as const, color: c.textPrimary, marginBottom: Space.sm },
  labelError: { color: c.error },
  errorTextStyle: { color: c.error, marginTop: Space.xs, fontSize: Type.sm },
  fieldLabel: { fontSize: Type.lg, fontWeight: '600' as const, color: c.textPrimary, marginBottom: Space.sm },
  fieldLabelError: { color: c.error },
  errorText: { color: c.error, marginTop: Space.xs, fontSize: Type.sm },
  helperText: { fontSize: Type.xs, color: c.textSecondary, marginTop: Space.xs },
});

// 2. Standaard Input velden
const getInputStyles = (c: ColorScheme) => ({
  fieldContainer: { marginBottom: Space.lg },
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
});

// 3. Numerieke & Geld velden
const getNumericStyles = (c: ColorScheme) => ({
  numericWrapper: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    backgroundColor: c.inputBackground,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: c.border,
    paddingHorizontal: 14,
  },
  currencyPrefix: { fontSize: Type.lg, color: c.textTertiary, marginRight: Space.xs },
  numericInput: { flex: 1, paddingVertical: 14, fontSize: Type.lg, color: c.textPrimary },
  moneyRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: Radius.md,
    paddingHorizontal: Space.md,
    backgroundColor: c.inputBackground,
    height: 48,
  },
  moneyPrefix: { fontSize: Type.md, fontWeight: '600' as const, color: c.textSecondary, marginRight: Space.xs },
  moneyTextInput: { flex: 1, height: '100%' as const, fontSize: Type.md, color: c.textPrimary, paddingVertical: 0 },
});

// 4. Legacy Aliases (Om niets te breken)
const getLegacyAliases = (c: ColorScheme) => ({
  inputMoneyRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 8,
    paddingHorizontal: Space.md,
    backgroundColor: c.inputBackground,
    height: 48,
  },
  moneyInputWrapper: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    borderWidth: 1,
    borderColor: c.border,
    borderRadius: 8,
    paddingHorizontal: Space.md,
    backgroundColor: c.inputBackground,
    height: 48,
  } as ViewStyle,
  currencySymbol: { fontSize: Type.lg, color: c.textSecondary, marginRight: Space.sm } as TextStyle,
  textInput: { flex: 1, height: 48, fontSize: Type.md, color: c.textPrimary } as TextStyle,
});

/**
 * Fabriek: form-velden
 * Orchestreert de verschillende sub-secties.
 */
export function makeForms(c: ColorScheme) {
  return {
    ...getLabelStyles(c),
    ...getInputStyles(c),
    ...getNumericStyles(c),
    ...getLegacyAliases(c),
  } as const;
}

export type FormStyles = ReturnType<typeof makeForms>;