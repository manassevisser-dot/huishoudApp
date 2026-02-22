import { ImportOrchestrator } from './ImportOrchestrator';
import { ResearchOrchestrator } from '@app/orchestrators/ResearchOrchestrator';
jest.mock('@app/orchestrators/ResearchOrchestrator');

describe('ImportOrchestrator', () => {
  let orchestrator: ImportOrchestrator;

  beforeEach(() => {
    orchestrator = new ImportOrchestrator();
    jest.clearAllMocks();;
  });

  it('zou data correct moeten delegeren aan de domein-wasstraat', () => {
    const mockResult = {
      local: {
        finance: {
          transactions: [{ amount: 100, description: 'Test', date: '2024-01-01' }],
          summary: { source: 'csv', finalIncome: 100, isDiscrepancy: false },
          hasMissingCosts: false
        }
      },
      research: { some: 'anonymous-data' }
    };

    (ResearchOrchestrator.prototype.processAllData as jest.Mock).mockReturnValue(mockResult);

    const result = orchestrator.processCsvImport({
      csvText: 'test;csv;data',
      members: [],
      setupData: {}
    });

    expect(ResearchOrchestrator.prototype.processAllData).toHaveBeenCalledWith([], 'test;csv;data', {});
    expect(result.transactions).toHaveLength(1);
    expect(result.researchPayload).toEqual(mockResult.research);
  });
});
