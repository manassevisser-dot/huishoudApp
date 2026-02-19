// src/domain/styles/modules/Typography.ts
import { Space, Type } from '@domain/constants/Tokens';
import type { ColorScheme } from '@domain/constants/Colors';

function makeHeaderTypography(c: ColorScheme) {
  return {
    screenTitle: {
      fontSize: Type.h2,
      fontWeight: '700' as const,
      marginBottom: Space.xl,
      color: c.textPrimary,
    },
    title: {
      fontSize: Type.lg,
      fontWeight: '600' as const,
      color: c.textPrimary,
    },
    subtitle: {
      fontSize: Type.md,
      fontWeight: '500' as const,
      color: c.textPrimary,
      marginBottom: Space.sm,
    },
  };
}

function makeBodyTypography(c: ColorScheme) {
  return {
    emptyText: {
      color: c.textSecondary,
      fontStyle: 'italic' as const,
    },
    description: {
      fontWeight: '500' as const,
      color: c.textPrimary,
    },
    details: {
      fontSize: Type.sm,
      color: c.textTertiary,
    },
    error: {
      color: c.error,
      marginBottom: Space.sm,
    },
  };
}

export function makeTypography(c: ColorScheme) {
  return {
    ...makeHeaderTypography(c),
    ...makeBodyTypography(c),
  } as const;
}

export type TypographyStyles = ReturnType<typeof makeTypography>;