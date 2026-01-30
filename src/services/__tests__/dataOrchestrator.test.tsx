
import { dataOrchestrator } from '../dataOrchestrator';
import { DATA_KEYS } from '@domain/constants/datakeys';
import { csvFactory } from '@test-utils/index';
import { csvService } from '@adapters/csv/csvService';
import { Logger } from '@/adapters/audit/AuditLoggerAdapter';
import { dataProcessor } from '../dataProcessor';

describe('DataOrchestrator Unit Tests', () => {
  const mockSetup = { maandelijksInkomen: 2000, housingIncluded: false };
  const mockMembers = [{ id: '1', name: 'Test Gebruiker', role: 'Hoofdgebruiker' }];

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('zou data moeten splitsen in een local en research laag', () => {
    const { content } = csvFactory.createIng();

    const result = dataOrchestrator.processAllData(mockMembers, content, mockSetup);

    // Hoofdstructuur
    expect(result).toHaveProperty('local');
    expect(result).toHaveProperty('research');

    // Lokale laag
    expect(result.local[DATA_KEYS.FINANCE]).toBeDefined();
    expect(result.local[DATA_KEYS.HOUSEHOLD].members).toHaveLength(1);

    // Research laag
    expect(result.research.financialAnalytics).toBeDefined();
    expect(result.research.memberPayloads).toHaveLength(1);

    // De naam mag NOOIT in de research laag staan
    expect(JSON.stringify(result.research)).not.toContain('Test Gebruiker');
  });

  it('zou foutloos moeten omgaan met een lege CSV', () => {
    const result = dataOrchestrator.processAllData([], '', mockSetup);
    expect(result.local[DATA_KEYS.FINANCE].transactions).toHaveLength(0);
  });

  it('zou de catch-block moeten dekken wanneer CSV mapping crasht', () => {
    // Forceer een error in de adapter
    const spy = jest.spyOn(csvService, 'mapToInternalModel').mockImplementation(() => {
      throw new Error('Boom');
    });

    const loggerSpy = jest.spyOn(Logger, 'error').mockImplementation(() => {});

    const result = dataOrchestrator.processAllData([], 'ongeldige-data', mockSetup);

    // Orchestrator overleeft en geeft lege lijst terug
    expect(result.local[DATA_KEYS.FINANCE].transactions).toEqual([]);
    expect(loggerSpy).toHaveBeenCalled();

    spy.mockRestore();
    loggerSpy.mockRestore();
  });

  it('zou fallback waarden moeten gebruiken voor incomplete CSV items', () => {
    // Dekt branches: item.date || now-ISO, item.description || "Geen omschrijving"
    jest.spyOn(csvService, 'mapToInternalModel').mockReturnValue([
      {
        amount: 100,
        date: '',
        description: '',
        original: {} as any, // TS: property aanwezig houden
      } as any,
    ]);

    const result = dataOrchestrator.processAllData([], 'raw', mockSetup);
    const tx = result.local[DATA_KEYS.FINANCE].transactions[0];

    expect(tx.date).toBeDefined(); // Verwacht ISO-string (nu)
    expect(typeof tx.date).toBe('string');
    expect(tx.description).toBe('Geen omschrijving');
  });

  it('zou hasMissingCosts op true moeten zetten als Wonen gedetecteerd wordt zonder housingIncluded', () => {
    // Forceer 1 transactie en categoriseer als 'Wonen'
    jest.spyOn(csvService, 'mapToInternalModel').mockReturnValue([
      {
        amount: -500,
        date: '2023-01-01',
        description: 'Huur',
        original: {} as any,
      } as any,
    ]);

    jest.spyOn(dataProcessor, 'categorize').mockReturnValue('Wonen');

    const result = dataOrchestrator.processAllData([], 'raw', { housingIncluded: false });
    expect(result.local[DATA_KEYS.FINANCE].hasMissingCosts).toBe(true);
  });
});
