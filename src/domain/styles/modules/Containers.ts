// src/domain/styles/modules/Containers.ts
import { Space, Type, Radius, Sizes } from '@domain/constants/Tokens';
import { Layout } from '@domain/constants/LayoutTokens';
import type { ColorScheme } from '@domain/constants/Colors';

function makeCollapsibleHeader(c: ColorScheme) {
  return {
    collapsibleHeader: {
      ...Layout.rowBetweenCenter,
      padding: Space.md,
      minHeight: Sizes.inputHeight, // 48px touch target
    },
    collapsibleLabel: {
      ...Layout.fullWidth,
      fontSize: Type.md,
      fontWeight: '600' as const,
      color: c.textPrimary,
    },
    collapsibleIcon: {
      fontSize: Type.lg,
      color: c.textSecondary,
      marginLeft: Space.sm,
    },
  };
}

function makeCollapsibleStyles(c: ColorScheme) {
  return {
    collapsibleContainer: {
      marginBottom: Space.md,
      backgroundColor: c.surface,
      borderRadius: Radius.md,
      borderWidth: 1,
      borderColor: c.border,
    },
    ...makeCollapsibleHeader(c),
    collapsibleContent: {
      padding: Space.md,
      paddingTop: 0,
      gap: Space.sm,
    },
  };
}

export function makeContainers(c: ColorScheme) {
  return {
    ...makeCollapsibleStyles(c),
  } as const;
}

export type ContainerStyles = ReturnType<typeof makeContainers>;