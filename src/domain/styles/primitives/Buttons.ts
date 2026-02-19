// src/domain/styles/modules/Buttons.ts
import { Space, Type, Radius } from '@domain/constants/Tokens';
import { Layout } from '@domain/constants/LayoutTokens';
import type { ColorScheme } from '@domain/constants/Colors';

function makeButtonContainers(c: ColorScheme) {
  return {
    buttonContainer: {
      ...Layout.pinBottom,
      ...Layout.rowBetween,
      padding: Space.xl,
      backgroundColor: c.background,
      borderTopWidth: 1,
      borderTopColor: c.border,
    },
    buttonRow: {
      ...Layout.rowBetween,
      padding: Space.xl,
      backgroundColor: c.background,
      borderTopWidth: 1,
      borderTopColor: c.border,
    },
    buttonGroup: {
      ...Layout.row,
      marginTop: Space.sm,
    },
  };
}

function makePrimaryButtons(c: ColorScheme) {
  return {
    button: {
      ...Layout.fullWidth,
      ...Layout.centered,
      backgroundColor: c.primary,
      padding: Space.lg,
      borderRadius: Radius.lg,
      marginLeft: Space.md,
    },
    // Dit is de 'Disabled' staat uit de documentatie, vertaald naar jouw domein
    buttonDisabled: {
      backgroundColor: c.disabled !== "" ? c.disabled : '#ccc',
      opacity: 0.5,
    },
    buttonText: {
      color: c.onPrimary,
      fontSize: Type.lg,
      fontWeight: '700' as const,
    },
    buttonActive: { backgroundColor: c.primary },
    buttonTextActive: { color: c.onPrimary, fontWeight: '700' as const },
  };
}

export function makeButtons(c: ColorScheme) {
  return {
    ...makeButtonContainers(c),
    ...makePrimaryButtons(c),
    secondaryButton: {
      backgroundColor: c.secondary,
      marginLeft: 0,
      marginRight: Space.md,
    },
    secondaryButtonText: {
      color: c.onSecondary,
      fontSize: Type.lg,
      fontWeight: '600' as const,
    },
    deleteButton: { backgroundColor: c.error },
  } as const;
}

export type ButtonStyles = ReturnType<typeof makeButtons>;