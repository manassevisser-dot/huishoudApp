// src/styles/modules/Alerts.ts
import { Tokens, Type } from '../Tokens';
import type { ColorScheme } from '../Colors';

/** Fabriek: alert/warning tekststijlen */
// 6. UPDATE: src/styles/modules/Alerts.ts
// ============================================
// VOEG TOE (oude warning namen):

export function makeAlerts(c: ColorScheme) {
  return {
    alertErrorText: {
      color: c.error,
      fontSize: Type.sm,
      marginTop: Tokens.Space.xs,
      marginLeft: Tokens.Space.xs,
      fontWeight: '600',
    },
    alertWarningText: {
      color: c.warning,
      fontSize: Type.sm,
      marginTop: Tokens.Space.xs,
      marginLeft: Tokens.Space.xs,
    },

    // === OUDE ALIASES ===
    warningTextOrange: {
      color: c.warning,
      fontSize: Type.sm,
      marginTop: Tokens.Space.xs,
      marginLeft: Tokens.Space.xs,
    },
    warningTextRed: {
      color: c.error,
      fontSize: Type.sm,
      marginTop: Tokens.Space.xs,
      marginLeft: Tokens.Space.xs,
      fontWeight: '600',
    },
  } as const;
}
