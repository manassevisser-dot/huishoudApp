// src/domain/styles/PrimitiveStyleFactory.ts
//
// Definitieve, domeinwaardige versie.
// Bevat ALLEEN presentatieregels (deterministisch, context-vrij).
// GEEN compositie/layout (die horen bij UI/orchestrator).
/**
 * PRIMITIVE STYLE FACTORY (Domain) — PRESENTATIEBELEID
 * - Pure 'getX' regels: deterministisch, context-vrij
 * - Materialiseert tokens/kleuren o.b.v. betekenisvolle input (hasError/selected/variant/kind)
 * - GEEN compositie/layout; dat leeft in de UI-laag
 */
/**
* TODO: 
* Imports updaten
* Waar je layout nodig had (chips/radio groepen), importeer je voortaan:
* import { UiPrimitiveStyles } from 'FORBIDDEN LAYER-/styles/UiPrimitiveStyles';
*
* Waar je regels nodig had (error/labels/typografie/knoppen), gebruik je:
* import { PrimitiveStyleFactory } from '@domain/styles/PrimitiveStyleFactory';
*/

import { Colors } from '@domain/constants/Colors';
import { Tokens } from '@domain/constants/Tokens';
import type { PrimitiveStyleRule } from '@domain/registry/PrimitiveRegistry';

// Platform-abstractie (beleid: tokens -> platform output)
const getShadow = (level: 'sm' | 'md' | 'lg'): PrimitiveStyleRule => {
  const sh = Tokens.Shadows[level];
  return {
    // iOS regels
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: sh.ios.y },
    shadowOpacity: sh.ios.opacity,
    shadowRadius: sh.ios.radius,
    // Android regels
    elevation: sh.android.elevation,
  } as unknown as PrimitiveStyleRule;
};

export const PrimitiveStyleFactory = {
  // App-brede schermpolicy
  getScreenLayout(): PrimitiveStyleRule {
    return {
      flex: 1,
      backgroundColor: Colors.light.background,
      paddingHorizontal: Tokens.Space.xl,
      paddingTop: Tokens.Space.sm,
    };
    
  },

  // Veldcontainer – rood bij fout
  getFieldContainer(hasError: boolean): PrimitiveStyleRule {
    return {
      marginBottom: Tokens.Space.md,
      padding: Tokens.Space.sm,
      borderWidth: 1,
      borderColor: hasError ? Colors.light.error : Colors.light.border,
      borderRadius: Tokens.Radius.sm,
      backgroundColor: Colors.light.surface,
    };
  },

  // Label – rood bij fout
  getLabelStyle(hasError: boolean): PrimitiveStyleRule {
    return {
      fontSize: Tokens.Type.sm,
      color: hasError ? Colors.light.error : Colors.light.textPrimary,
      marginBottom: Tokens.Space.xs,
      fontWeight: '600',
    };
  },

  // Typografie op semantiek
  getTextStyle(kind: 'screenTitle' | 'label' | 'error' | 'derived'): PrimitiveStyleRule {
    const map = {
      screenTitle: {
        fontSize: Tokens.Type.h2,
        fontWeight: '700',
        color: Colors.light.textPrimary,
        marginBottom: Tokens.Space.xl,
      },
      label: {
        fontSize: Tokens.Type.sm,
        fontWeight: '600',
        color: Colors.light.textPrimary,
        marginBottom: Tokens.Space.xs,
      },
      error: {
        fontSize: Tokens.Type.xs,
        color: Colors.light.error,
        marginTop: Tokens.Space.xs,
      },
      derived: {
        fontSize: Tokens.Type.md,
        color: Colors.light.textSecondary,
        paddingVertical: Tokens.Space.xs,
      },
    } as const;
    return map[kind];
  },
// Back‑compat: oudere aanroepen blijven werken
getErrorTextStyle(): PrimitiveStyleRule {
  return this.getTextStyle('error');
},
  // ✅ Back‑compat alias: NIET weghalen
  getDerivedValueStyle(): PrimitiveStyleRule {
    return this.getTextStyle('derived');
  },

  // Chip – geselecteerd = primary
  getChipStyle(selected: boolean): { container: PrimitiveStyleRule; text: PrimitiveStyleRule } {
    return {
      container: {
        paddingHorizontal: Tokens.Space.md,
        paddingVertical: Tokens.Space.xs,
        borderRadius: Tokens.Radius.circle,
        backgroundColor: selected ? Colors.light.primary : Colors.light.surface,
        borderWidth: 1,
        borderColor: selected ? Colors.light.primary : Colors.light.border,
      },
      text: {
        color: selected ? Colors.light.onPrimary : Colors.light.textPrimary,
        fontSize: Tokens.Type.sm,
      },
    };
  },

  // Buttons – semantische varianten
  getButtonStyle(
    variant: 'primary' | 'secondary' | 'danger',
    isDisabled = false
  ): { container: PrimitiveStyleRule; text: PrimitiveStyleRule } {
    const isPrimary = variant === 'primary';
    const isDanger  = variant === 'danger';
    return {
      container: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Tokens.Space.lg,
        borderRadius: Tokens.Radius.lg,
        backgroundColor: isDanger
          ? Colors.light.error
          : (isPrimary ? Colors.light.primary : Colors.light.secondary),
          opacity: isDisabled ? Tokens.Opacity.disabled : Tokens.Opacity.solid,
        ...(isPrimary && !isDisabled ? getShadow('md') : {}),
      },
      text: {
        color: (isPrimary || isDanger) ? Colors.light.onPrimary : Colors.light.onSecondary,
        fontSize: Tokens.Type.lg,
        fontWeight: '700',
      },
    };
  },
};