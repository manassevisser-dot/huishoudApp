import { ImportOrchestrator } from '@app/orchestrators/ImportOrchestrator';
import { csvFactory } from '@test-utils/index';
import { DATA_KEYS } from '@domain/constants/datakeys';

describe('CSV Integration via ImportOrchestrator', () => {
  const setup = { maandelijksInkomen: 2500, housingIncluded: false };

  // Hulpfunctie om state te maken
  const createState = (income: number) => ({
    schemaVersion: '1.0' as const,
    activeStep: 'LANDING',
    currentScreenId: 'screen_1',
    isValid: true,
     data:{
      setup: { aantalMensen: 1, aantalVolwassen: 1, autoCount: 'Geen' },
      household: { members: [] },
      finance: {
        income: { items: [], totalAmount: income },
        expenses: { items: [] },
      },
    },
    meta: { lastModified: new Date().toISOString(), version: 1 },
  });

  it('verwerkt ING data met de Af/Bij kolom correct', () => {
    const { content } = csvFactory.createIng();
    const state = createState(250000);
    const orchestrator = new ImportOrchestrator();
    const result = orchestrator.processCsvImport({ csvText: content, state });

    expect(result.status).toBe('success');
    expect(result.summary.finalIncome).toBe(250000); // of wat je verwacht
  });

  it('geeft een lege lijst bij een corrupt bestand', () => {
    const { content } = csvFactory.createInvalid();
    const state = createState(0);
    const orchestrator = new ImportOrchestrator();
    const result = orchestrator.processCsvImport({ csvText: content, state });

    expect(result.status).toBe('empty');
    expect(result.transactions).toHaveLength(0);
  });

  it('moet transacties met 0 euro uitfilteren, maar uitgaven zonder omschrijving behouden', () => {
    const rawCsv = [
      'Datum;Naam;Rekening;Tegenrekening;Code;Af Bij;Bedrag;Mutatiesoort;Mededelingen',
      '20240101;Bakker;NL01;NL02;BA;Af;10,00;Betaalautomaat;Brood',
      '20240101;Ruis;NL01;NL02;BA;Af;0,00;Betaalautomaat;Niets',
      '20240101;Anoniem;NL01;NL02;BA;Af;5,00;Betaalautomaat; ',
    ].join('\n');

    const state = createState(0);
    const orchestrator = new ImportOrchestrator();
    const result = orchestrator.processCsvImport({ csvText: rawCsv, state });

    expect(result.transactions).toHaveLength(2);
    const hasZero = result.transactions.some(t => t.amount === 0);
    expect(hasZero).toBe(false);
  });

  it('moet PII strippen uit de omschrijvingen', () => {
    const rawCsv = [
      'Datum;Naam;Rekening;Tegenrekening;Code;Af Bij;Bedrag;Mutatiesoort;Mededelingen',
      '20240101;J. Jansen;NL01;NL02;BA;Af;50,00;Betaalautomaat;Huur van jan.jansen@email.com',
    ].join('\n');

    const state = createState(0);
    const orchestrator = new ImportOrchestrator();
    const result = orchestrator.processCsvImport({ csvText: rawCsv, state });

    const descriptions = result.transactions.map(t => t.description);
    expect(descriptions.join('')).not.toContain('email.com');
  });

  it('moet een lege lijst teruggeven als de csvText null is', () => {
    const state = createState(0);
    const orchestrator = new ImportOrchestrator();
    const result = orchestrator.processCsvImport({ csvText: null as any, state });

    expect(result.status).toBe('error');
    expect(result.transactions).toEqual([]);
  });
});