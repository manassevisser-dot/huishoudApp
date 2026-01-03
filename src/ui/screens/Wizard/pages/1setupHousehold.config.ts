// ADR-02: Type-Safety via relatieve paden
import { FormState, WizardPageConfig } from '@shared-types/form';
import { DATA_KEYS } from '@domain/constants/registry';
import { UX_TOKENS } from '@domain/constants/registry';

/**
 * ADR-04: UI Components zijn “dumb”. 
 * De projector (WizardPage) haalt de teksten op via de tokens.
 */
export const setupHouseholdConfig: WizardPageConfig = {
  pageId: DATA_KEYS.SETUP,
  titleToken: UX_TOKENS.PAGES[DATA_KEYS.SETUP], // "Huishouden opzetten"
  componentName: 'WizardPage',
  fields: [
    {
      fieldId: 'aantalMensen', // De technische key in je state.data.setup
      label: 'Totaal aantal bewoners (N)', // Of gebruik: labelToken: UX_TOKENS.FIELDS.TOTAL_MEMBERS
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
      // ADR-01: Businesslogica in UI niet toegestaan, maar view-logic wel
      visibleIf: (state: FormState) => (state.data[DATA_KEYS.SETUP]?.aantalMensen || 0) > 0,
      maxGetter: (state: FormState) => state.data[DATA_KEYS.SETUP]?.aantalMensen || 1,
    },
    {
      fieldId: 'kinderenLabel',
      label: 'Waarvan aantal kinderen (K)',
      type: 'derived-label',
      // ADR-03: Berekening op basis van de state
      valueGetter: (state: FormState) => {
        const n = state.data[DATA_KEYS.SETUP]?.aantalMensen || 0;
        const m = state.data[DATA_KEYS.SETUP]?.aantalVolwassen || 0;
        return Math.max(0, n - m);
      },
      visibleIf: (state: FormState) => {
        const n = state.data[DATA_KEYS.SETUP]?.aantalMensen || 0;
        const m = state.data[DATA_KEYS.SETUP]?.aantalVolwassen || 0;
        return n > m;
      },
    },
    {
      fieldId: 'autoCount',
      labelToken: UX_TOKENS.FIELDS.CAR_COUNT, // Werkt nu!
      type: 'radio-chips',
      options: [
        { label: 'Geen', value: 'Nee' }, // Tip: gebruik 'Nee' ipv '0' als je visibleIf daarop checkt
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

