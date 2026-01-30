import { UI_SECTIONS } from '@ui/constants/uiSections';
import { UX_TOKENS } from '@ui/constants/uxTokens';

export const fixedExpensesConfig = {
  pageId: UI_SECTIONS.FIXED_EXPENSES,
  titleToken: UX_TOKENS.PAGES.FIXED_EXPENSES,
  fields: [
    { fieldId: 'autoVerzekering', type: 'money', labelToken: UX_TOKENS.FIELDS.AUTO_INSURANCE, requiresVisibilityCheck: true, uiModel: 'moneyRow' },
    { 
      fieldId: 'car_repeater', 
      type: 'repeater', 
      labelToken: UX_TOKENS.FIELDS.CAR_REPEATER, 
      requiresVisibilityCheck: true, 
      requiresConstraint: 'count' 
    }
  ]
};
