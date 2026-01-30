import { FormState } from '@shared-types/form';
import { Member } from '@domain/household';
import { isSpecialInvestigationRequired } from '@domain/rules/householdRules';

export const aggregateExportData = (state: FormState) => {
  // 1. Data veilig ophalen
  const setup = state.data?.setup || {};
  const household = state.data?.household || { members: [] };
  const finance = state.data?.finance || { income: { items: [] }, expenses: { items: [] } };

  // 2. Variabelen definiëren
  const totalAdults = Number(setup.aantalVolwassen || 0);

  // 3. Mapping
  const members = (household.members || []).map((m: Member) => ({
    type: m.memberType,
    leeftijd: m.age || 0,
  }));

  const incomeItems = finance.income?.items || [];
  const expenseItems = finance.expenses?.items || [];

  // 4. Return het object met de Rule uit het domein
  return {
    version: '1.0-phoenix-export',
    schemaVersion: state.schemaVersion || 1,
    // ✅ HIER gebruiken we de officiële rule voor n8n
    isSpecialStatus: isSpecialInvestigationRequired(totalAdults), 
    exportDate: new Date().toISOString().split('T')[0],
    household: {
      totalAdults,
      members,
    },
    finances: {
      income: incomeItems,
      expenses: expenseItems,
    },
  };
};