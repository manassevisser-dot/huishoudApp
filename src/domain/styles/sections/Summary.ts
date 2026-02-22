/**
 * @file_intent Definieert stijlen voor de overzichtssectie.
 * @repo_architecture Domain Layer - Styles. Dit bestand bevat een functie die een stijlobject retourneert voor de overzichtssectie, gebaseerd op een kleurenschema.
 * @term_definition
 *   - `ColorScheme`: Een object dat de kleuren voor de applicatie definieert.
 *   - `makeSummary`: Een functie die een stijlobject voor de overzichtssectie retourneert.
 * @contract De `makeSummary` functie retourneert een object met stijlen voor de overzichtssectie. Deze stijlen zijn afhankelijk van het `ColorScheme` object dat als argument wordt meegegeven.
 * @ai_instruction Om de stijlen van de overzichtssectie aan te passen, kun je de `makeSummary` functie aanpassen. Je kunt nieuwe stijlen toevoegen of bestaande stijlen aanpassen. Zorg ervoor dat de stijlen die je toevoegt gebruik maken van de kleuren uit het `ColorScheme` object.
 */
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