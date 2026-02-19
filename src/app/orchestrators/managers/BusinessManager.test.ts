import { BusinessManager } from '@app/orchestrators/managers/BusinessManager';
import { FinancialOrchestrator } from '@app/orchestrators/FinancialOrchestrator';
import { createMockState } from '@test-utils/factories/stateFactory';
import type { FormState } from '@core/types/core';
import type { FinancialSummaryVM } from '@app/orchestrators/interfaces/IBusinessOrchestrator';

jest.mock('@app/orchestrators/FinancialOrchestrator', () => ({
  FinancialOrchestrator: {
    prepareViewModel: jest.fn(),
  },
}));

describe('BusinessManager', () => {
  let businessManager: BusinessManager;

  beforeEach(() => {
    businessManager = new BusinessManager();
    jest.clearAllMocks();
  });

  describe('prepareFinancialViewModel', () => {
    it('roept FinancialOrchestrator.prepareViewModel aan met de gegeven state', () => {
      // Arrange: geldige FormState via factory
      const mockState: FormState = createMockState();

      const mockResult: FinancialSummaryVM = {
        totalIncomeDisplay: '€30,00',
        totalExpensesDisplay: '€20,00',
        netDisplay: '€10,00',
      };

      (FinancialOrchestrator.prepareViewModel as jest.Mock).mockReturnValue(mockResult);

      // Act
      const result = businessManager.prepareFinancialViewModel(mockState);

      // Assert
      expect(FinancialOrchestrator.prepareViewModel).toHaveBeenCalledWith(mockState);
      expect(result).toEqual(mockResult);
    });

    it('werkt ook met lege state', () => {
      const minimalState = createMockState();

      const expectedVm: FinancialSummaryVM = {
        totalIncomeDisplay: '€0,00',
        totalExpensesDisplay: '€0,00',
        netDisplay: '€0,00',
      };

      (FinancialOrchestrator.prepareViewModel as jest.Mock).mockReturnValue(expectedVm);

      const result = businessManager.prepareFinancialViewModel(minimalState);

      expect(result).toEqual(expectedVm);
    });
  });
});