import { UI_SECTIONS } from '@domain/constants/uiSections';
import { UX_TOKENS } from '@domain/constants/uxTokens';

export const detailsHouseholdConfig = {
  pageId: UI_SECTIONS.HOUSEHOLD_DETAILS,
  titleToken: UX_TOKENS.PAGES.HOUSEHOLD_DETAILS,
  fields: [
    { fieldId: 'burgerlijkeStaat' },
    { fieldId: 'woningType' },
    { fieldId: 'postcode' },
    {
      fieldId: 'members',
      type: 'repeater', // De repeater zelf is een UI-structuur
      itemFields: [
        { fieldId: 'naam' },
        { fieldId: 'leeftijd' },
        { fieldId: 'gender' }
      ]
    }
  ]
};