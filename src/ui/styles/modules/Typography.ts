// src/styles/modules/Typography.ts
import { Tokens, Type } from '../Tokens';
import type { ColorScheme } from '../Colors';

// --- Sub-secties voor betere scannability ---

const getHeaderStyles = (c: ColorScheme) => ({
  pageTitle: {
    fontSize: Type.h2,
    fontWeight: '700' as const,
    marginBottom: Tokens.Space.xl,
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
    marginBottom: Tokens.Space.sm,
  },
});

const getBodyStyles = (c: ColorScheme) => ({
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
    marginBottom: Tokens.Space.sm,
  },
});

/** Fabriek: typografiestijlen (pagina-headers etc.) */
export function makeTypography(c: ColorScheme) {
  return {
    ...getHeaderStyles(c),
    ...getBodyStyles(c),
  } as const;
}

export type TypographyStyles = ReturnType<typeof makeTypography>;