// src/styles/modules/Buttons.ts
// CU-008.3: Interactie (Buttons) — semantische kleuren + Platform-select voor schaduw
import { Platform } from 'react-native';
import { Space, Type, Radius, Tokens } from '@styles/Tokens';
import type { ColorScheme } from '@styles/Colors';

/**
 * Fabriek: knop-stijlen (primary/secondary), states incl. shadow/elevation
 * Functie < 20 regels
 */
export function makeButtons(c: ColorScheme) {
  const sh = Tokens.Shadows.level2;
  const shadow = Platform.select({
    ios: {
      shadowColor: c.shadow,
      shadowOffset: { width: 0, height: sh.ios.y },
      shadowOpacity: sh.ios.opacity,
      shadowRadius: sh.ios.radius,
    },
    android: { elevation: sh.android.elevation },
    default: {},
  });
  return {
     // === FIXED FOOTER (OUDE buttonContainer) ===
     buttonContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: Space.xl,
      backgroundColor: c.background,
      borderTopWidth: 1,
      borderTopColor: c.border,
    },
    
    button: {
      flex: 1,
      backgroundColor: c.primary,
      padding: Space.lg,
      borderRadius: Radius.lg,
      alignItems: 'center',
      marginLeft: Space.md,
      ...shadow,
    },
    buttonText: {
      color: c.onPrimary,
      fontSize: Type.lg,
      fontWeight: '700',
    },
    
    secondaryButton: {
      backgroundColor: c.secondary,
      marginLeft: 0,
      marginRight: Space.md,
    },
    secondaryButtonText: {
      color: c.onSecondary,
      fontSize: Type.lg,
      fontWeight: '600',
    },
    
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: Space.xl,
      backgroundColor: c.background,
      borderTopWidth: 1,
      borderTopColor: c.border,
    },

    primary: {
      flex: 1,
      backgroundColor: c.primary,
      padding: Space.lg,
      borderRadius: Radius.lg,
      alignItems: 'center',
      marginLeft: Space.md,
      ...shadow,
    },
    primaryText: { color: c.onPrimary, fontSize: Type.lg, fontWeight: '700' },

    secondary: {
      flex: 1,
      backgroundColor: c.secondary,
      padding: Space.lg,
      borderRadius: Radius.lg,
      alignItems: 'center',
      marginRight: Space.md,
    },
    secondaryText: { color: c.onSecondary, fontSize: Type.lg, fontWeight: '600' },

    // buttonGroup (chips/segmented variant kan elders)
    buttonGroup: { flexDirection: 'row', marginTop: Space.sm },
    buttonActive: { backgroundColor: c.primary },
    buttonTextActive: { color: c.onPrimary, fontWeight: '700' },
  } as const;
}

export type ButtonStyles = ReturnType<typeof makeButtons>;
