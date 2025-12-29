import { TempPageConfig } from '@domain/types/form';

export const incomeDetailsConfig: TempPageConfig = {
  id: '3incomeDetails',
  title: 'Inkomsten',
  fields: [
    {
      id: 'householdBenefits',
      label: 'Toeslagen huishouden',
      type: 'section',
      fields: [
        { id: 'huurtoeslag', label: 'Huurtoeslag', type: 'money' }
      ]
    },
    {
      id: 'inkomstenLeden',
      type: 'repeater',
      // Phoenix Power: Alleen volwassenen tonen
      filter: (state: FormState) => state.household?.leden?.filter(m => m.memberType === 'adult') || [],
      fields: [
        {
          id: 'werkSectie',
          type: 'collapsible-section', // Jouw 'Expanded' logica
          label: 'Inkomen uit werk',
          visibleIf: (state, memberId) => state.finance?.inkomsten[memberId]?.categories?.werk,
          fields: [
            { id: 'nettoSalaris', label: 'Netto salaris', type: 'money' },
            { id: 'zorgtoeslag', label: 'Zorgtoeslag', type: 'money' },
            { id: 'reiskosten', label: 'Reiskosten', type: 'money' }
          ]
        }
      ]
    }
  ],
};