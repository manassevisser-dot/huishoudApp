import { dataOrchestrator } from '@services/dataOrchestrator';
import { csvFactory } from '@test-utils/index';
import { DATA_KEYS } from '@domain/constants/datakeys';

describe('CSV Integration via Factory', () => {
  const setup = { maandelijksInkomen: 2500, housingIncluded: false };

  it('verwerkt ING data met de Af/Bij kolom correct', () => {
    const { content } = csvFactory.createIng();
    const result = dataOrchestrator.processAllData([], content, setup);
    
    // Check de inkomsten uit de ING mock (2500.0)
    expect(result.local[DATA_KEYS.FINANCE].summary.finalIncome).toBe(250000); // in centen
  });

  it('geeft een lege lijst bij een corrupt bestand', () => {
    const { content } = csvFactory.createInvalid();
    const result = dataOrchestrator.processAllData([], content, setup);
    
    expect(result.local[DATA_KEYS.FINANCE].transactions).toHaveLength(0);
  });
});