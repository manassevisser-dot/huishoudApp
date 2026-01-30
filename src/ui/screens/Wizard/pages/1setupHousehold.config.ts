import { UI_SECTIONS } from '@ui/constants/uiSections';
import { UX_TOKENS } from '@ui/constants/uxTokens';

export const setupHouseholdConfig = {
  pageId: UI_SECTIONS.HOUSEHOLD_SETUP,
  titleToken: UX_TOKENS.PAGES.HOUSEHOLD_SETUP,
  fields: [
    { fieldId: 'aantalMensen', type: 'counter', labelToken: UX_TOKENS.FIELDS.AANTAL_MENSEN, uiModel: 'numericWrapper' },
    { 
      fieldId: 'aantalVolwassen', 
      type: 'counter', 
      labelToken: UX_TOKENS.FIELDS.AANTAL_VOLWASSENEN,
      requiresVisibilityCheck: true,
      requiresConstraint: 'max',
      uiModel: 'numericWrapper'
    },
    { 
      fieldId: 'kinderenLabel', 
      type: 'label', 
      labelToken: UX_TOKENS.FIELDS.KINDEREN,
      requiresVisibilityCheck: true,
      requiresDerivedValue: true 
    },
    { fieldId: 'autoCount', type: 'radio', options: ['Nee', 'Een', 'Twee'], labelToken: UX_TOKENS.FIELDS.CAR_COUNT }
  ]
};
