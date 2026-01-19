import { UI_SECTIONS } from '@ui/constants/uiSections';
import { UX_TOKENS } from '@domain/constants/registry';

export const setupHouseholdConfig = {
  pageId: UI_SECTIONS.HOUSEHOLD_SETUP,
  titleToken: UX_TOKENS.PAGES.HOUSEHOLD_SETUP,
  fields: [
    {
      fieldId: 'aantalMensen',
      type: 'counter',
      labelToken: 'LABEL_AANTAL_MENSEN',
      min: 1
    },
    {
      fieldId: 'aantalVolwassen',
      type: 'counter',
      labelToken: 'LABEL_AANTAL_VOLWASSENEN',
      min: 1
    },
    {
      fieldId: 'kinderenLabel',
      type: 'label',
      labelToken: 'LABEL_KINDEREN',
      visibleIfField: 'kinderenLabel' // Verwijst naar de Registry in visibilityRules.ts
    },
    {
      fieldId: 'autoCount',
      type: 'radio',
      options: ['Nee', 'Een', 'Twee'],
      labelToken: 'LABEL_AUTO_COUNT'
    }
  ]
};