import { UI_SECTIONS } from '@ui/constants/uiSections';
import { UX_TOKENS } from '@domain/constants/registry';

export const incomeDetailsConfig = {
  pageId: UI_SECTIONS.INCOME_DETAILS,
  titleToken: UX_TOKENS.PAGES.INCOME_DETAILS,
  fields: [
    {
      fieldId: 'grossMonthly',
      type: 'money',
      labelToken: 'LABEL_BRUTO_INKOMEN'
    },
    {
      fieldId: 'inkomstenPerLid',
      type: 'money',
      labelToken: 'LABEL_INKOMEN_PER_LID',
      visibleIfField: 'inkomstenPerLid', // Gedelegeerd naar visibilityRules.ts
      dependsOnContext: 'memberId'
    }
  ]
};