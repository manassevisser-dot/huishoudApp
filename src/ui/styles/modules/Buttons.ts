// src/styles/modules/Buttons.ts
import { Platform } from 'react-native';
import { Space, Type, Radius, Tokens } from '@domain/constants/Tokens';
import type { ColorScheme } from '@domain/constants/Colors';

const getButtonShadow = (c: ColorScheme) => {
  const sh = Tokens.Shadows.level2;
  return Platform.select({
    ios: {
      shadowColor: c.shadow,
      shadowOffset: { width: 0, height: sh.ios.y },
      shadowOpacity: sh.ios.opacity,
      shadowRadius: sh.ios.radius,
    },
    android: { elevation: sh.android.elevation },
    default: {},
  });
};

const getButtonContainers = (c: ColorScheme) => ({
  buttonContainer: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    padding: Space.xl,
    backgroundColor: c.background,
    borderTopWidth: 1,
    borderTopColor: c.border,
  },
  buttonRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    padding: Space.xl,
    backgroundColor: c.background,
    borderTopWidth: 1,
    borderTopColor: c.border,
  },
});

const getBaseVariants = (c: ColorScheme, shadow: object) => ({
  button: {
    flex: 1,
    backgroundColor: c.primary,
    padding: Space.lg,
    borderRadius: Radius.lg,
    alignItems: 'center' as const,
    marginLeft: Space.md,
    ...shadow,
  },
  buttonText: { color: c.onPrimary, fontSize: Type.lg, fontWeight: '700' as const },
  secondaryButton: { backgroundColor: c.secondary, marginLeft: 0, marginRight: Space.md },
  secondaryButtonText: { color: c.onSecondary, fontSize: Type.lg, fontWeight: '600' as const },
});

const getSpecialVariants = (c: ColorScheme) => ({
  primary: {
    flex: 1,
    backgroundColor: c.primary,
    padding: Space.lg,
    borderRadius: Radius.lg,
    alignItems: 'center' as const,
  },
  secondary: {
    flex: 1,
    backgroundColor: c.secondary,
    padding: Space.lg,
    borderRadius: Radius.lg,
    alignItems: 'center' as const,
  },
  secondaryText: { color: c.onSecondary, fontSize: Type.lg, fontWeight: '600' as const },
  deleteButton: { backgroundColor: c.error },
  buttonGroup: { flexDirection: 'row' as const, marginTop: Space.sm },
  buttonActive: { backgroundColor: c.primary },
  buttonTextActive: { color: c.onPrimary, fontWeight: '700' as const },
});

export function makeButtons(c: ColorScheme) {
  const shadow = getButtonShadow(c);

  return {
    ...getButtonContainers(c),
    ...getBaseVariants(c, shadow),
    ...getSpecialVariants(c),
  } as const;
}

export type ButtonStyles = ReturnType<typeof makeButtons>;