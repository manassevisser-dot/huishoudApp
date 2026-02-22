/**
 * @file_intent Definieert stijlen voor checkboxes.
 * @repo_architecture Domain Layer - Styles. Dit bestand bevat een functie die een stijlobject retourneert voor checkboxes, gebaseerd op een kleurenschema.
 * @term_definition
 *   - `ColorScheme`: Een object dat de kleuren voor de applicatie definieert.
 *   - `makeCheckboxes`: Een functie die een stijlobject voor checkboxes retourneert.
 * @contract De `makeCheckboxes` functie retourneert een object met stijlen voor checkboxes. Deze stijlen zijn afhankelijk van het `ColorScheme` object dat als argument wordt meegegeven.
 * @ai_instruction Om de stijlen van checkboxes aan te passen, kun je de `makeCheckboxes` functie aanpassen. Je kunt nieuwe stijlen toevoegen of bestaande stijlen aanpassen. Zorg ervoor dat de stijlen die je toevoegt gebruik maken van de kleuren uit het `ColorScheme` object.
 */
// src/domain/styles/modules/Checkboxes.ts
import { Sizes } from '@domain/constants/Tokens';
import type { ColorScheme } from '@domain/constants/Colors';

export function makeCheckboxes(c: ColorScheme) {
  return {
    checkbox: {
      width: Sizes.checkbox,
      height: Sizes.checkbox,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: c.border,
      backgroundColor: c.surface,
    },
    checkboxSelected: {
      borderColor: c.primary,
      backgroundColor: c.primary,
    },
  } as const;
}

export type CheckboxStyles = ReturnType<typeof makeCheckboxes>;