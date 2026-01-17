import * as React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import MoneyInput from '../../../ui/components/fields/MoneyInput';
import { formatCentsToDutch, formatDutchValue, toCents } from '@domain/helpers/numbers';
import { ThemeProvider } from '../../../app/context/ThemeContext';

// Mock de utility functies
jest.mock('@domain/helpers/numbers', () => ({
  formatCentsToDutch: jest.fn((cents: number) => {
    const euros = cents / 100;
    return euros.toFixed(2).replace('.', ',');
  }),
  formatDutchValue: jest.fn((value: string) => {
    return value.replace(/[^0-9,]/g, '');
  }),
  toCents: jest.fn((value: string) => {
    const cleaned = value.replace(',', '.');
    return Math.round(parseFloat(cleaned || '0') * 100);
  }),
}));

// Mock useAppStyles
jest.mock('@ui/styles/useAppStyles', () => ({
  useAppStyles: () => ({
    styles: {
      inputMoneyRow: {},
      moneyPrefix: {},
      moneyTextInput: {},
    },
  }),
}));

// Wrapper component met ThemeProvider
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('MoneyInput', () => {
  const mockOnValueChange = jest.fn();

  beforeEach(() => {
    mockOnValueChange.mockClear();
    jest.clearAllMocks();
  });

  const renderWithTheme = (ui: React.ReactElement) => {
    return render(ui, { wrapper: TestWrapper });
  };

  describe('initial rendering', () => {
    test('renders with initial cents value formatted', () => {
      const { getByDisplayValue } = renderWithTheme(
        <MoneyInput value={12345} onValueChange={mockOnValueChange} />,
      );

      expect(formatCentsToDutch).toHaveBeenCalledWith(12345);
      expect(getByDisplayValue('123,45')).toBeTruthy();
    });

    test('renders with zero value', () => {
      const { getByDisplayValue } = renderWithTheme(
        <MoneyInput value={0} onValueChange={mockOnValueChange} />,
      );

      expect(formatCentsToDutch).toHaveBeenCalledWith(0);
      expect(getByDisplayValue('0,00')).toBeTruthy();
    });

    test('renders euro prefix', () => {
      const { getByText } = renderWithTheme(
        <MoneyInput value={5000} onValueChange={mockOnValueChange} />,
      );

      expect(getByText('€')).toBeTruthy();
    });

    test('renders with placeholder', () => {
      const { getByPlaceholderText } = renderWithTheme(
        <MoneyInput value={0} onValueChange={mockOnValueChange} placeholder="Voer bedrag in" />,
      );

      expect(getByPlaceholderText('Voer bedrag in')).toBeTruthy();
    });
  });

  describe('value synchronization', () => {
    test('updates local value when external value changes', () => {
      const { rerender, getByDisplayValue } = renderWithTheme(
        <MoneyInput value={10000} onValueChange={mockOnValueChange} />,
      );

      expect(getByDisplayValue('100,00')).toBeTruthy();

      rerender(
        <TestWrapper>
          <MoneyInput value={25000} onValueChange={mockOnValueChange} />
        </TestWrapper>,
      );

      expect(formatCentsToDutch).toHaveBeenCalledWith(25000);
      expect(getByDisplayValue('250,00')).toBeTruthy();
    });

    test('useEffect runs when value prop changes', () => {
      const { rerender } = renderWithTheme(
        <MoneyInput value={10000} onValueChange={mockOnValueChange} />,
      );

      // Clear mock calls after initial render
      (formatCentsToDutch as jest.Mock).mockClear();

      // Rerender with same value - useEffect should run because value prop exists in dependency array
      rerender(
        <TestWrapper>
          <MoneyInput value={10000} onValueChange={mockOnValueChange} />
        </TestWrapper>,
      );

      // useEffect will run on rerender even with same value (React behavior)
      expect(formatCentsToDutch).toHaveBeenCalled();
    });
  });

  describe('focus behavior', () => {
    test('removes thousand separators on focus', () => {
      const { getByDisplayValue } = renderWithTheme(
        <MoneyInput value={123456} onValueChange={mockOnValueChange} />,
      );

      const input = getByDisplayValue('1234,56');
      fireEvent(input, 'focus');

      expect(formatDutchValue).toHaveBeenCalled();
    });

    test('onFocus is called', () => {
      const { getByDisplayValue } = renderWithTheme(
        <MoneyInput value={5000} onValueChange={mockOnValueChange} />,
      );

      const input = getByDisplayValue('50,00');

      fireEvent(input, 'focus');

      expect(formatDutchValue).toHaveBeenCalled();
    });
  });

  describe('text input changes', () => {
    test('sanitizes input during typing', () => {
      const { getByDisplayValue } = renderWithTheme(
        <MoneyInput value={0} onValueChange={mockOnValueChange} />,
      );

      const input = getByDisplayValue('0,00');

      fireEvent.changeText(input, '123,45');

      expect(formatDutchValue).toHaveBeenCalledWith('123,45');
    });

    test('blocks invalid characters during typing', () => {
      const { getByDisplayValue } = renderWithTheme(
        <MoneyInput value={0} onValueChange={mockOnValueChange} />,
      );

      const input = getByDisplayValue('0,00');

      fireEvent.changeText(input, 'abc123');

      expect(formatDutchValue).toHaveBeenCalledWith('abc123');
    });

    test('allows decimal comma', () => {
      const { getByDisplayValue } = renderWithTheme(
        <MoneyInput value={0} onValueChange={mockOnValueChange} />,
      );

      const input = getByDisplayValue('0,00');

      fireEvent.changeText(input, '99,99');

      expect(formatDutchValue).toHaveBeenCalledWith('99,99');
    });
  });

  describe('blur behavior', () => {
    test('converts to cents and emits on blur', () => {
      const { getByDisplayValue } = renderWithTheme(
        <MoneyInput value={0} onValueChange={mockOnValueChange} />,
      );

      const input = getByDisplayValue('0,00');

      fireEvent.changeText(input, '50,00');
      fireEvent(input, 'blur');

      expect(toCents).toHaveBeenCalled();
      expect(mockOnValueChange).toHaveBeenCalled();
    });

    test('formats to Dutch standard on blur', () => {
      (toCents as jest.Mock).mockReturnValueOnce(12345);

      const { getByDisplayValue } = renderWithTheme(
        <MoneyInput value={0} onValueChange={mockOnValueChange} />,
      );

      const input = getByDisplayValue('0,00');

      fireEvent.changeText(input, '123,45');
      fireEvent(input, 'blur');

      expect(formatCentsToDutch).toHaveBeenCalledWith(12345);
    });

    test('handles empty input on blur', () => {
      (toCents as jest.Mock).mockReturnValueOnce(0);

      const { getByDisplayValue } = renderWithTheme(
        <MoneyInput value={5000} onValueChange={mockOnValueChange} />,
      );

      const input = getByDisplayValue('50,00');

      fireEvent.changeText(input, '');
      fireEvent(input, 'blur');

      expect(mockOnValueChange).toHaveBeenCalledWith(0);
    });

    test('handles invalid input on blur', () => {
      (toCents as jest.Mock).mockReturnValueOnce(0);

      const { getByDisplayValue } = renderWithTheme(
        <MoneyInput value={0} onValueChange={mockOnValueChange} />,
      );

      const input = getByDisplayValue('0,00');

      fireEvent.changeText(input, 'invalid');
      fireEvent(input, 'blur');

      expect(mockOnValueChange).toHaveBeenCalledWith(0);
    });
  });

  describe('disabled state', () => {
    test('input is disabled when disabled prop is true', () => {
      const { getByDisplayValue } = renderWithTheme(
        <MoneyInput value={10000} onValueChange={mockOnValueChange} disabled={true} />,
      );

      const input = getByDisplayValue('100,00');

      expect(input.props.editable).toBe(false);
    });

    test('input is enabled when disabled prop is false', () => {
      const { getByDisplayValue } = renderWithTheme(
        <MoneyInput value={10000} onValueChange={mockOnValueChange} disabled={false} />,
      );

      const input = getByDisplayValue('100,00');

      expect(input.props.editable).toBe(true);
    });

    test('input is enabled by default', () => {
      const { getByDisplayValue } = renderWithTheme(
        <MoneyInput value={10000} onValueChange={mockOnValueChange} />,
      );

      const input = getByDisplayValue('100,00');

      expect(input.props.editable).toBe(true);
    });
  });

  describe('accessibility', () => {
    test('uses default accessibility label', () => {
      const { getByLabelText } = renderWithTheme(
        <MoneyInput value={10000} onValueChange={mockOnValueChange} />,
      );

      expect(getByLabelText('Bedrag')).toBeTruthy();
    });

    test('uses custom accessibility label', () => {
      const { getByLabelText } = renderWithTheme(
        <MoneyInput
          value={10000}
          onValueChange={mockOnValueChange}
          accessibilityLabel="Salaris bedrag"
        />,
      );

      expect(getByLabelText('Salaris bedrag')).toBeTruthy();
    });

    test('euro prefix has accessibility label', () => {
      const { getByLabelText } = renderWithTheme(
        <MoneyInput value={10000} onValueChange={mockOnValueChange} />,
      );

      expect(getByLabelText('Euro-teken')).toBeTruthy();
    });
  });

  describe('keyboard type', () => {
    test('uses decimal-pad keyboard type', () => {
      const { getByDisplayValue } = renderWithTheme(
        <MoneyInput value={10000} onValueChange={mockOnValueChange} />,
      );

      const input = getByDisplayValue('100,00');

      expect(input.props.keyboardType).toBe('decimal-pad');
    });
  });

  describe('edge cases', () => {
    test('handles very large cent values', () => {
      const { getByDisplayValue } = renderWithTheme(
        <MoneyInput value={99999999} onValueChange={mockOnValueChange} />,
      );

      expect(formatCentsToDutch).toHaveBeenCalledWith(99999999);
      expect(getByDisplayValue('999999,99')).toBeTruthy();
    });

    test('handles rapid value changes', () => {
      const { rerender } = renderWithTheme(
        <MoneyInput value={1000} onValueChange={mockOnValueChange} />,
      );

      rerender(
        <TestWrapper>
          <MoneyInput value={2000} onValueChange={mockOnValueChange} />
        </TestWrapper>,
      );
      rerender(
        <TestWrapper>
          <MoneyInput value={3000} onValueChange={mockOnValueChange} />
        </TestWrapper>,
      );
      rerender(
        <TestWrapper>
          <MoneyInput value={4000} onValueChange={mockOnValueChange} />
        </TestWrapper>,
      );

      expect(formatCentsToDutch).toHaveBeenCalledWith(4000);
    });

    test('handles focus -> change -> blur cycle', () => {
      (toCents as jest.Mock).mockReturnValue(5000);

      const { getByDisplayValue } = renderWithTheme(
        <MoneyInput value={0} onValueChange={mockOnValueChange} />,
      );

      const input = getByDisplayValue('0,00');

      fireEvent(input, 'focus');
      fireEvent.changeText(input, '50,00');
      fireEvent(input, 'blur');

      expect(formatDutchValue).toHaveBeenCalled();
      expect(toCents).toHaveBeenCalled();
      expect(mockOnValueChange).toHaveBeenCalledWith(5000);
      expect(formatCentsToDutch).toHaveBeenCalledWith(5000);
    });
  });
});
