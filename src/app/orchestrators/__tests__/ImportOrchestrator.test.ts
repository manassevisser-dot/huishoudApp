import { ImportOrchestrator } from '../ImportOrchestrator';
import { dataOrchestrator } from '@app/orchestrators/ResearchOrchestrator.WIP';
jest.mock('@app/orchestrators/ResearchOrchestrator.WIP');

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
          summary: { source: 'CSV', finalIncome: 100, isDiscrepancy: false },
          hasMissingCosts: false
        }
      },
      research: { some: 'anonymous-data' }
    };

    (dataOrchestrator.processAllData as jest.Mock).mockReturnValue(mockResult);

    const result = orchestrator.processCsvImport({
      csvText: 'test;csv;data',
      members: [],
      setupData: {}
    });

    expect(dataOrchestrator.processAllData).toHaveBeenCalledWith([], 'test;csv;data', {});
    expect(result.transactions).toHaveLength(1);
    expect(result.researchPayload).toEqual(mockResult.research);
  });
});
