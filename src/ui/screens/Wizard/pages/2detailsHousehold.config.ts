import { DATA_KEYS, SUB_KEYS } from '@domain/constants/registry';
import { UX_TOKENS } from '@domain/constants/registry';
import { WizardPageConfig } from '@shared-types/wizard';

export const detailsHouseholdConfig: WizardPageConfig = {
  pageId: DATA_KEYS.HOUSEHOLD,
  titleToken: UX_TOKENS.PAGES[DATA_KEYS.HOUSEHOLD], // Automatisch 'Wie zijn de bewoners?'
  componentName: 'WizardPage',
  fields: [
    {
      fieldId: SUB_KEYS.MEMBERS,
      type: 'repeater',
      fields: [
        {
          fieldId: 'fullName',
          labelToken: UX_TOKENS.FIELDS.NAME, // 'Volledige naam'
          type: 'text',
          required: true,
        },
      ],
    },
  ],
};
