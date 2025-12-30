
import { TempPageConfig, FormState } from '@shared-types/form';

export const fixedExpensesConfig: TempPageConfig = {
  pageId: '4fixedExpenses',
  title: 'Vaste Lasten',
  componentName: 'WizardPage',                              // ✅ REQUIRED door WizardPageConfig
  fields: [
    {
      fieldId: 'wonen_section',
      pageId: 'wonen',
      label: 'Wonen',
      type: 'section',
      fields: [
        { fieldId: 'wonen_bedrag', pageId: 'bedrag', label: 'Huur / Hypotheek (€/mnd)', type: 'money' },
      ],
    },
    {
      fieldId: 'vervoer_repeater',
      pageId: 'vervoer',
      label: 'Vervoer (Auto)',
      type: 'repeater',
      countGetter: (state: FormState) => {
        const val = state.data?.setup?.autoCount;
        if (val === 'Een') return 1;
        if (val === 'Twee') return 2;
        return 0;
      },
      visibleIf: (state: FormState) => state.data?.setup?.autoCount !== 'Nee',
      fields: [
        { fieldId: 'vervoer_vast', pageId: 'vast', label: 'Verzekering + Belasting', type: 'money' },
        { fieldId: 'vervoer_brandstof', pageId: 'brandstof', label: 'Brandstof / Laden', type: 'money' },
      ],
    },
    {
      fieldId: 'abonnementen_section',
      pageId: 'abonnementen',
      label: 'Streaming & Abonnementen',
      type: 'collapsible-section',
      fields: [
        { fieldId: 'netflix',     pageId: 'netflix',     label: 'Netflix',     type: 'money' },
        { fieldId: 'videoland',   pageId: 'videoland',   label: 'Videoland',   type: 'money' },
        { fieldId: 'hbo',         pageId: 'hbo',         label: 'HBO Max',     type: 'money' },
        { fieldId: 'disneyPlus',  pageId: 'disneyPlus',  label: 'Disney+',     type: 'money' },
      ],
    },
  ],
};
