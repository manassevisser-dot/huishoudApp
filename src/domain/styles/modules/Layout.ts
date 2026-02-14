// src/domain/styles/modules/Layout.ts
import { Space } from '@domain/constants/Tokens';
import { Layout } from '@domain/constants/LayoutTokens';
import type { ColorScheme } from '@domain/constants/Colors';

export function makeLayout(c: ColorScheme) {
  return {
    container: { ...Layout.fullWidth, backgroundColor: c.background },
    pageContainer: { ...Layout.fullWidth, paddingTop: Space.sm },
    scrollContent: { paddingBottom: 120, paddingHorizontal: Space.xl },
    inputContainer: { marginBottom: Space.md, width: '100%' as const },
    content: { padding: Space.lg },
    section: { marginTop: Space.xl },
  } as const;
}

export type LayoutStyles = ReturnType<typeof makeLayout>;