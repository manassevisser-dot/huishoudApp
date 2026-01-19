import { UI_SECTIONS } from '@ui/constants/uiSections';
import { UX_TOKENS } from '@domain/constants/registry';

export const detailsHouseholdConfig = {
  pageId: UI_SECTIONS.HOUSEHOLD_DETAILS,
  titleToken: UX_TOKENS.PAGES.HOUSEHOLD_DETAILS,
  fields: [
    {
      fieldId: 'members',
      type: 'repeater',
      labelToken: 'LABEL_HUISHOUDEN_LEDEN',
      itemFields: [
        { fieldId: 'naam', type: 'text', labelToken: 'LABEL_NAAM' },
        { fieldId: 'leeftijd', type: 'number', labelToken: 'LABEL_LEEFTIJD', min: 0 }
      ]
    }
  ]
};