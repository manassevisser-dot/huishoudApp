// src/domain/styles/modules/Header.ts
import { Space, Type } from '@domain/constants/Tokens';
import { Layout } from '@domain/constants/LayoutTokens';
import type { ColorScheme } from '@domain/constants/Colors';

// Shadow: level1 op 'headerBar' — gedeclareerd in PlatformStyles.SHADOW_MAP

export function makeHeader(c: ColorScheme) {
  return {
    headerBar: {
      ...Layout.rowBetweenCenter,
      paddingHorizontal: Space.lg,
      paddingVertical: Space.sm,
      borderBottomWidth: 1,
      borderBottomColor: c.border,
      backgroundColor: c.background,
      // shadow wordt toegepast door PlatformStyles.applyShadows
    },
    headerTitle: { fontSize: Type.lg, fontWeight: '600' as const, color: c.textPrimary },
    headerButton: { padding: Space.sm },
    headerButtonText: { fontSize: Type.lg, color: c.primary },
  } as const;
}

export type HeaderStyles = ReturnType<typeof makeHeader>;