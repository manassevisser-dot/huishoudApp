import { TempPageConfig } from '@domain/types/form';

export const detailsHouseholdConfig: TempPageConfig = {
  id: '2detailsHousehold',
  title: 'Wie zijn de bewoners?',
  description: 'Vul de details in per gezinslid. Gebruik de swipe om te navigeren.',
  fields: [
    {
      id: 'leden', // Dit matcht met de key in state.household.leden [cite: 5, 25]
      type: 'repeater',
      fields: [
        {
          id: 'naam',
          label: 'Naam',
          type: 'text',
          placeholder: 'Bijv. Jan de Vries', // Uit jouw oude code [cite: 26]
          required: true,
        },
        {
          id: 'dateOfBirth',
          label: 'Geboortedatum',
          type: 'date-input', // Triggert jouw DateField + useDobInput
          placeholder: 'DD-MM-YYYY',
          maxLength: 10,
        },
        {
          id: 'gender',
          label: 'Geslacht',
          type: 'radio-chips', // Triggert jouw ChipButton [cite: 2, 33]
          options: [
            { label: 'Man', value: 'man' },
            { label: 'Vrouw', value: 'vrouw' },
            { label: 'Anders', value: 'anders' },
            { label: 'N.v.t.', value: 'n.v.t.' },
          ],
        }
      ]
    }
  ],
};