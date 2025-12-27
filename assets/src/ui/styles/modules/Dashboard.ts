// src/styles/modules/Dashboard.ts
// CU-008.5: Informatie (Dashboard) — KPI blocks, labels/message; semantisch en tokens-based
import { Platform } from 'react-native';
import { Space, Type, Radius, Tokens } from '@styles/Tokens';
import type { ColorScheme } from '@styles/Colors';

/**
 * Fabriek: dashboard-kaarten voor KPI's en korte berichten
 * Functie < 20 regels
 */
export function makeDashboard(c: ColorScheme) {
  const sh = Tokens.Shadows.level3;
  const shadow = Platform.select({
    ios: {
      shadowColor: c.shadow,
      shadowOffset: { width: 0, height: sh.ios.y },
      shadowOpacity: sh.ios.opacity,
      shadowRadius: sh.ios.radius,
    },
    android: { elevation: sh.android.elevation },
    default: {},
  });
  return {
    dashboardCard: {
      backgroundColor: c.surface,
      padding: Space.xl,
      borderRadius: Radius.xl,
      marginBottom: Space.xl,
      ...shadow,
    },
    dashboardLabel: { fontSize: Type.md, color: c.textSecondary, marginBottom: Space.sm },
    dashboardKPI: { fontSize: 48, fontWeight: '700', marginBottom: Space.md, color: c.textPrimary },
    dashboardMessage: { fontSize: Type.md, color: c.textPrimary, lineHeight: 24 },
  } as const;
}

export type DashboardStyles = ReturnType<typeof makeDashboard>;
