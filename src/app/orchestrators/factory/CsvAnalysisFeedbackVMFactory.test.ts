// src/app/orchestrators/factory/CsvAnalysisFeedbackVMFactory.test.ts
import { CsvAnalysisFeedbackVMFactory } from './CsvAnalysisFeedbackVMFactory';
import type { CsvAnalysisResult } from '@app/orchestrators/types/csvUpload.types';
import { formatCurrency } from '@domain/helpers/numbers';
import WizStrings from '@config/WizStrings';

// Mock dependencies
jest.mock('@domain/helpers/numbers', () => ({
  formatCurrency: jest.fn((cents: number) => `€ ${(cents / 100).toFixed(2)}`),
}));

jest.mock('@config/WizStrings', () => ({
  csvAnalysis: {
    emptyTitle: 'Lege analyse',
    emptyMessage: 'Geen data om te tonen',
    title: 'Analyse resultaat',
    warningDiscrepancy: '⚠️ Inkomen wijkt af',
    warningMissingCosts: '⚠️ Woonlasten ontbreken',
    periodTitle: 'Periode overzicht',
    labelTotalIncome: 'Totaal inkomsten:',
    labelTotalExpenses: 'Totaal uitgaven:',
    labelBalance: 'Saldo:',
    labelTransactionCount: 'Aantal transacties:',
    comparisonTitle: 'Vergelijking met wizard',
    labelCsvIncome: 'CSV inkomen:',
    labelSetupIncome: 'Wizard inkomen:',
    labelDifference: 'Verschil:',
  },
}));

describe('CsvAnalysisFeedbackVMFactory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('build with undefined/null input', () => {
    it('should return empty VM when input is undefined', () => {
      const result = CsvAnalysisFeedbackVMFactory.build(undefined);

      expect(result.isEmpty).toBe(true);
      expect(result.emptyTitle).toBe('Lege analyse');
      expect(result.emptyMessage).toBe('Geen data om te tonen');
      expect(result.title).toBe('');
      expect(result.warnings).toEqual([]);
      expect(result.periodTitle).toBe('');
      expect(result.periodRows).toEqual([]);
      expect(result.showSetupComparison).toBe(false);
      expect(result.setupComparison).toBeNull();
    });

    it('should return empty VM when input is null', () => {
      const result = CsvAnalysisFeedbackVMFactory.build(null);

      expect(result.isEmpty).toBe(true);
    });
  });

  describe('build with valid analysis result', () => {
    const mockAnalysis: CsvAnalysisResult = {
      isDiscrepancy: false,
      hasMissingCosts: false,
      discrepancyDetails: undefined,
      periodSummary: {
        totalIncomeCents: 250000,
        totalExpensesCents: 180000,
        balanceCents: 70000,
        transactionCount: 42,
      },
      setupComparison: null,
    };

    it('should return non-empty VM with correct base properties', () => {
      const result = CsvAnalysisFeedbackVMFactory.build(mockAnalysis);

      expect(result.isEmpty).toBe(false);
      expect(result.emptyTitle).toBe('Lege analyse');
      expect(result.emptyMessage).toBe('Geen data om te tonen');
      expect(result.title).toBe('Analyse resultaat');
      expect(result.periodTitle).toBe('Periode overzicht');
      expect(result.showSetupComparison).toBe(false);
      expect(result.setupComparison).toBeNull();
    });

    it('should format period rows correctly', () => {
      const result = CsvAnalysisFeedbackVMFactory.build(mockAnalysis);

      expect(result.periodRows).toHaveLength(4);
      expect(result.periodRows[0]).toEqual({
        label: 'Totaal inkomsten:',
        value: '€ 2500.00',
        colorRole: 'success',
      });
      expect(result.periodRows[1]).toEqual({
        label: 'Totaal uitgaven:',
        value: '€ 1800.00',
        colorRole: 'error',
      });
      expect(result.periodRows[2]).toEqual({
        label: 'Saldo:',
        value: '€ 700.00',
        colorRole: 'success',
      });
      expect(result.periodRows[3]).toEqual({
        label: 'Aantal transacties:',
        value: '42',
        colorRole: 'textPrimary',
      });

      expect(formatCurrency).toHaveBeenCalledTimes(3);
      expect(formatCurrency).toHaveBeenCalledWith(250000);
      expect(formatCurrency).toHaveBeenCalledWith(180000);
      expect(formatCurrency).toHaveBeenCalledWith(70000);
    });

    it('should set balance color role to error when negative', () => {
      const negativeBalanceAnalysis: CsvAnalysisResult = {
        ...mockAnalysis,
        periodSummary: {
          ...mockAnalysis.periodSummary,
          balanceCents: -5000,
        },
      };

      const result = CsvAnalysisFeedbackVMFactory.build(negativeBalanceAnalysis);
      
      expect(result.periodRows[2].colorRole).toBe('error');
      expect(result.periodRows[2].value).toBe('€ -50.00');
    });
  });

  describe('warnings', () => {
    const baseAnalysis: CsvAnalysisResult = {
      isDiscrepancy: false,
      hasMissingCosts: false,
      discrepancyDetails: undefined,
      periodSummary: {
        totalIncomeCents: 1000,
        totalExpensesCents: 800,
        balanceCents: 200,
        transactionCount: 10,
      },
      setupComparison: null,
    };

    it('should show no warnings when none present', () => {
      const result = CsvAnalysisFeedbackVMFactory.build(baseAnalysis);
      expect(result.warnings).toEqual([]);
    });

    it('should show discrepancy warning when isDiscrepancy is true', () => {
      const analysis: CsvAnalysisResult = {
        ...baseAnalysis,
        isDiscrepancy: true,
      };

      const result = CsvAnalysisFeedbackVMFactory.build(analysis);
      
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0]).toEqual({
        id: 'discrepancy',
        label: '⚠️ Inkomen wijkt af',
        colorRole: 'warning',
      });
    });

    it('should show missing costs warning when hasMissingCosts is true', () => {
      const analysis: CsvAnalysisResult = {
        ...baseAnalysis,
        hasMissingCosts: true,
      };

      const result = CsvAnalysisFeedbackVMFactory.build(analysis);
      
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0]).toEqual({
        id: 'missingCosts',
        label: '⚠️ Woonlasten ontbreken',
        colorRole: 'warning',
      });
    });

    it('should show both warnings when both are true', () => {
      const analysis: CsvAnalysisResult = {
        ...baseAnalysis,
        isDiscrepancy: true,
        hasMissingCosts: true,
      };

      const result = CsvAnalysisFeedbackVMFactory.build(analysis);
      
      expect(result.warnings).toHaveLength(2);
      expect(result.warnings[0].id).toBe('discrepancy');
      expect(result.warnings[1].id).toBe('missingCosts');
    });
  });

  describe('setup comparison', () => {
    const baseAnalysis: CsvAnalysisResult = {
      isDiscrepancy: false,
      hasMissingCosts: false,
      discrepancyDetails: undefined,
      periodSummary: {
        totalIncomeCents: 250000,
        totalExpensesCents: 180000,
        balanceCents: 70000,
        transactionCount: 42,
      },
      setupComparison: {
        csvIncomeCents: 250000,
        setupIncomeCents: 200000,
        diffCents: 50000,
      },
    };

    it('should show setup comparison when present', () => {
      const result = CsvAnalysisFeedbackVMFactory.build(baseAnalysis);

      expect(result.showSetupComparison).toBe(true);
      expect(result.setupComparison).not.toBeNull();
      expect(result.setupComparison?.title).toBe('Vergelijking met wizard');
      expect(result.setupComparison?.rows).toHaveLength(3);
    });

    it('should format comparison rows correctly', () => {
      const result = CsvAnalysisFeedbackVMFactory.build(baseAnalysis);

      expect(result.setupComparison?.rows[0]).toEqual({
        label: 'CSV inkomen:',
        value: '€ 2500.00',
        colorRole: 'success',
      });
      expect(result.setupComparison?.rows[1]).toEqual({
        label: 'Wizard inkomen:',
        value: '€ 2000.00',
        colorRole: 'textPrimary',
      });
      expect(result.setupComparison?.rows[2]).toEqual({
        label: 'Verschil:',
        value: '€ 500.00',
        colorRole: 'success',
      });
    });

    it('should set diff color role to success when diff is positive', () => {
      const result = CsvAnalysisFeedbackVMFactory.build(baseAnalysis);
      expect(result.setupComparison?.rows[2].colorRole).toBe('success');
    });

    it('should set diff color role to error when diff is negative', () => {
      const negativeDiffAnalysis: CsvAnalysisResult = {
        ...baseAnalysis,
        setupComparison: {
          csvIncomeCents: 200000,
          setupIncomeCents: 250000,
          diffCents: -50000,
        },
      };

      const result = CsvAnalysisFeedbackVMFactory.build(negativeDiffAnalysis);
      expect(result.setupComparison?.rows[2].colorRole).toBe('error');
      expect(result.setupComparison?.rows[2].value).toBe('€ -500.00');
    });

    it('should format zero diff correctly', () => {
      const zeroDiffAnalysis: CsvAnalysisResult = {
        ...baseAnalysis,
        setupComparison: {
          csvIncomeCents: 250000,
          setupIncomeCents: 250000,
          diffCents: 0,
        },
      };

      const result = CsvAnalysisFeedbackVMFactory.build(zeroDiffAnalysis);
      expect(result.setupComparison?.rows[2].value).toBe('€ 0.00');
      expect(result.setupComparison?.rows[2].colorRole).toBe('success');
    });
  });

  describe('edge cases', () => {
    it('should handle zero values in period summary', () => {
      const zeroAnalysis: CsvAnalysisResult = {
        isDiscrepancy: false,
        hasMissingCosts: false,
        discrepancyDetails: undefined,
        periodSummary: {
          totalIncomeCents: 0,
          totalExpensesCents: 0,
          balanceCents: 0,
          transactionCount: 0,
        },
        setupComparison: null,
      };

      const result = CsvAnalysisFeedbackVMFactory.build(zeroAnalysis);

      expect(result.periodRows[0].value).toBe('€ 0.00');
      expect(result.periodRows[1].value).toBe('€ 0.00');
      expect(result.periodRows[2].value).toBe('€ 0.00');
      expect(result.periodRows[2].colorRole).toBe('success');
      expect(result.periodRows[3].value).toBe('0');
    });

    it('should handle large numbers correctly', () => {
      const largeAnalysis: CsvAnalysisResult = {
        isDiscrepancy: false,
        hasMissingCosts: false,
        discrepancyDetails: undefined,
        periodSummary: {
          totalIncomeCents: 1000000000, // €10.000.000,00
          totalExpensesCents: 500000000,
          balanceCents: 500000000,
          transactionCount: 999999,
        },
        setupComparison: null,
      };

      const result = CsvAnalysisFeedbackVMFactory.build(largeAnalysis);

      expect(result.periodRows[0].value).toBe('€ 10000000.00');
      expect(result.periodRows[1].value).toBe('€ 5000000.00');
      expect(result.periodRows[2].value).toBe('€ 5000000.00');
      expect(result.periodRows[3].value).toBe('999999');
    });

    it('should handle analysis with undefined discrepancyDetails', () => {
      const analysis: CsvAnalysisResult = {
        isDiscrepancy: true,
        hasMissingCosts: false,
        discrepancyDetails: 'Some details', // Dit wordt niet gebruikt in VM
        periodSummary: {
          totalIncomeCents: 1000,
          totalExpensesCents: 800,
          balanceCents: 200,
          transactionCount: 5,
        },
        setupComparison: null,
      };

      const result = CsvAnalysisFeedbackVMFactory.build(analysis);

      // discrepancyDetails wordt niet gebruikt in VM
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings[0].id).toBe('discrepancy');
    });
  });

  describe('contract verification', () => {
    it('should always return a valid CsvAnalysisFeedbackVM', () => {
      // Test met undefined
      const undefinedResult = CsvAnalysisFeedbackVMFactory.build(undefined);
      expect(undefinedResult).toBeDefined();
      expect(undefinedResult).toHaveProperty('isEmpty');
      expect(undefinedResult).toHaveProperty('warnings');
      expect(undefinedResult).toHaveProperty('periodRows');

      // Test met geldige input
      const validResult = CsvAnalysisFeedbackVMFactory.build({
        isDiscrepancy: false,
        hasMissingCosts: false,
        discrepancyDetails: undefined,
        periodSummary: {
          totalIncomeCents: 100,
          totalExpensesCents: 50,
          balanceCents: 50,
          transactionCount: 1,
        },
        setupComparison: null,
      });
      expect(validResult).toBeDefined();
    });

    it('should be pure - same input always returns same output structure', () => {
      const input: CsvAnalysisResult = {
        isDiscrepancy: true,
        hasMissingCosts: true,
        discrepancyDetails: undefined,
        periodSummary: {
          totalIncomeCents: 1000,
          totalExpensesCents: 900,
          balanceCents: 100,
          transactionCount: 10,
        },
        setupComparison: {
          csvIncomeCents: 1000,
          setupIncomeCents: 950,
          diffCents: 50,
        },
      };

      const result1 = CsvAnalysisFeedbackVMFactory.build(input);
      const result2 = CsvAnalysisFeedbackVMFactory.build(input);

      expect(result1).toEqual(result2);
    });

    it('should use formatCurrency from helpers', () => {
      const analysis: CsvAnalysisResult = {
        isDiscrepancy: false,
        hasMissingCosts: false,
        discrepancyDetails: undefined,
        periodSummary: {
          totalIncomeCents: 123456,
          totalExpensesCents: 654321,
          balanceCents: -530865,
          transactionCount: 77,
        },
        setupComparison: {
          csvIncomeCents: 123456,
          setupIncomeCents: 100000,
          diffCents: 23456,
        },
      };

      CsvAnalysisFeedbackVMFactory.build(analysis);

      // formatCurrency moet 5x zijn aangeroepen:
      // - 3x voor periodRows
      // - 3x voor setupComparison (csvIncome + diff; setupIncome gebruikt ook formatCurrency)
      expect(formatCurrency).toHaveBeenCalledTimes(6);
    });
  });
});