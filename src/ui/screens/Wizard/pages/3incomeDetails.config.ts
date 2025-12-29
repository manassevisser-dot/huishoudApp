import { TempPageConfig, FormState, Member } from '@shared-types/form';

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
      // Voeg expliciete types toe aan de parameters
      filter: (state: FormState) => 
        state.household?.leden?.filter((m: Member) => m.memberType === 'adult') || [],
      fields: [
        {
          id: 'werkSectie',
          type: 'collapsible-section',
          label: 'Inkomen uit werk',
          visibleIf: (state: FormState, memberId?: string) => 
            memberId ? state.finance?.inkomsten?.[memberId]?.categories?.werk : false,
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