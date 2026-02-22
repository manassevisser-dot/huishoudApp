// src/domain/styles/modules/Helpers.ts
import { Space, Type, Sizes } from '@domain/constants/Tokens';
import { Layout } from '@domain/constants/LayoutTokens';
import type { ColorScheme } from '@domain/constants/Colors';

function makeCounterHelpers(c: ColorScheme) {
  return {
    counterContainer: {
      ...Layout.rowCentered,
      gap: Space.lg,
      paddingVertical: Space.sm,
    },
    counterButton: {
      fontSize: Type.xl,
      fontWeight: '600' as const,
      color: c.primary,
      paddingHorizontal: Space.lg,
      paddingVertical: Space.sm,
      minWidth: Sizes.hitTarget,
      ...Layout.centerText,
    },
    counterValue: {
      fontSize: Type.lg,
      fontWeight: '600' as const,
      color: c.textPrimary,
      minWidth: Sizes.counterValue,
      ...Layout.centerText,
    },
  };
}

function makeDebugHelpers(c: ColorScheme) {
  return {
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
  };
}

function makeNavigationHelpers(c: ColorScheme) {
  return {
    navigationHint: {
      fontSize: Type.sm,
      color: c.textTertiary,
      ...Layout.rightText,
      marginTop: Space.md,
      marginRight: Space.sm,
      fontStyle: 'italic' as const,
    },
    hintOverlayBottomRight: {
      ...Layout.absolute,
      bottom: Space.badge,
      right: Space.md,
    },
  };
}

function makeBadgeHelpers(c: ColorScheme) {
  return {
    cardBadge: {
      ...Layout.absolute,
      ...Layout.hidden,
      top: Space.sm,
      left: Space.md,
      backgroundColor: '#00000033',
      color: '#fff',
      paddingHorizontal: Space.sm,
      paddingVertical: 2,
      borderRadius: 12,
      fontSize: Type.xs,
    },
    helperText: {
      fontSize: Type.xs,
      color: c.textSecondary,
      marginTop: Space.xs,
    },
  };
}

export function makeHelpers(c: ColorScheme) {
  return {
    ...makeNavigationHelpers(c),
    ...makeBadgeHelpers(c),
    ...makeDebugHelpers(c),
    ...makeCounterHelpers(c),
  } as const;
}

export type HelperStyles = ReturnType<typeof makeHelpers>;