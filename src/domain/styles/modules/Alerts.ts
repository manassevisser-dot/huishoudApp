// src/domain/styles/modules/Alerts.ts
import { Space, Type } from '@domain/constants/Tokens';
import type { ColorScheme } from '@domain/constants/Colors';

export function makeAlerts(c: ColorScheme) {
  return {
    alertErrorText: {
      color: c.error,
      fontSize: Type.sm,
      marginTop: Space.xs,
      marginLeft: Space.xs,
      fontWeight: '600' as const,
    },
    alertWarningText: {
      color: c.warning,
      fontSize: Type.sm,
      marginTop: Space.xs,
      marginLeft: Space.xs,
    },

    // Legacy aliases — opruimen zodra screens gemigreerd zijn
    warningTextOrange: {
      color: c.warning,
      fontSize: Type.sm,
      marginTop: Space.xs,
      marginLeft: Space.xs,
    },
    warningTextRed: {
      color: c.error,
      fontSize: Type.sm,
      marginTop: Space.xs,
      marginLeft: Space.xs,
      fontWeight: '600' as const,
    },
  } as const;
}

export type AlertStyles = ReturnType<typeof makeAlerts>;