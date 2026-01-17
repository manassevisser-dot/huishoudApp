import { FormState } from '@shared-types/form';
import { WizardPageConfig } from '@shared-types/wizard';
import { DATA_KEYS, SUB_KEYS } from '@domain/constants/registry';
import { UX_TOKENS } from '@domain/constants/registry';

export const incomeDetailsConfig: WizardPageConfig = {
  // Gebruik de technische key voor consistentie
  pageId: '3incomeDetails',
  titleToken: UX_TOKENS.PAGES[DATA_KEYS.FINANCE], // Gebruikt "Inkomsten & lasten" uit labels.ts
  componentName: 'WizardPage',

  fields: [
    {
      // Dit zorgt dat de data onder state.data.finance.income terecht komt
      fieldId: SUB_KEYS.INCOME,
      label: 'Inkomen algemeen',
      type: 'section',
      fields: [
        {
          fieldId: 'work_salary',
          label: 'Inkomen uit werk (€/mnd)',
          type: 'money',
        },
      ],
    },
    {
      // De repeater die over de bewoners loopt
      fieldId: 'member_income_repeater',
      label: 'Inkomen per gezinslid',
      type: 'repeater',
      // ADR-03: Filter de leden uit het juiste state-pad
      filter: (state: FormState) => state.data[DATA_KEYS.HOUSEHOLD]?.members ?? [],
      fields: [
        {
          fieldId: 'member_income_details',
          type: 'section',
          label: 'Inkomensspecificatie',
          // Zorg dat we alleen iets tonen als er een memberId is (voor de context)
          visibleIf: (state: FormState, context?: { memberId?: string }) => !!context?.memberId,
          fields: [
            {
              fieldId: 'salary',
              label: 'Salaris (€/mnd)',
              type: 'money',
            },
            {
              fieldId: 'benefits',
              label: 'Uitkering/Toeslagen (€/mnd)',
              type: 'money',
            },
          ],
        },
      ],
    },
  ],
};
