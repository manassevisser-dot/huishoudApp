// src/app/orchestrators/export.ts
import { FormState, Member } from '@core/types/core';
import { isSpecialInvestigationRequired } from '@domain/rules/householdRules';

// We definiëren even snel wat de setup precies is voor de type-veiligheid
type SetupData = NonNullable<NonNullable<FormState['data']>['setup']>;

const getSetup = (state: FormState): Partial<SetupData> => {
  const setup = state.data?.setup;
  return setup !== undefined && setup !== null ? setup : {};
};

const getMembers = (state: FormState): Member[] => 
  state.data?.household?.members !== undefined ? state.data.household.members : [];

const getFinances = (state: FormState) => {
  const finance = state.data?.finance;
  return {
    income: finance?.income?.items !== undefined ? finance.income.items : [],
    expenses: finance?.expenses?.items !== undefined ? finance.expenses.items : [],
  };
};

export const aggregateExportData = (state: FormState) => {
  const setup = getSetup(state);
  const members = getMembers(state);
  const finances = getFinances(state);

  // Nu weet TS dat aantalVolwassen optioneel aanwezig is in setup
  const rawAdults = setup.aantalVolwassen;
  const totalAdults = typeof rawAdults === 'number' 
    ? rawAdults 
    : Number(rawAdults ?? 0);

  return {
    version: '1.0-phoenix-export',
    schemaVersion: state.schemaVersion !== undefined ? state.schemaVersion : 1,
    isSpecialStatus: isSpecialInvestigationRequired(totalAdults), 
    exportDate: new Date().toISOString().split('T')[0],
    household: {
      totalAdults,
      members: members.map((m) => ({
        type: m.memberType,
        leeftijd: m.age !== undefined ? m.age : 0,
      })),
    },
    finances,
  };
};