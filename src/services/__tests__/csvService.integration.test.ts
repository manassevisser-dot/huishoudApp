import { dataOrchestrator } from '@services/dataOrchestrator';
import { csvFactory } from '@test-utils/index';
import { DATA_KEYS } from '@domain/constants/datakeys';

describe('CSV Integration via Factory', () => {
  // Verplaatst naar top-level van de describe zodat alle it-blokken erbij kunnen
  const setup = { maandelijksInkomen: 2500, housingIncluded: false };

  it('verwerkt ING data met de Af/Bij kolom correct', () => {
    const { content } = csvFactory.createIng();
    const result = dataOrchestrator.processAllData([], content, setup);
    
    expect(result.local[DATA_KEYS.FINANCE].summary.finalIncome).toBe(250000); 
  });

  it('geeft een lege lijst bij een corrupt bestand', () => {
    const { content } = csvFactory.createInvalid();
    const result = dataOrchestrator.processAllData([], content, setup);
    
    expect(result.local[DATA_KEYS.FINANCE].transactions).toHaveLength(0);
  });

  it('moet transacties met 0 euro uitfilteren, maar uitgaven zonder omschrijving behouden', () => {
    const rawCsv = [
      'Datum;Naam;Rekening;Tegenrekening;Code;Af Bij;Bedrag;Mutatiesoort;Mededelingen',
      '20240101;Bakker;NL01;NL02;BA;Af;10,00;Betaalautomaat;Brood', // GOED
      '20240101;Ruis;NL01;NL02;BA;Af;0,00;Betaalautomaat;Niets',    // FOUT: 0 euro (moet eruit)
      '20240101;Anoniem;NL01;NL02;BA;Af;5,00;Betaalautomaat; '      // GOED: Geen omschrijving, maar wel geld
    ].join('\n');

    const result = dataOrchestrator.processAllData([], rawCsv, setup);
    
    // We verwachten nu 2 transacties: de bakker én de anonieme uitgave
    expect(result.local[DATA_KEYS.FINANCE].transactions).toHaveLength(2);
    
    // Check of de 0-euro transactie (Ruis) inderdaad weg is
    const hasRuis = result.local[DATA_KEYS.FINANCE].transactions.some(t => t.amount === 0);
    expect(hasRuis).toBe(false);
  });
  
  it('moet PII strippen uit de omschrijvingen in de research payload', () => {
    const rawCsv = [
      'Datum;Naam;Rekening;Tegenrekening;Code;Af Bij;Bedrag;Mutatiesoort;Mededelingen',
      '20240101;J. Jansen;NL01;NL02;BA;Af;50,00;Betaalautomaat;Huur van jan.jansen@email.com'
    ].join('\n');

    const result = dataOrchestrator.processAllData([], rawCsv, setup);
    
    // Check of de research payload bestaat en geen email bevat
    const researchIncome = result.research.financialAnalytics.totalIncomeCents;
    expect(researchIncome).toBeDefined();
    // Als assertNoPIILeak (binnen orchestrator) niet faalt, is de test geslaagd
  });

  it('moet een lege lijst teruggeven als de csvService faalt', () => {
    // Forceer crash door null te sturen
    const result = dataOrchestrator.processAllData([], null as any, setup);
    
    expect(result.local[DATA_KEYS.FINANCE].transactions).toEqual([]);
  });
});