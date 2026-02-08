// src/styles/modules/Chips.ts
import { Space, Type, Radius } from '@domain/constants/Tokens';
import type { ColorScheme } from '@domain/constants/Colors';

const getStandardChips = (c: ColorScheme) => ({
  chipContainer: { flexDirection: 'row' as const, paddingVertical: Space.xs },
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
});

const getGridChips = (c: ColorScheme) => ({
  gridContainer: { flexDirection: 'row' as const, flexWrap: 'wrap' as const, marginHorizontal: -5 },
  gridItem: {
    width: '30%' as const,
    flexGrow: 1,
    backgroundColor: c.surface,
    paddingVertical: Space.lg,
    paddingHorizontal: Space.sm,
    margin: 5,
    borderRadius: Radius.lg,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    borderWidth: 1,
    borderColor: c.border,
  },
  gridItemSelected: { backgroundColor: c.selected, borderColor: c.selected },
  // FIX: fontSize 14 vervangen door Type.sm
  gridItemText: { fontSize: Type.sm, fontWeight: '600' as const, color: c.textPrimary, textAlign: 'center' as const },
  gridItemTextSelected: { color: c.onSelected },
});

/**
 * Fabriek: chips/tags inclusief selected- en error-states
 */
export function makeChips(c: ColorScheme) {
  return {
    ...getStandardChips(c),
    ...getGridChips(c),
  } as const;
}

export type ChipStyles = ReturnType<typeof makeChips>;