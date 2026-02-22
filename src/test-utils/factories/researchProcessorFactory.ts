import type { ResearchProcessor } from '@app/orchestrators/interfaces/IDataOrchestrator';

export const researchProcessorFactory = (): ResearchProcessor => ({
  processAllData: jest.fn(),
});