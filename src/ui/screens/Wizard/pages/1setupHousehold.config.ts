// ADR-02: Type-Safety aan systeemgrenzen via relatieve paden
import { FormState } from '@shared-types/form';
import { DATA_KEYS } from '@domain/constants/datakeys';

interface WizardPageConfig {
  pageId: string;
  title: string;
  fields: any[];
}

/**
 * ADR-04: UI Components zijn “dumb”. 
 * Deze config bevat de regels die door de WizardPage projector worden uitgelezen.
 */
export const setupHouseholdConfig: WizardPageConfig = {
  pageId: '1setupHousehold',
  title: 'Huishouden opzetten',
  fields: [
    {
  fieldId: '1setupHousehold',
      label: 'Totaal aantal bewoners (N)',
      type: 'counter',
      defaultValue: 1,
      min: 1,
      max: 20,
    },
    {
  fieldId: 'aantalVolwassen',
      label: 'Aantal volwassenen (M)',
      type: 'counter',
      defaultValue: 1,
      min: 1,
      // ADR-01: Businesslogica in UI is niet toegestaan, maar view-logic (zichtbaarheid) wel.
      visibleIf: (state: FormState) => (state[DATA_KEYS.SETUP]?.aantalMensen || 0) > 0,
      maxGetter: (state: FormState) => state[DATA_KEYS.SETUP]?.aantalMensen || 1,
    },
    {
  fieldId: 'kinderenLabel',
      label: 'Waarvan aantal kinderen (K)',
      type: 'derived-label',
      // ADR-03: Berekening op basis van de state
      valueGetter: (state: FormState) => {
        const n = state[DATA_KEYS.SETUP]?.aantalMensen || 0;
        const m = state[DATA_KEYS.SETUP]?.aantalVolwassen || 0;
        return Math.max(0, n - m);
      },
      visibleIf: (state: FormState) => {
        const n = state[DATA_KEYS.SETUP]?.aantalMensen || 0;
        const m = state[DATA_KEYS.SETUP]?.aantalVolwassen || 0;
        return n > m;
      },
    },
    {
  fieldId: 'autoCount',
      label: 'Hoeveel auto\'s heeft het huishouden?',
      type: 'radio-chips',
      options: [
        { label: 'Geen', value: 'Nee' },
        { label: '1 auto', value: 'Een' },
        { label: '2+ auto\'s', value: 'Twee' },
      ],
      defaultValue: 'Nee',
    },
    {
  fieldId: 'heeftHuisdieren',
      label: 'Zijn er huisdieren aanwezig?',
      type: 'toggle',
      defaultValue: false,
    },
  ],
};