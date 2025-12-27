// 3. src/styles/modules/Helpers.ts
// ============================================
import { Space, Type } from '../Tokens';
import type { ColorScheme } from '../Colors';

export function makeHelpers(c: ColorScheme) {
  return {
    // Navigation hints
    navigationHint: {
      fontSize: Type.sm,
      color: c.textTertiary,
      textAlign: 'right',
      marginTop: Space.md,
      marginRight: Space.sm,
      fontStyle: 'italic',
    },
    
    // Overlay positioning
    hintOverlayBottomRight: {
      position: 'absolute',
      bottom: 6,
      right: 12,
    },
    
    // Card badge (linksboven met nummering)
    cardBadge: {
      position: 'absolute',
      top: 8,
      left: 12,
      backgroundColor: '#00000033',
      color: '#fff',
      paddingHorizontal: Space.sm,
      paddingVertical: 2,
      borderRadius: 12,
      fontSize: Type.xs,
      overflow: 'hidden',
    },
    
    // Helper text
    helperText: {
      fontSize: Type.xs,
      color: c.textSecondary,
      marginTop: Space.xs,
    },
    
    // Debug
    debugBox: {
      backgroundColor: c.secondary,
      padding: Space.sm,
      borderRadius: 6,
      marginTop: Space.md,
    },
    debugText: {
      fontSize: Type.xs,
      color: c.textSecondary,
    },
  } as const;
}

export type HelperStyles = ReturnType<typeof makeHelpers>;
