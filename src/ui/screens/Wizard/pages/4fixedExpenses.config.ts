import { FormState } from '@shared-types/form';
import { WizardPageConfig } from '@shared-types/wizard';
import { DATA_KEYS, SUB_KEYS } from '@domain/constants/registry';
import { UX_TOKENS } from '@domain/constants/registry';

export const fixedExpensesConfig: WizardPageConfig = {
  pageId: '4fixedExpenses',
  titleToken: UX_TOKENS.PAGES[DATA_KEYS.FINANCE], // Gebruikt de 'Inkomsten & lasten' token
  componentName: 'WizardPage',
  fields: [
    {
      // We nesten dit onder EXPENSES voor de orchestrator
      fieldId: SUB_KEYS.EXPENSES,
      label: 'Wonen',
      type: 'section',
      fields: [
        {
          fieldId: 'living_costs',
          label: 'Huur / Hypotheek (€/mnd)',
          type: 'money',
        },
      ],
    },
    {
      fieldId: 'car_repeater',
      label: 'Vervoer (Auto)',
      type: 'repeater',
      // ADR-01: View-logic gebaseerd op de SETUP state
      visibleIf: (state: FormState) => state.data[DATA_KEYS.SETUP]?.autoCount !== 'Nee',

      // ADR-03: De repeater lengte wordt bepaald door de eerdere keuze
      countGetter: (state: FormState) => {
        const val = state.data[DATA_KEYS.SETUP]?.autoCount;
        if (val === 'Een') return 1;
        if (val === 'Twee') return 2;
        return 0;
      },
      fields: [
        { fieldId: 'car_fixed', label: 'Verzekering + Belasting', type: 'money' },
        { fieldId: 'car_fuel', label: 'Brandstof / Laden', type: 'money' },
      ],
    },
    {
      fieldId: 'subscription_section',
      label: 'Streaming & Abonnementen',
      type: 'collapsible-section',
      fields: [
        { fieldId: 'netflix', label: 'Netflix', type: 'money' },
        { fieldId: 'videoland', label: 'Videoland', type: 'money' },
        { fieldId: 'hbo', label: 'HBO Max', type: 'money' },
        { fieldId: 'disneyPlus', label: 'Disney+', type: 'money' },
      ],
    },
  ],
};
