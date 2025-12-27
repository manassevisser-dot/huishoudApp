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
  } as const;
}
export type TypographyStyles = ReturnType<typeof makeTypography>;
