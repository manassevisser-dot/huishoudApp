import { PageConfig } from '../../../types/form';

export const C7Config: PageConfig = {
  id: 'C7',
  title: 'Inkomsten',
  fields: [
    {
      id: 'inkomsten',
      label: 'Inkomsten per volwassene',
      type: 'income-repeater',
      required: false,
      defaultValue: {},
    },
  ],
};
