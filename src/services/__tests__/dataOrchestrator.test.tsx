import { dataOrchestrator } from '../dataOrchestrator';
import { DATA_KEYS } from '@domain/constants/datakeys';
import { csvFactory } from '@test-utils/index';

describe('DataOrchestrator Unit Tests', () => {
  const mockSetup = { maandelijksInkomen: 2000, housingIncluded: false };
  const mockMembers = [
    { id: '1', name: 'Test Gebruiker', role: 'Hoofdgebruiker' }
  ];

  it('zou data moeten splitsen in een local en research laag', () => {
    const { content } = csvFactory.createIng();
    
    const result = dataOrchestrator.processAllData(mockMembers, content, mockSetup);

    // Controleer of de hoofdstructuur aanwezig is
    expect(result).toHaveProperty('local');
    expect(result).toHaveProperty('research');

    // Controleer de lokale laag (voor de UI)
    expect(result.local[DATA_KEYS.FINANCE]).toBeDefined();
    expect(result.local[DATA_KEYS.HOUSEHOLD].members).toHaveLength(1);

    // Controleer de research laag (voor analytics)
    expect(result.research.financialAnalytics).toBeDefined();
    expect(result.research.memberPayloads).toHaveLength(1);
    // De naam mag NOOIT in de research laag staan
    expect(JSON.stringify(result.research)).not.toContain('Test Gebruiker');
  });

  it('zou foutloos moeten omgaan met een lege CSV', () => {
    const result = dataOrchestrator.processAllData([], '', mockSetup);
    expect(result.local[DATA_KEYS.FINANCE].transactions).toHaveLength(0);
  });
});