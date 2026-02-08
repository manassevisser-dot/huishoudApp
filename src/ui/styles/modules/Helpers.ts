// src/styles/modules/Helpers.ts
import { Space, Type } from '../Tokens';
import type { ColorScheme } from '../Colors';

const getNavigationStyles = (c: ColorScheme) => ({
  navigationHint: {
    fontSize: Type.sm,
    color: c.textTertiary,
    textAlign: 'right' as const,
    marginTop: Space.md,
    marginRight: Space.sm,
    fontStyle: 'italic' as const,
  },
  hintOverlayBottomRight: {
    position: 'absolute' as const,
    bottom: 6,
    right: 12,
  },
});

const getCardBadgeAndDebug = (c: ColorScheme) => ({
  cardBadge: {
    position: 'absolute' as const,
    top: 8,
    left: 12,
    backgroundColor: '#00000033',
    color: '#fff',
    paddingHorizontal: Space.sm,
    paddingVertical: 2,
    borderRadius: 12,
    fontSize: Type.xs,
    overflow: 'hidden' as const,
  },
  helperText: {
    fontSize: Type.xs,
    color: c.textSecondary,
    marginTop: Space.xs,
  },
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
});

const getCounterStyles = (c: ColorScheme) => ({
  counterContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    gap: Space.lg,
    paddingVertical: Space.sm,
  },
  counterButton: {
    fontSize: Type.xl,
    fontWeight: '600' as const,
    color: c.primary,
    paddingHorizontal: Space.lg,
    paddingVertical: Space.sm,
    minWidth: 44,
    textAlign: 'center' as const,
  },
  counterValue: {
    fontSize: Type.lg,
    fontWeight: '600' as const,
    color: c.textPrimary,
    minWidth: 48,
    textAlign: 'center' as const,
  },
});

/** Fabriek: helper stijlen */
export function makeHelpers(c: ColorScheme) {
  return {
    ...getNavigationStyles(c),
    ...getCardBadgeAndDebug(c),
    ...getCounterStyles(c),
  } as const;
}

export type HelperStyles = ReturnType<typeof makeHelpers>;