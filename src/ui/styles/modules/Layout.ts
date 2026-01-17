// src/styles/modules/Layout.ts
// CU-008.2: Layout (atomaire module) — gebruikt alleen Tokens & Colors, geen hardcoded hex
import { Space } from '@styles/Tokens';
import type { ColorScheme } from '@styles/Colors';

/**
 * Fabriek: levert layout-stijlen als plain object (orchestrator doet StyleSheet.create)
 * \nFunctie < 20 regels
 */
export function makeLayout(c: ColorScheme) {
  return {
    container: { flex: 1, backgroundColor: c.background },
    pageContainer: { flex: 1, paddingTop: Space.sm },
    scrollContent: { paddingBottom: 120, paddingHorizontal: Space.xl },
    inputContainer: { marginBottom: Space.md, width: '100%' },
    content: { padding: Space.lg },
    section: { marginTop: Space.xl },
  } as const;
}

export type LayoutStyles = ReturnType<typeof makeLayout>;
