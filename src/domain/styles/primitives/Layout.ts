/**
 * @file_intent Definieert layout-gerelateerde stijlen.
 * @repo_architecture Domain Layer - Styles. Dit bestand bevat een functie die een stijlobject retourneert voor layout, gebaseerd op een kleurenschema.
 * @term_definition
 *   - `ColorScheme`: Een object dat de kleuren voor de applicatie definieert.
 *   - `makeLayout`: Een functie die een stijlobject voor layout retourneert.
 * @contract De `makeLayout` functie retourneert een object met stijlen voor layout. Deze stijlen zijn afhankelijk van het `ColorScheme` object dat als argument wordt meegegeven.
 * @ai_instruction Om de layout stijlen aan te passen, kun je de `makeLayout` functie aanpassen. Je kunt nieuwe stijlen toevoegen of bestaande stijlen aanpassen. Zorg ervoor dat de stijlen die je toevoegt gebruik maken van de kleuren uit het `ColorScheme` object.
 */
// src/domain/styles/modules/Layout.ts
import { Space } from '@domain/constants/Tokens';
import { Layout } from '@domain/constants/LayoutTokens';
import type { ColorScheme } from '@domain/constants/Colors';

export function makeLayout(c: ColorScheme) {
  return {
    container: { ...Layout.fullWidth, backgroundColor: c.background },
    screenContainer: { ...Layout.fullWidth, paddingTop: Space.sm },
    scrollContent: { paddingBottom: 120, paddingHorizontal: Space.xl },
    inputContainer: { marginBottom: Space.md, width: '100%' as const },
    content: { padding: Space.lg },
    section: { marginTop: Space.xl },
  } as const;
}

export type LayoutStyles = ReturnType<typeof makeLayout>;