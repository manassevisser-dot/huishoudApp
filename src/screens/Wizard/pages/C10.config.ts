import { PageConfig } from '@shared-types/form';

export const C10Config: PageConfig = {
  id: 'C10',
  title: 'Vaste Lasten',
  fields: [
    {
      id: 'lasten',
      label: 'Maandelijkse vaste lasten',
      type: 'expense-repeater',
      required: false,
      defaultValue: [],
    },
  ],
};
