
import { TempPageConfig, FormState } from '@shared-types/form';

export const incomeDetailsConfig: TempPageConfig = {
  pageId: '3incomeDetails',
  title: 'Inkomensdetails',
  componentName: 'WizardPage',                         // ✅
  fields: [
    {
      fieldId: 'inkomsten_section',                    // ✅ REQUIRED
      pageId: 'inkomsten',
      label: 'Inkomen',                                // ✅ REQUIRED
      type: 'section',
      fields: [
        { fieldId: 'werk_bedrag', pageId: 'bedrag', label: 'Inkomen uit werk (€/mnd)', type: 'money' },
      ],
    },
    {
      fieldId: 'leden_inkomen_repeater',               // ✅ REQUIRED
      pageId: 'leden_inkomen',
      label: 'Inkomen per lid',                        // ✅ REQUIRED
      type: 'repeater',
      filter: (state: FormState) => state.data?.household?.members ?? [],
      fields: [
        {
          fieldId: 'lid_inkomen_section',
          pageId: 'lid_inkomen',
          type: 'section',
          label: 'Inkomen lid',
          visibleIf: (state: FormState, memberId?: string) => !!memberId,
          fields: [
            { fieldId: 'lid_werk_bedrag', pageId: 'lid_werk_bedrag', label: 'Werk (€/mnd)', type: 'money' },
            // ... andere velden per lid
          ],
        },
      ],
    },
  ],
};
