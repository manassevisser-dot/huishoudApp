// src/ui/styles/modules/Containers.ts
import { ColorScheme } from '../Colors';
import { Tokens } from '../Tokens';

/**
 * Container patterns (collapsible sections, accordions, expandable cards)
 * 
 * Used for grouping related fields in a collapsible UI pattern.
 * Supports light/dark themes via ColorScheme.
 */
export function makeContainers(c: ColorScheme) {
  return {
    // ==================== COLLAPSIBLE SECTION ====================
    
    /**
     * Container voor een collapsible section
     * - Heeft border en background
     * - Subtle shadow voor depth
     */
    collapsibleContainer: {
      marginBottom: Tokens.Space.md,
      backgroundColor: c.surface,
      borderRadius: Tokens.Radius.md,
      borderWidth: 1,
      borderColor: c.border,
    },
    
    /**
     * Header van collapsible section (tappable)
     * - Row layout met space-between
     * - Minimum touch target van 48px
     */
    collapsibleHeader: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      padding: Tokens.Space.md,
      minHeight: Tokens.Sizes.inputHeight, // 48px touch target
    },
    
    /**
     * Label tekst in header
     */
    collapsibleLabel: {
      fontSize: Tokens.Type.md,
      fontWeight: '600' as const,
      color: c.textPrimary,
      flex: 1,
    },
    
    /**
     * Icon (▶/▼) voor expand/collapse state
     */
    collapsibleIcon: {
      fontSize: Tokens.Type.lg,
      color: c.textSecondary,
      marginLeft: Tokens.Space.sm,
    },
    
    /**
     * Content area (alleen visible als expanded)
     * - Padding top 0 (header heeft al padding)
     * - Gap tussen child elements
     */
    collapsibleContent: {
      padding: Tokens.Space.md,
      paddingTop: 0,
      gap: Tokens.Space.sm,
    },
  };
}