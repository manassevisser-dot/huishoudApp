// src/styles/modules/Cards.ts
import { Platform } from 'react-native';
import { Space, Radius, Type } from '@domain/constants/Tokens';
import type { ColorScheme } from '@domain/constants/Colors';

// Helper voor schaduwen om de hoofd-functie kort te houden
const getCardShadow = (c: ColorScheme) => Platform.select({
  ios: {
    shadowColor: c.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  android: { elevation: 3 },
  default: {},
});

const getSummaryElements = (c: ColorScheme) => ({
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

/**
 * Fabriek: kaart-/sectiestijlen voor datavisualisatie
 */
export function makeCards(c: ColorScheme) {
  const shadow = getCardShadow(c);

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
      position: 'relative' as const,
    },
    section: { marginBottom: Space.xl },
    sectionTitle: {
      fontSize: Type.lg, // FIX: was 18, nu Token
      fontWeight: '700' as const,
      marginBottom: Space.md,
      color: c.textPrimary,
    },
    ...getSummaryElements(c),
  } as const;
}

export type CardsStyles = ReturnType<typeof makeCards>;