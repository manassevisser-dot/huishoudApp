/**
 * @file DailyInputScreen.tsx
 * @description This file contains the DailyInputScreen component, which allows users to input their daily expenses.
 * @requires react
 * @requires react-native
 * @requires @ui/sections/fields/MoneyEntry
 * @requires @domain/registry/PrimitiveRegistry
 * @requires @domain/constants/Tokens
 * @requires @domain/constants/LayoutTokens
 * @requires @ui/styles/useAppStyles
 */
import React, { useMemo, useState, memo } from 'react';
import { View, StyleSheet } from 'react-native';
import MoneyEntry from '@ui/sections/fields/MoneyEntry';
import type { CurrencyViewModel } from '@domain/registry/PrimitiveRegistry';
import { Tokens } from '@domain/constants/Tokens';
import { Layout } from '@domain/constants/LayoutTokens';
import { useAppStyles } from '@ui/styles/useAppStyles';

const DailyInputScreen = memo(() => {
  const [amountCents, setAmountCents] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useAppStyles();

  const styles = useMemo(() => StyleSheet.create({
    container: { ...Layout.relative, paddingVertical: Tokens.Space.md },
    label: { fontSize: Tokens.Type.lg, fontWeight: '600', color: colors.textPrimary },
    error: { color: colors.error, marginTop: Tokens.Space.xs },
  }), [colors]);

  const vm: CurrencyViewModel = useMemo(() => ({
    fieldId: 'daily-amount-input',
    primitiveType: 'currency',
    label: 'Bedrag',
    value: amountCents,
    error: error,
    containerStyle: styles.container,
    labelStyle: styles.label,
    errorStyle: styles.error,
    onUpdate: (v: number) => {
      setAmountCents(v);
      if (v > 0) setError(null);
    },
  }), [amountCents, error, styles]);

  return (
    <View style={Layout.fullWidth}>
      <MoneyEntry viewModel={vm as any} />
    </View>
  );
});

export default DailyInputScreen;