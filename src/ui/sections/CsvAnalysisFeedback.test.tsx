// src/ui/sections/CsvAnalysisFeedback.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import { CsvAnalysisFeedback, CsvAnalysisFeedbackContainer } from './CsvAnalysisFeedback';
import { useAppStyles } from '@ui/styles/useAppStyles';
import { useFormState } from '@ui/providers/FormStateProvider';
import { CsvAnalysisFeedbackVMFactory } from '@app/orchestrators/factory/CsvAnalysisFeedbackVMFactory';
import type { CsvAnalysisFeedbackVM, WarningItemVM, SummaryRowVM, SetupComparisonVM } from '@ui/types/viewModels';
import type { ColorRole } from '@ui/types/viewModels';
import type { CsvAnalysisResult } from '@app/orchestrators/types/csvUpload.types';
// Mocks
jest.mock('@ui/styles/useAppStyles', () => ({
  useAppStyles: jest.fn(),
}));

jest.mock('@ui/providers/FormStateProvider', () => ({
  useFormState: jest.fn(),
}));

jest.mock('@app/orchestrators/factory/CsvAnalysisFeedbackVMFactory', () => ({
  CsvAnalysisFeedbackVMFactory: {
    build: jest.fn(),
  },
}));

jest.mock('@ui/sections/FinancialSummary', () => ({
  SummaryRow: jest.fn(({ label, value, valueColor, styles }) => {
    const { View, Text } = require('react-native');
    return (
      <View>
        <Text testID={`summary-row-${label}`}>{label}</Text>
        <Text testID={`summary-value-${label}`}>{value}</Text>
        <Text testID={`summary-color-${label}`} style={{ color: valueColor }} />
      </View>
    );
  }),
}));


describe('CsvAnalysisFeedback', () => {
  const mockTokens = {
    Space: {
      md: 16,
    },
  };

  const mockStyles = {
    summaryDetail: { padding: 16 },
    screenTitle: { fontSize: 24, fontWeight: 'bold' },
    summaryLabel: { fontSize: 16, fontWeight: '500' },
  };

  const mockColors = {
    success: '#00FF00',
    error: '#FF0000',
    warning: '#FFA500',
    textPrimary: '#000000',
  };

  const mockWarning: WarningItemVM = {
    id: 'warning-1',
    label: 'Test Warning',
    colorRole: 'warning',
  };

  const mockPeriodRow: SummaryRowVM = {
    label: 'Income',
    value: '€ 1.500',
    colorRole: 'success',
  };

  const mockComparisonRow: SummaryRowVM = {
    label: 'Comparison',
    value: '€ 100',
    colorRole: 'error',
  };

  const mockSetupComparison: SetupComparisonVM = {
    title: 'Setup Comparison',
    rows: [mockComparisonRow],
  };

  const mockFullVM: CsvAnalysisFeedbackVM = {
    isEmpty: false,
    title: 'CSV Analysis Results',
    emptyTitle: '',
    emptyMessage: '',
    warnings: [mockWarning],
    periodTitle: 'Last 30 days',
    periodRows: [mockPeriodRow],
    showSetupComparison: true,
    setupComparison: mockSetupComparison,
  };

  const mockEmptyVM: CsvAnalysisFeedbackVM = {
    isEmpty: true,
    title: '',
    emptyTitle: 'No Data',
    emptyMessage: 'Upload a CSV file to see analysis',
    warnings: [],
    periodTitle: '',
    periodRows: [],
    showSetupComparison: false,
    setupComparison: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useAppStyles as jest.Mock).mockReturnValue({
      styles: mockStyles,
      colors: mockColors,
      Tokens: mockTokens,
    });
  });

  describe('CsvAnalysisFeedback (presentation component)', () => {
    it('should render empty state when vm.isEmpty is true', () => {
      const { getByText } = render(<CsvAnalysisFeedback vm={mockEmptyVM} />);
      
      expect(getByText(mockEmptyVM.emptyTitle)).toBeTruthy();
      expect(getByText(mockEmptyVM.emptyMessage)).toBeTruthy();
    });

    it('should render title when not empty', () => {
      const { getByText } = render(<CsvAnalysisFeedback vm={mockFullVM} />);
      
      expect(getByText(mockFullVM.title)).toBeTruthy();
    });

    it('should render warning badges', () => {
      const { getByText } = render(<CsvAnalysisFeedback vm={mockFullVM} />);
      
      expect(getByText(mockWarning.label)).toBeTruthy();
    });

    it('should render period section with title and rows', () => {
      const { getByText, getByTestId } = render(<CsvAnalysisFeedback vm={mockFullVM} />);
      
      expect(getByText(mockFullVM.periodTitle)).toBeTruthy();
      expect(getByTestId(`summary-row-${mockPeriodRow.label}`)).toBeTruthy();
    });

    it('should render setup comparison section when showSetupComparison is true', () => {
      const { getByText, getByTestId } = render(<CsvAnalysisFeedback vm={mockFullVM} />);
      
      expect(getByText(mockSetupComparison.title)).toBeTruthy();
      expect(getByTestId(`summary-row-${mockComparisonRow.label}`)).toBeTruthy();
    });

    it('should not render setup comparison section when showSetupComparison is false', () => {
      const vmWithoutComparison = {
        ...mockFullVM,
        showSetupComparison: false,
      };
      
      const { queryByText } = render(<CsvAnalysisFeedback vm={vmWithoutComparison} />);
      
      expect(queryByText(mockSetupComparison.title)).toBeNull();
    });

   // Vervang test op regels 163-168:
it('should apply correct styles from useAppStyles', () => {
  const { getByText } = render(<CsvAnalysisFeedback vm={mockFullVM} />);
  
  const title = getByText(mockFullVM.title);
  expect(title.props.style).toBe(mockStyles.screenTitle); // ✅ Geen arrayContaining
});
  });

  describe('WarningBadge', () => {
    it('should apply correct color from colorRole', () => {
      const { getByText } = render(<CsvAnalysisFeedback vm={mockFullVM} />);
      
      const warning = getByText(mockWarning.label);
      expect(warning.props.style).toEqual(
        expect.objectContaining({
          color: mockColors.warning,
        })
      );
    });
  });

  describe('resolveColor', () => {
   it('should map color roles correctly', () => {
  const testCases = [
    { role: 'success', expected: mockColors.success },
    { role: 'error', expected: mockColors.error },
    { role: 'warning', expected: mockColors.warning },
    { role: 'textPrimary', expected: mockColors.textPrimary },
  ];

  testCases.forEach(({ role, expected }) => {
    const vmWithColor: CsvAnalysisFeedbackVM = {
      ...mockFullVM,
      periodRows: [{
        label: 'Test',
        value: '€ 100',
        colorRole: role as ColorRole,
      }],
    };
    
    const { getByTestId } = render(<CsvAnalysisFeedback vm={vmWithColor} />);
    const colorElement = getByTestId('summary-color-Test');
    expect(colorElement.props.style.color).toBe(expected);
  });
});
  });

  describe('CsvAnalysisFeedbackContainer', () => {
// Vervang de mock op regels 213-230 met:

// Vervang de mock op regels 213-230 met:

const mockCsvAnalysisResult: CsvAnalysisResult = {
  isDiscrepancy: false,
  hasMissingCosts: false,
  periodSummary: {
    totalIncomeCents: 150000,
    totalExpensesCents: 120000,
    balanceCents: 30000,
    transactionCount: 10,
  },
  setupComparison: {
    csvIncomeCents: 150000,
    setupIncomeCents: 140000,
    diffCents: 10000,
  },
};

const mockState = {
  viewModels: {
    csvAnalysis: mockCsvAnalysisResult,
  },
};

    const mockBuiltVM = mockFullVM;

    beforeEach(() => {
      (useFormState as jest.Mock).mockReturnValue({ state: mockState });
      (CsvAnalysisFeedbackVMFactory.build as jest.Mock).mockReturnValue(mockBuiltVM);
    });

    it('should useFormState to get state', () => {
      render(<CsvAnalysisFeedbackContainer />);
      
      expect(useFormState).toHaveBeenCalled();
    });

    it('should call CsvAnalysisFeedbackVMFactory.build with csvAnalysis from state', () => {
      render(<CsvAnalysisFeedbackContainer />);
      
      expect(CsvAnalysisFeedbackVMFactory.build).toHaveBeenCalledWith(
        mockState.viewModels.csvAnalysis
      );
    });

    it('should handle null/undefined viewModels', () => {
      (useFormState as jest.Mock).mockReturnValue({ state: { viewModels: null } });
      
      render(<CsvAnalysisFeedbackContainer />);
      
      expect(CsvAnalysisFeedbackVMFactory.build).toHaveBeenCalledWith(undefined);
    });

    it('should handle missing csvAnalysis in viewModels', () => {
      (useFormState as jest.Mock).mockReturnValue({ 
        state: { viewModels: { otherData: {} } } 
      });
      
      render(<CsvAnalysisFeedbackContainer />);
      
      expect(CsvAnalysisFeedbackVMFactory.build).toHaveBeenCalledWith(undefined);
    });

    it('should pass the built VM to CsvAnalysisFeedback', () => {
      const { getByText } = render(<CsvAnalysisFeedbackContainer />);
      
      expect(getByText(mockBuiltVM.title)).toBeTruthy();
    });

    it('should handle empty VM from factory', () => {
      (CsvAnalysisFeedbackVMFactory.build as jest.Mock).mockReturnValue(mockEmptyVM);
      
      const { getByText } = render(<CsvAnalysisFeedbackContainer />);
      
      expect(getByText(mockEmptyVM.emptyTitle)).toBeTruthy();
    });
  });

  describe('JSDoc claims verification', () => {
    it('should be a pure presentation component with no business logic', () => {
      // Controleer dat de component alleen props gebruikt, geen state/logica
      const vm = mockFullVM;
      const { rerender } = render(<CsvAnalysisFeedback vm={vm} />);
      
      // Bijwerken met andere props zou moeten werken
      const newVm = { ...vm, title: 'New Title' };
      rerender(<CsvAnalysisFeedback vm={newVm} />);
      
      // Geen errors = goed
    });

    it('should use pre-formatted strings from VM (no formatting)', () => {
  const vmWithFormattedValue: CsvAnalysisFeedbackVM = {
    ...mockFullVM,
    periodRows: [{
      label: 'Income',
      value: '€ 1.500,00',
      colorRole: 'success',
    }],
  };
  
  const { getByTestId } = render(<CsvAnalysisFeedback vm={vmWithFormattedValue} />);
  const valueElement = getByTestId('summary-value-Income');
  expect(valueElement.props.children).toBe('€ 1.500,00');
});

   // Vervang test op regels 322-337 met:
it('should use resolveColor for all color roles', () => {
  const colorRoles: ColorRole[] = ['success', 'error', 'warning', 'textPrimary'];
  
  colorRoles.forEach(role => {
    const vmWithColor: CsvAnalysisFeedbackVM = {
      ...mockFullVM,
      periodRows: [{
        label: `Test-${role}`,
        value: '€ 100',
        colorRole: role,
      }],
    };
    
    const { getByTestId } = render(<CsvAnalysisFeedback vm={vmWithColor} />);
    const colorElement = getByTestId(`summary-color-Test-${role}`);
    
    const colorMap: Record<ColorRole, string> = {
      success: mockColors.success,
      error: mockColors.error,
      warning: mockColors.warning,
      textPrimary: mockColors.textPrimary,
    };
    
    expect(colorElement.props.style.color).toBe(colorMap[role]);
  });
});

   // Vervang test op regels 339-350 met:
// Vervang test op regels 339-350 met:
it('should not contain any hardcoded text strings', () => {
  const { queryAllByText } = render(<CsvAnalysisFeedback vm={mockFullVM} />);
  
  // Haal alle text elementen op
  const allTexts = queryAllByText(/.?/).map(el => el.props.children);
  
  // Hardcoded strings die nergens in VM zouden moeten zitten
  const hardcodedStrings = [
    'Analysis',           // Zou 'CSV Analysis Results' moeten zijn (uit VM)
    'Warning',            // Zou 'Test Warning' moeten zijn (uit VM)  
    'Period',             // Zou 'Last 30 days' moeten zijn (uit VM)
    'HardcodedTitle',     // Echte hardcoded test
    'Manual Entry',       // Echte hardcoded test
  ];
  
  hardcodedStrings.forEach(str => {
    expect(allTexts).not.toContain(str);
  });
  
  // Check dat ALLE VM strings aanwezig zijn (ook 'Comparison')
  expect(allTexts).toContain(mockFullVM.title);
  expect(allTexts).toContain(mockWarning.label);
  expect(allTexts).toContain(mockFullVM.periodTitle);
  expect(allTexts).toContain(mockFullVM.setupComparison?.title);
  expect(allTexts).toContain(mockPeriodRow.label);
  expect(allTexts).toContain(mockComparisonRow.label);
});
  });
});