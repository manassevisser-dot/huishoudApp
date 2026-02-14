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