import { VisibilityContext } from './fieldVisibility';

export const derivedValueRules = {
  /**
   * Business Rule: "Aantal kinderen = totaal mensen - volwassenen (minimum 0)"
   * Wordt gebruikt om dynamische labels of helper-teksten te genereren.
   */
  kinderenLabel: (ctx: VisibilityContext): number => {
    const n = ctx.getValue('aantalMensen') as number || 0;
    const m = ctx.getValue('aantalVolwassen') as number || 0;
    return Math.max(0, n - m);
  }
};
