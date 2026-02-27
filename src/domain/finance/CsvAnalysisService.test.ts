// src/domain/finance/CsvAnalysisService.test.ts
import { CsvAnalysisService } from './CsvAnalysisService';
import type { ParsedCsvTransaction, CsvOriginalMetadata } from '@app/orchestrators/types/csvUpload.types';
import type { SetupData, Finance } from '@core/types/core';
import { INCOME_DISCREPANCY_THRESHOLD_CENTS } from '@domain/constants/businessRules';

// Mock de helpers die extern zijn
jest.mock('@domain/helpers/numbers', () => ({
  toCents: jest.fn((amount: number) => Math.round(amount * 100)),
  formatCurrency: jest.fn((cents: number) => `€ ${(cents / 100).toFixed(2)}`),
}));

jest.mock('@domain/rules/calculateRules', () => ({
  computePhoenixSummary: jest.fn(() => ({ totalIncomeCents: 250000 })),
}));

jest.mock('@domain/finance/StatementIntakePipeline', () => ({
  dataProcessor: {
    categorize: jest.fn((description: string) => {
      if (description.includes('huur')) return 'Wonen';
      if (description.includes('hypotheek')) return 'Wonen';
      if (description.includes('boodschappen')) return 'Boodschappen';
      return 'Overig';
    }),
  },
}));

describe('CsvAnalysisService', () => {
  // Helper functie voor het maken van CsvOriginalMetadata
  const createOriginalMetadata = (raw: string, flags: CsvOriginalMetadata['flags'] = []): CsvOriginalMetadata => ({
    rawDigest: Buffer.from(raw).toString('base64').slice(0, 10),
    schemaVersion: '1.0',
    importedAt: new Date().toISOString(),
    columnMapVersion: '1.0',
    flags,
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('analyse', () => {
    // Basis mock transacties
    const mockTransactions: ParsedCsvTransaction[] = [
      {
        id: '1',
        date: '2024-01-01',
        description: 'Salaris',
        amount: 2500,
        amountCents: 250000,
        category: 'Inkomen',
        isIgnored: false,
        fieldId: 'income.salary',
        original: createOriginalMetadata('Salaris;2500'),
      },
      {
        id: '2',
        date: '2024-01-02',
        description: 'Boodschappen',
        amount: -150.50,
        amountCents: -15050,
        category: 'Boodschappen',
        isIgnored: false,
        fieldId: 'expenses.groceries',
        original: createOriginalMetadata('Boodschappen;-150.50'),
      },
      {
        id: '3',
        date: '2024-01-03',
        description: 'Huur',
        amount: -800,
        amountCents: -80000,
        category: 'Wonen',
        isIgnored: false,
        fieldId: 'expenses.rent',
        original: createOriginalMetadata('Huur;-800'),
      },
    ];

    // Basis mock SetupData
    const mockSetupData: SetupData = {
      aantalMensen: 2,
      aantalVolwassen: 2,
      autoCount: '1',
      woningType: 'Huur',
      savings: [],
      people: [],
      heeftHuisdieren: false,
    };

    // Basis mock Finance
    const mockFinance: Finance = {
      income: {
        salaries: [{
          id: 'salary1',
          label: 'Salaris',
          bedragen: [2500],
          leeftijden: [],
        }],
      },
      expenses: {
        kaleHuur: 800,
        woonlasten: 0,
        hypotheekBruto: 0,
        boodschappen: 150.50,
      },
      assets: {},
      liabilities: {},
      totalAssets: 0,
      totalLiabilities: 0,
      netWorth: 0,
    } as Finance;

    it('should calculate correct period totals for active transactions', () => {
      const result = CsvAnalysisService.analyse(mockTransactions, mockSetupData, mockFinance);

      expect(result.periodSummary).toEqual({
        totalIncomeCents: 250000,
        totalExpensesCents: 95050, // 15050 + 80000
        balanceCents: 154950, // 250000 - 95050
        transactionCount: 3,
      });
    });

    it('should ignore transactions marked as ignored', () => {
      const transactionsWithIgnored: ParsedCsvTransaction[] = [
        ...mockTransactions,
        {
          id: '4',
          date: '2024-01-04',
          description: 'Genegeerde transactie',
          amount: -100,
          amountCents: -10000,
          category: 'Overig',
          isIgnored: true,
          fieldId: 'expenses.other',
          original: createOriginalMetadata('Genegeerd;-100', ['missing_description']),
        },
      ];

      const result = CsvAnalysisService.analyse(transactionsWithIgnored, mockSetupData, mockFinance);

      expect(result.periodSummary.transactionCount).toBe(3);
      expect(result.periodSummary.totalExpensesCents).toBe(95050);
    });

    describe('income discrepancy detection', () => {
      it('should detect discrepancy when income differs significantly', () => {
        const computePhoenixSummaryMock = jest.requireMock('@domain/rules/calculateRules').computePhoenixSummary;
        computePhoenixSummaryMock.mockReturnValueOnce({ totalIncomeCents: 200000 });

        const result = CsvAnalysisService.analyse(mockTransactions, mockSetupData, mockFinance);

        expect(result.isDiscrepancy).toBe(true);
        expect(result.discrepancyDetails).toBeDefined();
        expect(result.setupComparison).toEqual({
          csvIncomeCents: 250000,
          setupIncomeCents: 200000,
          diffCents: 50000,
        });
      });

      it('should NOT detect discrepancy when difference is below threshold', () => {
        const computePhoenixSummaryMock = jest.requireMock('@domain/rules/calculateRules').computePhoenixSummary;
        computePhoenixSummaryMock.mockReturnValueOnce({ totalIncomeCents: 245000 });

        const result = CsvAnalysisService.analyse(mockTransactions, mockSetupData, mockFinance);

        expect(result.isDiscrepancy).toBe(false);
        expect(result.discrepancyDetails).toBeUndefined();
        expect(result.setupComparison).toEqual({
          csvIncomeCents: 250000,
          setupIncomeCents: 245000,
          diffCents: 5000,
        });
      });

      it('should handle threshold exactly at boundary', () => {
        const computePhoenixSummaryMock = jest.requireMock('@domain/rules/calculateRules').computePhoenixSummary;
        const exactDiff = INCOME_DISCREPANCY_THRESHOLD_CENTS;
        computePhoenixSummaryMock.mockReturnValueOnce({ totalIncomeCents: 250000 - exactDiff });

        const result = CsvAnalysisService.analyse(mockTransactions, mockSetupData, mockFinance);

        expect(result.isDiscrepancy).toBe(false);
      });

      it('should handle zero CSV income', () => {
        const noIncomeTransactions = mockTransactions.filter(tx => tx.amount < 0);
        
        const result = CsvAnalysisService.analyse(noIncomeTransactions, mockSetupData, mockFinance);

        expect(result.isDiscrepancy).toBe(false);
        expect(result.setupComparison).toBeNull();
        expect(result.discrepancyDetails).toBeUndefined();
      });
    });

    describe('missing housing costs detection', () => {
      it('should detect missing housing costs when wizard has €0 and CSV has Wonen transactions', () => {
        const result = CsvAnalysisService.analyse(mockTransactions, mockSetupData, {
          ...mockFinance,
          expenses: { kaleHuur: 0, woonlasten: 0, hypotheekBruto: 0 },
        } as Finance);

        expect(result.hasMissingCosts).toBe(true);
      });

      it('should NOT detect missing costs when wizard has housing costs', () => {
        const result = CsvAnalysisService.analyse(mockTransactions, mockSetupData, {
          ...mockFinance,
          expenses: { kaleHuur: 800, woonlasten: 50, hypotheekBruto: 0 },
        } as Finance);

        expect(result.hasMissingCosts).toBe(false);
      });

      it('should NOT detect missing costs when CSV has no Wonen transactions', () => {
        const noHousingTransactions = mockTransactions.filter(tx => tx.category !== 'Wonen');
        
        const result = CsvAnalysisService.analyse(noHousingTransactions, mockSetupData, mockFinance);

        expect(result.hasMissingCosts).toBe(false);
      });

      it('should NOT detect missing costs for "Gratis inwonend"', () => {
        const gratisInwonendSetup = {
          ...mockSetupData,
          woningType: 'Gratis inwonend',
        };

        const result = CsvAnalysisService.analyse(mockTransactions, gratisInwonendSetup, mockFinance);

        expect(result.hasMissingCosts).toBe(false);
      });

      it('should handle missing finance or setup data', () => {
        const result = CsvAnalysisService.analyse(mockTransactions, null, null);

        expect(result.hasMissingCosts).toBe(false);
      });
    });

    describe('effective category fallback', () => {
      it('should use existing category when available', () => {
        CsvAnalysisService.analyse(mockTransactions, mockSetupData, mockFinance);
        
        const dataProcessorMock = jest.requireMock('@domain/finance/StatementIntakePipeline').dataProcessor;
        expect(dataProcessorMock.categorize).not.toHaveBeenCalled();
      });

      it('should fall back to dataProcessor.categorize for empty category', () => {
        const transactionsWithNoCategory: ParsedCsvTransaction[] = [
          {
            id: '5',
            date: '2024-01-05',
            description: 'Huur betaling',
            amount: -800,
            amountCents: -80000,
            category: '',
            isIgnored: false,
            fieldId: 'expenses.rent2',
            original: createOriginalMetadata('Huur;-800'),
          },
        ];

        CsvAnalysisService.analyse(transactionsWithNoCategory, mockSetupData, mockFinance);

        const dataProcessorMock = jest.requireMock('@domain/finance/StatementIntakePipeline').dataProcessor;
        expect(dataProcessorMock.categorize).toHaveBeenCalledWith('Huur betaling');
      });

      it('should fall back to dataProcessor.categorize for "Overig" category', () => {
        const transactionsWithOverig: ParsedCsvTransaction[] = [
          {
            id: '6',
            date: '2024-01-06',
            description: 'Hypotheek',
            amount: -900,
            amountCents: -90000,
            category: 'Overig',
            isIgnored: false,
            fieldId: 'expenses.mortgage',
            original: createOriginalMetadata('Hypotheek;-900'),
          },
        ];

        CsvAnalysisService.analyse(transactionsWithOverig, mockSetupData, mockFinance);

        const dataProcessorMock = jest.requireMock('@domain/finance/StatementIntakePipeline').dataProcessor;
        expect(dataProcessorMock.categorize).toHaveBeenCalledWith('Hypotheek');
      });
    });

    describe('edge cases', () => {
      it('should handle empty transaction array', () => {
        const result = CsvAnalysisService.analyse([], mockSetupData, mockFinance);

        expect(result.periodSummary).toEqual({
          totalIncomeCents: 0,
          totalExpensesCents: 0,
          balanceCents: 0,
          transactionCount: 0,
        });
        expect(result.isDiscrepancy).toBe(false);
        expect(result.hasMissingCosts).toBe(false);
        expect(result.setupComparison).toBeNull();
      });

      it('should handle null finance for income calculation', () => {
        const result = CsvAnalysisService.analyse(mockTransactions, mockSetupData, null);

        expect(result.setupComparison).toEqual({
          csvIncomeCents: 250000,
          setupIncomeCents: 0,
          diffCents: 250000,
        });
        expect(result.isDiscrepancy).toBe(true);
      });

      it('should handle transactions with only income', () => {
        const incomeOnly = mockTransactions.filter(tx => tx.amount > 0);
        
        const result = CsvAnalysisService.analyse(incomeOnly, mockSetupData, mockFinance);

        expect(result.periodSummary.totalExpensesCents).toBe(0);
        expect(result.periodSummary.balanceCents).toBe(250000);
      });

      it('should handle transactions with only expenses', () => {
        const expensesOnly = mockTransactions.filter(tx => tx.amount < 0);
        
        const result = CsvAnalysisService.analyse(expensesOnly, mockSetupData, mockFinance);

        expect(result.periodSummary.totalIncomeCents).toBe(0);
        expect(result.periodSummary.balanceCents).toBe(-95050);
        expect(result.isDiscrepancy).toBe(false);
        expect(result.setupComparison).toBeNull();
      });

      it('should handle floating point amounts correctly', () => {
        const floatTransactions: ParsedCsvTransaction[] = [
          {
            id: '7',
            date: '2024-01-07',
            description: 'Salaris',
            amount: 2500.99,
            amountCents: 250099,
            category: 'Inkomen',
            isIgnored: false,
            fieldId: 'income.salary2',
            original: createOriginalMetadata('Salaris;2500.99'),
          },
          {
            id: '8',
            date: '2024-01-08',
            description: 'Koffie',
            amount: -3.75,
            amountCents: -375,
            category: 'Uitgaven',
            isIgnored: false,
            fieldId: 'expenses.coffee',
            original: createOriginalMetadata('Koffie;-3.75'),
          },
        ];

        const result = CsvAnalysisService.analyse(floatTransactions, mockSetupData, mockFinance);

        expect(result.periodSummary.totalIncomeCents).toBe(250099);
        expect(result.periodSummary.totalExpensesCents).toBe(375);
      });
    });
  });

  describe('behavioral verification', () => {
    it('should use INCOME_DISCREPANCY_THRESHOLD_CENTS from businessRules', () => {
      expect(INCOME_DISCREPANCY_THRESHOLD_CENTS).toBeDefined();
      expect(typeof INCOME_DISCREPANCY_THRESHOLD_CENTS).toBe('number');
    });

    it('should handle all transaction categories correctly', () => {
      // Hier gebruik ik createOriginalMetadata van de outer scope
      const mixedCategoryTransactions: ParsedCsvTransaction[] = [
        { 
          id: 'c1', 
          date: '2024-01-01', 
          description: 'Test 1', 
          amount: 100, 
          amountCents: 10000,
          category: 'Inkomen', 
          isIgnored: false,
          fieldId: 'income.test1',
          original: createOriginalMetadata('Test;100'),
        },
        { 
          id: 'c2', 
          date: '2024-01-02', 
          description: 'Huur', 
          amount: -500,
          amountCents: -50000,
          category: 'Wonen', 
          isIgnored: false,
          fieldId: 'expenses.rent3',
          original: createOriginalMetadata('Huur;-500'),
        },
        { 
          id: 'c3', 
          date: '2024-01-03', 
          description: 'Boodschappen', 
          amount: -100,
          amountCents: -10000,
          category: 'Boodschappen', 
          isIgnored: false,
          fieldId: 'expenses.groceries2',
          original: createOriginalMetadata('Boodschappen;-100'),
        },
        { 
          id: 'c4', 
          date: '2024-01-04', 
          description: 'Auto', 
          amount: -200,
          amountCents: -20000,
          category: 'Vervoer', 
          isIgnored: false,
          fieldId: 'expenses.car',
          original: createOriginalMetadata('Auto;-200'),
        },
        { 
          id: 'c5', 
          date: '2024-01-05', 
          description: 'Zorg', 
          amount: -50,
          amountCents: -5000,
          category: 'Gezondheid', 
          isIgnored: false,
          fieldId: 'expenses.health',
          original: createOriginalMetadata('Zorg;-50'),
        },
      ];

      const result = CsvAnalysisService.analyse(mixedCategoryTransactions, null, null);

      expect(result.periodSummary.transactionCount).toBe(5);
      expect(result.periodSummary.totalIncomeCents).toBe(10000);
      expect(result.periodSummary.totalExpensesCents).toBe(85000); // 50000 + 10000 + 20000 + 5000
    });
  });
});