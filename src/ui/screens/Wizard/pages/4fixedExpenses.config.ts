import { TempPageConfig, FormState} from '@shared-types/form';

export const fixedExpensesConfig: TempPageConfig = {
  id: '4fixedExpenses',
  title: 'Vaste Lasten',
  fields: [
    {
      id: 'wonen',
      label: 'Wonen',
      type: 'section',
      fields: [
        { id: 'bedrag', label: 'Huur / Hypotheek (€/mnd)', type: 'money' }
      ]
    },
    // Dynamische Sectie: Auto's (Alleen als op pagina 1 auto's zijn gekozen)
    {
      id: 'vervoer',
      label: 'Vervoer (Auto)',
      type: 'repeater',
      // We gebruiken hier het getal dat de gebruiker eerder koos (bijv. 2 auto's)
      countGetter: (state: FormState) => {
        const val = state.setup?.autoCount; // 'Eén' of 'Twee'
        if (val === 'Een') return 1;
        if (val === 'Twee') return 2;
        return 0;
      },
      visibleIf: (state: FormState) => state.setup?.autoCount !== 'Nee',
      fields: [
        { id: 'vast', label: 'Verzekering + Belasting', type: 'money' },
        { id: 'brandstof', label: 'Brandstof / Laden', type: 'money' }
      ]
    },
    // Collapsible Sectie: Streaming (Jouw STREAMING_KEYS lijst)
    {
      id: 'abonnementen',
      label: 'Streaming & Abonnementen',
      type: 'collapsible-section',
      fields: [
        { id: 'netflix', label: 'Netflix', type: 'money' },
        { id: 'videoland', label: 'Videoland', type: 'money' },
        { id: 'hbo', label: 'HBO Max', type: 'money' },
        { id: 'disneyPlus', label: 'Disney+', type: 'money' }
      ]
    }
  ],
};