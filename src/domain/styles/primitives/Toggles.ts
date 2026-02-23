/**
 * @file_intent Definieert stijlen voor toggles.
 * @repo_architecture Domain Layer - Styles. Dit bestand bevat een functie die een stijlobject retourneert voor toggles, gebaseerd op een kleurenschema.
 * @term_definition
 *   - `ColorScheme`: Een object dat de kleuren voor de applicatie definieert.
 *   - `makeToggles`: Een functie die een stijlobject voor toggles retourneert.
 * @contract De `makeToggles` functie retourneert een object met stijlen voor toggles. Deze stijlen zijn afhankelijk van het `ColorScheme` object dat als argument wordt meegegeven.
 * @ai_instruction Om de stijlen van toggles aan te passen, kun je de `makeToggles` functie aanpassen. Je kunt nieuwe stijlen toevoegen of bestaande stijlen aanpassen. Zorg ervoor dat de stijlen die je toevoegt gebruik maken van de kleuren uit het `ColorScheme` object.
 */
// src/domain/styles/modules/Toggles.ts
import { Space, Type } from '@domain/constants/Tokens';
import { Layout } from '@domain/constants/LayoutTokens';
import type { ColorScheme } from '@domain/constants/Colors';

export function makeToggles(c: ColorScheme) {
  return {
    toggleWrapper: {
      ...Layout.row,
      justifyContent: 'flex-start' as const,
    },
    toggleButton: {
      ...Layout.centered,
      paddingHorizontal: Space.xl,
      paddingVertical: Space.sm,
      borderRadius: 8,
      minWidth: 80,
    },
    toggleActive: { backgroundColor: c.success },
    toggleInactive: { backgroundColor: c.secondary },
    toggleText: { fontSize: Type.lg, fontWeight: '600' as const, color: c.onSuccess },
  } as const;
}

export type ToggleStyles = ReturnType<typeof makeToggles>;
