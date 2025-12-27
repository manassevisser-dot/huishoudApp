// src/ui/screens/Wizard/pages/C1.config.ts
import { PageConfig } from 'src/shared-types/form';

export const C1Config: PageConfig = {
  id: 'C1',
  title: 'Gezinssituatie',
  fields: [
    {
      id: 'aantalMensen',
      label: 'Totaal aantal personen in huishouden',
      type: 'counter',
      required: true,
      validation: { min: 1, max: 10 },
      defaultValue: 1,
    },
    {
      id: 'aantalVolwassen',
      label: 'Aantal volwassenen (18+)',
      type: 'counter',
      required: true,
      defaultValue: 1,
      conditional: { field: 'C1.aantalMensen', operator: '>', value: 1 },
      validation: { min: 0, max: 7 },
    },
    // P4: REORDERED - Huisdieren now comes BEFORE Auto
    {
      id: 'huisdieren',
      label: 'Huisdier(en)',
      type: 'radio-chips',
      required: true,
      defaultValue: 'Nee',
      options: [
        { label: 'Ja', value: 'Ja' },
        { label: 'Nee', value: 'Nee' },
      ],
    },
    {
      id: 'auto',
      label: 'Auto',
      type: 'radio-chips',
      required: true,
      defaultValue: 'Nee',
      options: [
        { label: 'Nee', value: 'Nee' },
        { label: 'Één', value: 'Één' },
        { label: 'Twee', value: 'Twee' },
      ],
    },
  ],
};
