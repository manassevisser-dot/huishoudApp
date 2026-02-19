// src/domain/styles/modules/Summary.ts
import { Space, Type, Radius } from '@domain/constants/Tokens';
import { Layout } from '@domain/constants/LayoutTokens';
import type { ColorScheme } from '@domain/constants/Colors';

// NOTE: summarySection/summaryRow/summaryRowTotal staan ook in Cards.ts
// TODO: consolideren naar één eigenaar (Summary of Cards)

export function makeSummary(c: ColorScheme) {
  return {
    // ── Structuur ──────────────────────────────────
    summarySection: {
      backgroundColor: c.surface,
      padding: Space.xl,
      borderRadius: Radius.xl,
      marginBottom: Space.xl,
    },
    summaryRow: {
      ...Layout.rowBetween,
      paddingVertical: Space.sm,
      borderBottomWidth: 1,
      borderBottomColor: c.borderSubtle,
    },
    summaryRowTotal: {
      ...Layout.rowBetween,
      paddingVertical: Space.sm,
      borderBottomWidth: 0,
      paddingTop: Space.md,
      marginTop: Space.sm,
      borderTopWidth: 2,
      borderTopColor: c.border,
    },

    // ── Tekst ──────────────────────────────────────
    summaryLabel: { fontSize: Type.md, color: c.textSecondary },
    summaryLabelBold: { fontSize: Type.md, fontWeight: '700' as const, color: c.textPrimary },
    summaryValue: { fontSize: Type.md, fontWeight: '600' as const, color: c.textPrimary },
    summaryValueBold: { fontSize: Type.lg, fontWeight: '700' as const, color: c.textPrimary },
    summaryDetail: { fontSize: Type.sm, color: c.textSecondary, marginBottom: Space.xl },
  } as const;
}

export type SummaryStyles = ReturnType<typeof makeSummary>;