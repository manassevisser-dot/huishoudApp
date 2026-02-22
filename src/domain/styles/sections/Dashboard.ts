/**
 * @file_intent Definieert stijlen voor de dashboard sectie.
 * @repo_architecture Domain Layer - Styles. Dit bestand bevat een functie die een stijlobject retourneert voor de dashboard sectie, gebaseerd op een kleurenschema.
 * @term_definition
 *   - `ColorScheme`: Een object dat de kleuren voor de applicatie definieert.
 *   - `makeDashboard`: Een functie die een stijlobject voor de dashboard sectie retourneert.
 * @contract De `makeDashboard` functie retourneert een object met stijlen voor de dashboard sectie. Deze stijlen zijn afhankelijk van het `ColorScheme` object dat als argument wordt meegegeven.
 * @ai_instruction Om de stijlen van de dashboard sectie aan te passen, kun je de `makeDashboard` functie aanpassen. Je kunt nieuwe stijlen toevoegen of bestaande stijlen aanpassen. Zorg ervoor dat de stijlen die je toevoegt gebruik maken van de kleuren uit het `ColorScheme` object.
 */
// src/domain/styles/modules/Dashboard.ts
import { Space, Type, Radius } from '@domain/constants/Tokens';
import type { ColorScheme } from '@domain/constants/Colors';

// Shadow: level3 op 'dashboardCard' — gedeclareerd in PlatformStyles.SHADOW_MAP

export function makeDashboard(c: ColorScheme) {
  return {
    dashboardCard: {
      backgroundColor: c.surface,
      padding: Space.xl,
      borderRadius: Radius.xl,
      marginBottom: Space.xl,
      // shadow wordt toegepast door PlatformStyles.applyShadows
    },
    dashboardLabel: {
      fontSize: Type.md,
      color: c.textSecondary,
      marginBottom: Space.sm,
    },
    dashboardKPI: {
      fontSize: 48,
      fontWeight: '700' as const,
      marginBottom: Space.md,
      color: c.textPrimary,
    },
    dashboardMessage: {
      fontSize: Type.md,
      color: c.textPrimary,
      lineHeight: 24,
    },
  } as const;
}

export type DashboardStyles = ReturnType<typeof makeDashboard>;