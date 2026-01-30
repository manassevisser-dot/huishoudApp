export interface VisibilityContext {
  getValue: (fieldId: string) => unknown;
}

export const fieldVisibilityRules = {
  /**
   * Business Rule: "Volwassenen field is alleen zichtbaar als er minimaal 1 persoon is"
   */
  aantalVolwassen: (ctx: VisibilityContext): boolean => {
    const aantalMensen = ctx.getValue('aantalMensen') as number;
    return (aantalMensen || 0) > 0;
  },
  
  /**
   * Business Rule: "Kinderen label is alleen zichtbaar als er meer mensen zijn dan volwassenen"
   */
  kinderenLabel: (ctx: VisibilityContext): boolean => {
    const n = ctx.getValue('aantalMensen') as number || 0;
    const m = ctx.getValue('aantalVolwassen') as number || 0;
    return n > m;
  },
  
  /**
   * Business Rule: "Car repeater only visible if user has cars"
   */
  car_repeater: (ctx: VisibilityContext): boolean => {
    const autoCount = ctx.getValue('autoCount') as string;
    return autoCount !== 'Nee';
  },
  
  /**
   * Business Rule: "Income details only visible if member context exists"
   */
  member_income_details: (ctx: VisibilityContext, memberId?: string): boolean => {
    return !!memberId;
  }
};
