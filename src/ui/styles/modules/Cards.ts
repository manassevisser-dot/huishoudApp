// src/styles/modules/Cards.ts
// CU-008.4: Data Visualisatie (Cards) — gebruikt surface, border, Shadows; geen hardcoded hex
import { Platform } from 'react-native';
import { Space, Radius } from '@styles/Tokens';
import type { ColorScheme } from '@styles/Colors';

/**
 * Fabriek: kaart-/sectiestijlen voor datavisualisatie
 * Functie < 20 regels
 */
// 7. UPDATE: src/styles/modules/Cards.ts
// ============================================
// HERSTEL naar EXACTE oude shadow waarden:

export function makeCards(c: ColorScheme) {
  // OUDE waarden: shadowOffset y: 2, opacity: 0.1, radius: 4, elevation: 3
  const shadow = Platform.select({
    ios: {
      shadowColor: c.shadow,
      shadowOffset: { width: 0, height: 2 }, // was: sh.ios.y
      shadowOpacity: 0.1, // was: sh.ios.opacity
      shadowRadius: 4, // was: sh.ios.radius
    },
    android: { elevation: 3 }, // was: sh.android.elevation
    default: {},
  });

  return {
    card: {
      backgroundColor: c.surface,
      borderRadius: 12,
      padding: Space.lg,
      marginBottom: Space.md,
      ...shadow,
    },
    cardSwipe: {
      marginBottom: Space.md,
      paddingBottom: 22,
      position: 'relative',
    },
    section: { marginBottom: Space.xl },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: Space.md,
      color: c.textPrimary,
    },
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
  } as const;
}
