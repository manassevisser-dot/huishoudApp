/**
 * @file_intent Definieert kaart-gerelateerde stijlen.
 * @repo_architecture Domain Layer - Styles. Dit bestand bevat een functie die een stijlobject retourneert voor kaarten, gebaseerd op een kleurenschema.
 * @term_definition
 *   - `ColorScheme`: Een object dat de kleuren voor de applicatie definieert.
 *   - `makeCards`: Een functie die een stijlobject voor kaarten retourneert.
 * @contract De `makeCards` functie retourneert een object met stijlen voor kaarten. Deze stijlen zijn afhankelijk van het `ColorScheme` object dat als argument wordt meegegeven.
 * @ai_instruction Om de stijlen van kaarten aan te passen, kun je de `makeCards` functie aanpassen. Je kunt nieuwe stijlen toevoegen of bestaande stijlen aanpassen. Zorg ervoor dat de stijlen die je toevoegt gebruik maken van de kleuren uit het `ColorScheme` object.
 */
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