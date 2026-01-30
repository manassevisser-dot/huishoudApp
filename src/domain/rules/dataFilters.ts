import { VisibilityContext } from './fieldVisibility';

export const dataFilterRules = {
  /**
   * Business Rule: "Income repeater iterates over household members"
   * Zorgt ervoor dat inkomstenformulieren worden gegenereerd voor elk lid in de staat.
   */
  member_income_repeater: (ctx: VisibilityContext): any[] => {
    return ctx.getValue('members') as any[] || [];
  }
};
