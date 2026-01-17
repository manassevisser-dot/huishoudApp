// src/styles/modules/Typography.ts
import { Tokens, Type } from '../Tokens';
import type { ColorScheme } from '../Colors';

/** Fabriek: typografiestijlen (pagina-headers etc.) */
export function makeTypography(c: ColorScheme) {
  return {
    pageTitle: {
      fontSize: Type.h2,
      fontWeight: '700',
      marginBottom: Tokens.Space.xl,
      color: c.textPrimary,
    },
    title: {
      fontSize: Type.lg,
      fontWeight: '600',
      color: c.textPrimary,
    },
    subtitle: {
      fontSize: Type.md,
      fontWeight: '500',
      color: c.textPrimary,
      marginBottom: Tokens.Space.sm,
    },
    emptyText: {
      color: c.textSecondary,
      fontStyle: 'italic',
    },
    description: {
      fontWeight: '500',
      color: c.textPrimary,
    },
    details: {
      fontSize: Type.sm,
      color: c.textTertiary,
    },
    error: {
      color: c.error,
      marginBottom: Tokens.Space.sm,
    },
  } as const;
}
export type TypographyStyles = ReturnType<typeof makeTypography>;
