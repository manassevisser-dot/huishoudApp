/**
 * @file_intent Definieert stijlen voor alerts.
 * @repo_architecture Domain Layer - Styles. Dit bestand bevat een functie die een stijlobject retourneert voor alerts, gebaseerd op een kleurenschema.
 * @term_definition
 *   - `ColorScheme`: Een object dat de kleuren voor de applicatie definieert.
 *   - `makeAlerts`: Een functie die een stijlobject voor alerts retourneert.
 * @contract De `makeAlerts` functie retourneert een object met stijlen voor alerts. Deze stijlen zijn afhankelijk van het `ColorScheme` object dat als argument wordt meegegeven.
 * @ai_instruction Om de stijlen van alerts aan te passen, kun je de `makeAlerts` functie aanpassen. Je kunt nieuwe stijlen toevoegen of bestaande stijlen aanpassen. Zorg ervoor dat de stijlen die je toevoegt gebruik maken van de kleuren uit het `ColorScheme` object.
 */
// src/domain/styles/modules/Alerts.ts
import { Space, Type } from '@domain/constants/Tokens';
import type { ColorScheme } from '@domain/constants/Colors';

export function makeAlerts(c: ColorScheme) {
  return {
    alertErrorText: {
      color: c.error,
      fontSize: Type.sm,
      marginTop: Space.xs,
      marginLeft: Space.xs,
      fontWeight: '600' as const,
    },
    alertWarningText: {
      color: c.warning,
      fontSize: Type.sm,
      marginTop: Space.xs,
      marginLeft: Space.xs,
    },

    // Legacy aliases — opruimen zodra screens gemigreerd zijn
    warningTextOrange: {
      color: c.warning,
      fontSize: Type.sm,
      marginTop: Space.xs,
      marginLeft: Space.xs,
    },
    warningTextRed: {
      color: c.error,
      fontSize: Type.sm,
      marginTop: Space.xs,
      marginLeft: Space.xs,
      fontWeight: '600' as const,
    },
  } as const;
}

export type AlertStyles = ReturnType<typeof makeAlerts>;