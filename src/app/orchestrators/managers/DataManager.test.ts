import { DataManager } from './DataManager';
import { researchProcessorFactory } from 'src/test-utils/factories/researchProcessorFactory';

// Mock ImportOrchestrator
jest.mock('@app/orchestrators/ImportOrchestrator', () => ({
  ImportOrchestrator: {
    processCsvImport: jest.fn(),
  },
}));

import { ImportOrchestrator } from '@app/orchestrators/ImportOrchestrator';

describe('DataManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('roept ImportOrchestrator.processCsvImport aan met correcte parameters', () => {
    const research = researchProcessorFactory();
    const manager = new DataManager();

    const mockResult = { success: true, imported: 2 };
    (ImportOrchestrator.processCsvImport as jest.Mock).mockReturnValue(mockResult);

    const state = {
      data: {
        household: {
          members: [
            { id: 1, name: 'A' },
            { id: 2, name: 'B' },
          ],
        },
        setup: { foo: 'bar' },
      },
    } as any;

    const csvText = 'x;y;z';

    const result = manager.processCsvImport({ csvText, state });

    // correcte delegatie
    expect(ImportOrchestrator.processCsvImport).toHaveBeenCalledTimes(1);
    expect(ImportOrchestrator.processCsvImport).toHaveBeenCalledWith(
      research,
      {
        csvText,
        members: state.data.household.members,
        setupData: state.data.setup,
      }
    );

    expect(result).toBe(mockResult);
  });

  it('stuurt setupData = null wanneer setup ontbreekt', () => {
    const research = researchProcessorFactory();
    const manager = new DataManager(research);

    const state = {
      data: {
        household: { members: [{ id: 99 }] },
        setup: undefined,
      },
    } as any;

    manager.processCsvImport({ csvText: 'csv', state });

    expect(ImportOrchestrator.processCsvImport).toHaveBeenCalledWith(
      research,
      {
        csvText: 'csv',
        members: [{ id: 99 }],
        setupData: null,
      }
    );
  });
});