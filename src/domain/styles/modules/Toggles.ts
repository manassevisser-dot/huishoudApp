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
