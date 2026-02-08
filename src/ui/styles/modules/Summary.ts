// src/styles/modules/Summary.ts
import { Space, Type, Radius } from '@domain/constants/Tokens';
import type { ColorScheme } from '@domain/constants/Colors';

/**
 * Losse definitie van stijlen om de functie-omvang klein te houden (ESLint)
 */
const getSummaryBase = (c: ColorScheme) => ({
  summarySection: {
    backgroundColor: c.surface,
    padding: Space.xl,
    borderRadius: Radius.xl,
    marginBottom: Space.xl,
  },
  summaryRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: Space.sm,
    borderBottomWidth: 1,
    borderBottomColor: c.borderSubtle,
  },
  summaryRowTotal: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: Space.sm,
    borderBottomWidth: 0,
    paddingTop: Space.md,
    marginTop: Space.sm,
    borderTopWidth: 2,
    borderTopColor: c.border,
  },
});

const getSummaryText = (c: ColorScheme) => ({
  summaryLabel: { fontSize: Type.md, color: c.textSecondary },
  summaryLabelBold: { fontSize: Type.md, fontWeight: '700' as const, color: c.textPrimary },
  summaryValue: { fontSize: Type.md, fontWeight: '600' as const, color: c.textPrimary },
  // FIX: Gebruik Type token in plaats van magic number 18
  summaryValueBold: { fontSize: Type.lg, fontWeight: '700' as const, color: c.textPrimary },
  summaryDetail: { fontSize: Type.sm, color: c.textSecondary, marginBottom: Space.xl },
});

/**
 * Fabriek: samenvattingsoverzicht (rijen, totalen, labels/values)
 * Nu ruim onder de 30 regels.
 */
export function makeSummary(c: ColorScheme) {
  return {
    ...getSummaryBase(c),
    ...getSummaryText(c),
  } as const;
}

export type SummaryStyles = ReturnType<typeof makeSummary>;