// src/ui/screens/Wizard/screens/1setupHousehold.config.ts
import { UI_SECTIONS } from '@domain/constants/uiSections';
import { UX_TOKENS } from '@domain/constants/uxTokens';

export const setupHouseholdConfig = {
  screenId: UI_SECTIONS.HOUSEHOLD_SETUP,
  titleToken: UX_TOKENS.SCREENS.HOUSEHOLD_SETUP,
  fields: [
    { fieldId: 'aantalMensen' },
    { fieldId: 'aantalVolwassen' },
    { fieldId: 'kinderenLabel' },
    { fieldId: 'postcode' },
    { fieldId: 'autoCount' },
    { fieldId: 'heeftHuisdieren' }
  ]
};