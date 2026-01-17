import { FormState } from '@shared-types/form';
import { Member } from '@domain/household';

export const aggregateExportData = (state: FormState) => {
  // Fix 1: Cast naar correcte types of gebruik optional chaining met defaults
  const setup = state.data?.setup || {};
  const household = state.data?.household || { members: [] };
  const finance = state.data?.finance || { income: { items: [] }, expenses: { items: [] } };

  // Fix 2: Gebruik veilige accessors
  const totalAdults = setup.aantalVolwassen || 0;
  
  // Fix 3: Map leden correct met type safety
  const members = (household.members || []).map((m: Member) => ({
    type: m.memberType,
    leeftijd: m.age || 0
  }));

  // Fix 4: Check op items bestaan
  const incomeItems = finance.income?.items || [];
  const expenseItems = finance.expenses?.items || [];

  return {
    version: '1.0-phoenix-export',
    schemaVersion: state.schemaVersion || 1,
    isSpecialStatus: totalAdults > 5,
    exportDate: new Date().toISOString().split('T')[0],
    household: {
      totalAdults,
      members
    },
    finances: {
      income: incomeItems,
      expenses: expenseItems
    }
  };
};