// src/styles/modules/Header.ts
// CU-008.2: Headers (atomaire module) — Tokens + Platform-select schaduwmapping
import { Platform } from 'react-native';
import { Space, Type, Tokens } from '@styles/Tokens';
import type { ColorScheme } from '@styles/Colors';

/**
 * Fabriek: header- en navigatiestijlen als plain object
 * \nFunctie < 20 regels
 */
export function makeHeader(c: ColorScheme) {
  const sh = Tokens.Shadows.level1;
  const shadowStyle = Platform.select({
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
    headerBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Space.lg,
      paddingVertical: Space.sm,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
      backgroundColor: c.background,
      ...shadowStyle,
    },
    headerTitle: { fontSize: Type.lg, fontWeight: '600', color: c.textPrimary },
    headerButton: { padding: Space.sm },
    headerButtonText: { fontSize: Type.lg, color: c.primary },
  } as const;
}

export type HeaderStyles = ReturnType<typeof makeHeader>;
