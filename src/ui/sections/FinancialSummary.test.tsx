import * as React from 'react';
import { render } from '@testing-library/react-native';
import { FinancialSummary } from './FinancialSummary';
import { useAppStyles } from '@ui/styles/useAppStyles';

// We mocken de hook zodat we niet de hele style-engine hoeven te draaien
jest.mock('@ui/styles/useAppStyles');

describe('FinancialSummary', () => {
  const mockStyles = {
    summaryDetail: { padding: 10 },
    screenTitle: { fontSize: 20 },
    summaryRow: { flexDirection: 'row' },
    summaryLabel: { flex: 1 },
    summaryValue: { textAlign: 'right' },
    summaryRowTotal: { borderTopWidth: 1 },
    summaryLabelBold: { fontWeight: 'bold' },
    summaryValueBold: { fontWeight: 'bold' },
  };

  const mockTokens = {
    Space: { md: 12 },
  };

  const mockColors = {
    success: '#00FF00',
    error: '#FF0000',
  };

  const mockData = {
    totalIncomeDisplay: '€ 1.250,00',
    totalExpensesDisplay: '€ 850,00',
    netDisplay: '€ 400,00',
  };

  beforeEach(() => {
    (useAppStyles as jest.Mock).mockReturnValue({
      styles: mockStyles,
      colors: mockColors,
      Tokens: mockTokens,
    });
  });

  it('rendert de juiste titels en bedragen vanuit de orchestrator data', () => {
    const { getByText } = render(<FinancialSummary data={mockData} />);

    expect(getByText('Financieel Overzicht')).toBeTruthy();
    expect(getByText('€ 1.250,00')).toBeTruthy();
    expect(getByText('€ 850,00')).toBeTruthy();
    expect(getByText('€ 400,00')).toBeTruthy();
  });

  it('past de succes-kleur toe op de inkomsten en de error-kleur op de uitgaven', () => {
    const { getByText } = render(<FinancialSummary data={mockData} />);
    
    const incomeValue = getByText('€ 1.250,00');
    const expenseValue = getByText('€ 850,00');

    // We controleren of de styles array de gemockte kleur bevat
    expect(incomeValue.props.style).toContainEqual({ color: mockColors.success, fontWeight: '700' });
    expect(expenseValue.props.style).toContainEqual({ color: mockColors.error, fontWeight: '700' });
  });

  it('rendert de spacing view met de juiste token waarde', () => {
    const { getByText } = render(<FinancialSummary data={mockData} />);
    
    // De laatste view in de section heeft de hoogte van Tokens.Space.md
    // We kunnen dit vinden door de container te inspecteren
    const container = getByText('Financieel Overzicht').parent?.parent;
    const spacer = container?.children[container.children.length - 1];
    
    expect(spacer?.props.style).toEqual({ height: mockTokens.Space.md });
  });
});