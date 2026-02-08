import * as React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MoneyInput from '../../../ui/components/fields/MoneyInput';
import { ThemeProvider } from '../../../app/context/ThemeContext';

// Mock voor de stijlen - nu gekoppeld aan de MoneyInput gebruik
jest.mock('@ui/styles/useAppStyles', () => ({
  useAppStyles: () => ({
    styles: {
      inputMoneyRow: { flexDirection: 'row' },
      moneyPrefix: { paddingRight: 4 },
      moneyTextInput: { flex: 1 },
    },
  }),
}));

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('MoneyInput (Dumb UI Integrity Mode)', () => {
  const mockOnValueChange = jest.fn();
  const mockOnBlur = jest.fn();

  beforeEach(() => {
    mockOnValueChange.mockClear();
    mockOnBlur.mockClear();
    jest.clearAllMocks();
  });

  const renderWithTheme = (ui: React.ReactElement) => {
    return render(ui, { wrapper: TestWrapper });
  };

  describe('initial rendering', () => {
    test('renders with initial displayValue string', () => {
      // De orchestrator geeft nu de string "123,45"
      const { getByDisplayValue } = renderWithTheme(
        <MoneyInput displayValue="123,45" onValueChange={mockOnValueChange} />,
      );

      expect(getByDisplayValue('123,45')).toBeTruthy();
    });

    test('renders with zero value string', () => {
      const { getByDisplayValue } = renderWithTheme(
        <MoneyInput displayValue="0,00" onValueChange={mockOnValueChange} />,
      );

      expect(getByDisplayValue('0,00')).toBeTruthy();
    });

    test('renders euro prefix with correct style', () => {
      const { getByText } = renderWithTheme(
        <MoneyInput displayValue="50,00" onValueChange={mockOnValueChange} />,
      );

      const prefix = getByText('€');
      expect(prefix).toBeTruthy();
      expect(prefix.props.style).toEqual({ paddingRight: 4 });
    });

    test('renders with placeholder', () => {
      const { getByPlaceholderText } = renderWithTheme(
        <MoneyInput displayValue="" onValueChange={mockOnValueChange} placeholder="Voer bedrag in" />,
      );

      expect(getByPlaceholderText('Voer bedrag in')).toBeTruthy();
    });
  });

  describe('value synchronization', () => {
    test('updates value when displayValue prop changes', () => {
      const { rerender, getByDisplayValue } = renderWithTheme(
        <MoneyInput displayValue="100,00" onValueChange={mockOnValueChange} />,
      );

      expect(getByDisplayValue('100,00')).toBeTruthy();

      rerender(
        <TestWrapper>
          <MoneyInput displayValue="250,00" onValueChange={mockOnValueChange} />
        </TestWrapper>,
      );

      expect(getByDisplayValue('250,00')).toBeTruthy();
    });
  });

  describe('interaction behavior', () => {
    test('calls onValueChange during typing', () => {
      const { getByDisplayValue } = renderWithTheme(
        <MoneyInput displayValue="0,00" onValueChange={mockOnValueChange} />,
      );

      const input = getByDisplayValue('0,00');
      fireEvent.changeText(input, '123,45');

      // De UI stuurt de rauwe string direct door naar de orchestrator
      expect(mockOnValueChange).toHaveBeenCalledWith('123,45');
    });

    test('calls onBlur when focus is lost', () => {
      const { getByDisplayValue } = renderWithTheme(
        <MoneyInput displayValue="50,00" onValueChange={mockOnValueChange} onBlur={mockOnBlur} />,
      );

      const input = getByDisplayValue('50,00');
      fireEvent(input, 'blur');

      expect(mockOnBlur).toHaveBeenCalled();
    });
  });

  describe('disabled state', () => {
    test('input is disabled when disabled prop is true', () => {
      const { getByDisplayValue } = renderWithTheme(
        <MoneyInput displayValue="100,00" onValueChange={mockOnValueChange} disabled={true} />,
      );

      const input = getByDisplayValue('100,00');
      expect(input.props.editable).toBe(false);
    });

    test('input is enabled by default', () => {
      const { getByDisplayValue } = renderWithTheme(
        <MoneyInput displayValue="100,00" onValueChange={mockOnValueChange} />,
      );

      const input = getByDisplayValue('100,00');
      expect(input.props.editable).toBe(true);
    });
  });

  describe('accessibility', () => {
    test('uses custom accessibility label', () => {
      const { getByLabelText } = renderWithTheme(
        <MoneyInput
          displayValue="100,00"
          onValueChange={mockOnValueChange}
          accessibilityLabel="Salaris bedrag"
        />,
      );

      expect(getByLabelText('Salaris bedrag')).toBeTruthy();
    });

    test('euro prefix has accessibility label', () => {
      const { getByLabelText } = renderWithTheme(
        <MoneyInput displayValue="10,00" onValueChange={mockOnValueChange} />,
      );

      expect(getByLabelText('Euro-teken')).toBeTruthy();
    });
  });

  describe('keyboard type', () => {
    test('uses decimal-pad keyboard type', () => {
      const { getByDisplayValue } = renderWithTheme(
        <MoneyInput displayValue="100,00" onValueChange={mockOnValueChange} />,
      );

      const input = getByDisplayValue('100,00');
      expect(input.props.keyboardType).toBe('decimal-pad');
    });
  });

  describe('edge cases', () => {
    test('handles very large string values', () => {
      const { getByDisplayValue } = renderWithTheme(
        <MoneyInput displayValue="999.999.999,99" onValueChange={mockOnValueChange} />,
      );

      expect(getByDisplayValue('999.999.999,99')).toBeTruthy();
    });

    test('handles rapid prop updates', () => {
      const { rerender, getByDisplayValue } = renderWithTheme(
        <MoneyInput displayValue="10,00" onValueChange={mockOnValueChange} />,
      );

      rerender(<TestWrapper><MoneyInput displayValue="20,00" onValueChange={mockOnValueChange} /></TestWrapper>);
      rerender(<TestWrapper><MoneyInput displayValue="30,00" onValueChange={mockOnValueChange} /></TestWrapper>);

      expect(getByDisplayValue('30,00')).toBeTruthy();
    });
  });
});