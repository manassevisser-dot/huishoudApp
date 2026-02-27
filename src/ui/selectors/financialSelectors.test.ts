// src/ui/selectors/financialSelectors.test.ts
import { selectFinancialSummaryVM } from './financialSelectors';
import type { FormState } from '@core/types/core';

describe('financialSelectors', () => {
  describe('selectFinancialSummaryVM', () => {
    it('should return financial summary from viewModels when present', () => {
      // Arrange
      const mockState: FormState = {
        schemaVersion: '1.0',
        activeStep: 'DASHBOARD',
        currentScreenId: 'dashboard',
        isValid: true,
        data: {} as any,
        viewModels: {
          financialSummary: {
            totalIncomeDisplay: '€ 1.234,56',
            totalExpensesDisplay: '€ 789,12',
            netDisplay: '€ 445,44',
          },
        },
        meta: {
          lastModified: '2024-01-01T00:00:00.000Z',
          version: 1,
        },
      };

      // Act
      const result = selectFinancialSummaryVM(mockState);

      // Assert
      expect(result).toEqual({
        totalIncomeDisplay: '€ 1.234,56',
        totalExpensesDisplay: '€ 789,12',
        netDisplay: '€ 445,44',
      });
    });

    it('should return default values when viewModels is undefined', () => {
      // Arrange
      const mockState: FormState = {
        schemaVersion: '1.0',
        activeStep: 'DASHBOARD',
        currentScreenId: 'dashboard',
        isValid: true,
        data: {} as any,
        viewModels: undefined,
        meta: {
          lastModified: '2024-01-01T00:00:00.000Z',
          version: 1,
        },
      };

      // Act
      const result = selectFinancialSummaryVM(mockState);

      // Assert
      expect(result).toEqual({
        totalIncomeDisplay: '€ 0,00',
        totalExpensesDisplay: '€ 0,00',
        netDisplay: '€ 0,00',
      });
    });

    it('should return default values when financialSummary is undefined', () => {
      // Arrange
      const mockState: FormState = {
        schemaVersion: '1.0',
        activeStep: 'DASHBOARD',
        currentScreenId: 'dashboard',
        isValid: true,
        data: {} as any,
        viewModels: {
          // financialSummary ontbreekt
        },
        meta: {
          lastModified: '2024-01-01T00:00:00.000Z',
          version: 1,
        },
      };

      // Act
      const result = selectFinancialSummaryVM(mockState);

      // Assert
      expect(result).toEqual({
        totalIncomeDisplay: '€ 0,00',
        totalExpensesDisplay: '€ 0,00',
        netDisplay: '€ 0,00',
      });
    });

    it('should handle null financialSummary gracefully', () => {
      // Arrange
      const mockState: FormState = {
        schemaVersion: '1.0',
        activeStep: 'DASHBOARD',
        currentScreenId: 'dashboard',
        isValid: true,
        data: {} as any,
        viewModels: {
          financialSummary: null as any,
        },
        meta: {
          lastModified: '2024-01-01T00:00:00.000Z',
          version: 1,
        },
      };

      // Act
      const result = selectFinancialSummaryVM(mockState);

      // Assert
      expect(result).toEqual({
        totalIncomeDisplay: '€ 0,00',
        totalExpensesDisplay: '€ 0,00',
        netDisplay: '€ 0,00',
      });
    });

    it('should return default values when state is incomplete', () => {
      // Arrange
      const mockState = {
        // onvolledige state
        viewModels: undefined,
      } as FormState;

      // Act
      const result = selectFinancialSummaryVM(mockState);

      // Assert
      expect(result).toEqual({
        totalIncomeDisplay: '€ 0,00',
        totalExpensesDisplay: '€ 0,00',
        netDisplay: '€ 0,00',
      });
    });

    it('should handle malformed financialSummary with missing properties', () => {
      // Arrange
      const mockState: FormState = {
        schemaVersion: '1.0',
        activeStep: 'DASHBOARD',
        currentScreenId: 'dashboard',
        isValid: true,
        data: {} as any,
        viewModels: {
          financialSummary: {
            // missing properties
            totalIncomeDisplay: '€ 1.234,56',
           totalExpensesDisplay: '€ 0,00',
             netDisplay: '€ 0,00',
          },
        },
        meta: {
          lastModified: '2024-01-01T00:00:00.000Z',
          version: 1,
        },
      };

      // Act
      const result = selectFinancialSummaryVM(mockState);

      // Assert - de selector returned gewoon het incomplete object
      expect(result).toEqual({
        totalIncomeDisplay: '€ 1.234,56',
        totalExpensesDisplay: '€ 0,00',
        netDisplay: '€ 0,00',
      });
    });

    it('should be a pure function - same input always returns same output', () => {
      // Arrange
      const mockState: FormState = {
        schemaVersion: '1.0',
        activeStep: 'DASHBOARD',
        currentScreenId: 'dashboard',
        isValid: true,
        data: {} as any,
        viewModels: {
          financialSummary: {
            totalIncomeDisplay: '€ 1.234,56',
            totalExpensesDisplay: '€ 789,12',
            netDisplay: '€ 445,44',
          },
        },
        meta: {
          lastModified: '2024-01-01T00:00:00.000Z',
          version: 1,
        },
      };

      // Act
      const result1 = selectFinancialSummaryVM(mockState);
      const result2 = selectFinancialSummaryVM(mockState);

      // Assert
      expect(result1).toBe(result2); // Same reference
      expect(result1).toEqual(result2);
    });
  });
});