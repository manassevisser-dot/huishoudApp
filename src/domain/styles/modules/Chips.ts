// src/domain/styles/modules/Chips.ts
import { Space, Type, Radius } from '@domain/constants/Tokens';
import { Layout } from '@domain/constants/LayoutTokens';
import type { ColorScheme } from '@domain/constants/Colors';

function makeGridChips(c: ColorScheme) {
  return {
    gridContainer: {
      ...Layout.rowWrap,
      marginHorizontal: -5,
    },
    gridItem: {
      width: '30%' as const,
      flexGrow: 1,
      ...Layout.centered,
      backgroundColor: c.surface,
      paddingVertical: Space.lg,
      paddingHorizontal: Space.sm,
      margin: 5,
      borderRadius: Radius.lg,
      borderWidth: 1,
      borderColor: c.border,
    },
    gridItemSelected: { backgroundColor: c.selected, borderColor: c.selected },
    gridItemText: {
      fontSize: Type.sm,
      fontWeight: '600' as const,
      color: c.textPrimary,
      ...Layout.centerText,
    },
    gridItemTextSelected: { color: c.onSelected },
  };
}

export function makeChips(c: ColorScheme) {
  return {
    // ── Standard chips ─────────────────────────────
    chipContainer: {
      ...Layout.row,
      paddingVertical: Space.xs,
    },
    chip: {
      backgroundColor: c.secondary,
      paddingVertical: Space.sm,
      paddingHorizontal: Space.lg,
      borderRadius: Radius.pill,
      marginRight: Space.md,
      borderWidth: 1,
      borderColor: c.border,
    },
    chipSelected: { backgroundColor: c.selected, borderColor: c.selected },
    chipError: { borderColor: c.error, borderWidth: 2 },
    chipText: { fontSize: Type.md, color: c.textPrimary, fontWeight: '500' as const },
    chipTextSelected: { color: c.onSelected, fontWeight: '600' as const },

    ...makeGridChips(c),
  } as const;
}

export type ChipStyles = ReturnType<typeof makeChips>;