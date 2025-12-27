// src/styles/modules/Chips.ts
// CU-008.4: Data Visualisatie (Chips) — gebruikt secondary/selected + onSelected, geen hardcoded hex
import { Space, Type, Radius } from '@styles/Tokens';
import type { ColorScheme } from '@styles/Colors';

/**
 * Fabriek: chips/tags inclusief selected- en error-states
 * Functie < 20 regels
 */
export function makeChips(c: ColorScheme) {
  return {
    chipContainer: { flexDirection: 'row', paddingVertical: Space.xs },
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
    chipText: { fontSize: Type.md, color: c.textPrimary, fontWeight: '500' },
    chipTextSelected: { color: c.onSelected, fontWeight: '600' },

    gridContainer: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -5 },
    gridItem: {
      width: '30%',
      flexGrow: 1,
      backgroundColor: c.surface,
      paddingVertical: Space.lg,
      paddingHorizontal: Space.sm,
      margin: 5,
      borderRadius: Radius.lg,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: c.border,
    },
    gridItemSelected: { backgroundColor: c.selected, borderColor: c.selected },
    gridItemText: { fontSize: 14, fontWeight: '600', color: c.textPrimary, textAlign: 'center' },
    gridItemTextSelected: { color: c.onSelected },
  } as const;
}

export type ChipStyles = ReturnType<typeof makeChips>;
