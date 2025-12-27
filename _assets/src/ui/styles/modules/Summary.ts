// src/styles/modules/Summary.ts
// CU-008.5: Informatie (Summary) — tabellen/overzicht; GEEN HHS5-specifieke code
import { Space, Type, Radius } from '@styles/Tokens';
import type { ColorScheme } from '@styles/Colors';

/**
 * Fabriek: samenvattingsoverzicht (rijen, totalen, labels/values)
 * Functie < 20 regels
 */
export function makeSummary(c: ColorScheme) {
  return {
    summarySection: {
      backgroundColor: c.surface,
      padding: Space.xl,
      borderRadius: Radius.xl,
      marginBottom: Space.xl,
    },
    summaryRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: Space.sm,
      borderBottomWidth: 1,
      borderBottomColor: c.borderSubtle,
    },
    summaryRowTotal: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingVertical: Space.sm,
      borderBottomWidth: 0,
      paddingTop: Space.md,
      marginTop: Space.sm,
      borderTopWidth: 2,
      borderTopColor: c.border,
    },
    summaryLabel: { fontSize: Type.md, color: c.textSecondary },
    summaryLabelBold: { fontSize: Type.md, fontWeight: '700', color: c.textPrimary },
    summaryValue: { fontSize: Type.md, fontWeight: '600', color: c.textPrimary },
    summaryValueBold: { fontSize: 18, fontWeight: '700', color: c.textPrimary },
    summaryDetail: { fontSize: Type.sm, color: c.textSecondary, marginBottom: Space.xl },
  } as const;
}

export type SummaryStyles = ReturnType<typeof makeSummary>;
``;
