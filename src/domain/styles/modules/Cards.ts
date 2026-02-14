// src/domain/styles/modules/Cards.ts
import { Space, Radius, Type } from '@domain/constants/Tokens';
import { Layout } from '@domain/constants/LayoutTokens';
import type { ColorScheme } from '@domain/constants/Colors';

// Shadow: level1 op 'card' — gedeclareerd in PlatformStyles.SHADOW_MAP

function makeSummaryRows(c: ColorScheme) {
  return {
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
  };
}

export function makeCards(c: ColorScheme) {
  return {
    card: {
      backgroundColor: c.surface,
      borderRadius: 12,
      padding: Space.lg,
      marginBottom: Space.md,
    },
    cardSwipe: {
      ...Layout.relative,
      marginBottom: Space.md,
      paddingBottom: 22,
    },
    section: { marginBottom: Space.xl },
    sectionTitle: {
      fontSize: Type.lg,
      fontWeight: '700' as const,
      marginBottom: Space.md,
      color: c.textPrimary,
    },
    ...makeSummaryRows(c),
  } as const;
}

export type CardsStyles = ReturnType<typeof makeCards>;