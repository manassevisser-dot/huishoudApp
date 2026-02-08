// src/ui/screens/Wizard/pages/4fixedExpenses.config.ts
import { UI_SECTIONS } from '@domain/constants/uiSections';
import { UX_TOKENS } from '@domain/constants/uxTokens';

export const fixedExpensesConfig = {
  pageId: UI_SECTIONS.FIXED_EXPENSES,
  titleToken: UX_TOKENS.PAGES.FIXED_EXPENSES,
  fields: [
    { fieldId: 'housingSection' },   // Orchestrator bepaalt: huur- of koopvelden?
    { fieldId: 'utilitiesSection' }, // Energie, water, etc.
    { fieldId: 'insuranceSection' }, // De lijst met verzekeringen
    { fieldId: 'subscriptionSection' }, 
    { fieldId: 'personExpenses', type: 'repeater' }, // Voor elk lid de persoonlijke lasten
    { fieldId: 'carExpenses', type: 'repeater' }     // Alleen als er auto's zijn
  ]
};