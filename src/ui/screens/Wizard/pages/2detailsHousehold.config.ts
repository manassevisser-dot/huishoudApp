import { UI_SECTIONS } from '@ui/constants/uiSections';
import { UX_TOKENS } from '@ui/constants/uxTokens';

export const detailsHouseholdConfig = {
  pageId: UI_SECTIONS.HOUSEHOLD_DETAILS,
  titleToken: UX_TOKENS.PAGES.HOUSEHOLD_DETAILS,
  fields: [
    {
      fieldId: 'members',
      type: 'repeater',
      labelToken: 'LABEL_HUISHOUDEN_LEDEN',
      requiresFilteredData: true,
      itemFields: [
        { fieldId: 'naam', type: 'text', labelToken: UX_TOKENS.FIELDS.NAME, uiModel: 'input' },
        { fieldId: 'leeftijd', type: 'number', labelToken: UX_TOKENS.FIELDS.AGE, min: 0, uiModel: 'numericInput' }
      ]
    }
  ]
};
