// src/domain/rules/derivedValues.ts
import { VisibilityContext } from './fieldVisibility';

export const derivedValueRules = {
  /**
   * Business Rule: "Aantal kinderen = totaal mensen - volwassenen (minimum 0)"
   * Wordt gebruikt om dynamische labels of helper-teksten te genereren.
   */
  kinderenLabel: (ctx: VisibilityContext): number => {
    // FIX: Gebruik ?? in plaats van || voor getallen (ADR-06)
    const n = (ctx.getValue('aantalMensen') as number | undefined) ?? 0;
    const m = (ctx.getValue('aantalVolwassen') as number | undefined) ?? 0;
    
    return Math.max(0, n - m);
  }
};