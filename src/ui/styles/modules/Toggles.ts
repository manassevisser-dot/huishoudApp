// 1. src/styles/modules/Toggles.ts
// ============================================
import { Space, Type } from '../Tokens';
import type { ColorScheme } from '../Colors';

export function makeToggles(c: ColorScheme) {
  return {
    toggleWrapper: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    toggleButton: {
      paddingHorizontal: Space.xl,
      paddingVertical: Space.sm,
      borderRadius: 8,
      minWidth: 80,
      alignItems: 'center',
    },
    toggleActive: { backgroundColor: c.success },
    toggleInactive: { backgroundColor: c.secondary },
    toggleText: { fontSize: Type.lg, fontWeight: '600', color: c.onSuccess },
  } as const;
}

export type ToggleStyles = ReturnType<typeof makeToggles>;
