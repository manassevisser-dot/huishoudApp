import { UI_SECTIONS } from '@ui/constants/uiSections';
import { UX_TOKENS } from '@ui/constants/uxTokens';

export const incomeDetailsConfig = {
  pageId: UI_SECTIONS.INCOME_DETAILS,
  titleToken: UX_TOKENS.PAGES.INCOME_DETAILS,
  fields: [
    { fieldId: 'grossMonthly', type: 'money', labelToken: UX_TOKENS.FIELDS.BRUTO_INCOME, uiModel: 'moneyRow' },
    { 
      fieldId: 'inkomstenPerLid', 
      type: 'money', 
      labelToken: UX_TOKENS.FIELDS.INCOME_MEMBER,
      requiresVisibilityCheck: true,
      dependsOnContext: 'memberId',
      uiModel: 'moneyRow'
    }
  ]
};
