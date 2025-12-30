
import { TempPageConfig } from '@shared-types/form';

export const detailsHouseholdConfig: TempPageConfig = {
  pageId: '2detailsHousehold',
  title: 'Wie zijn de bewoners?',
  description: 'Vul de details in per gezinslid. Gebruik de swipe om te navigeren.',
  componentName: 'WizardPage',              // ✅ (aanrader: overal zetten)
  fields: [
    {
      fieldId: 'leden_repeater',            // ✅ fieldId (UI sleutel)
      pageId: 'leden',
      label: 'Bewoners',                    // ✅ REQUIRED door FormFieldConfig
      type: 'repeater',
      fields: [
        {
          fieldId: 'naam',
          pageId: 'naam',
          label: 'Naam',
          type: 'text',
          placeholder: 'Bijv. Jan de Vries',
          required: true,
        },
        {
          fieldId: 'dateOfBirth',
          pageId: 'dateOfBirth',
          label: 'Geboortedatum',
          type: 'date-input',
          placeholder: 'DD-MM-YYYY',
          maxLength: 10,
        },
        {
          fieldId: 'gender',
          pageId: 'gender',
          label: 'Geslacht',
          type: 'radio-chips',
          options: [
            { label: 'Man', value: 'man' },
            { label: 'Vrouw', value: 'vrouw' },
            { label: 'Anders', value: 'anders' },
            { label: 'N.v.t.', value: 'n.v.t.' },
          ],
        },
      ],
    },
  ],
};
