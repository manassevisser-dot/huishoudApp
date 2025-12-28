import * as React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import InputCounter from '../InputCounter';
import { ThemeProvider } from '@app/context/ThemeContext';

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider>
      {ui}
    </ThemeProvider>
  );
};

describe('InputCounter Unit Tests', () => {
  const mockOnValueChange = jest.fn();
  
  const defaultProps = {
    value: 5,
    onValueChange: mockOnValueChange, // FIX: Match de interface
    min: 0,
    max: 10,
    label: 'Test Counter'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('moet de initiële waarde tonen', () => {
    const { getByText } = renderWithProviders(<InputCounter {...defaultProps} />);
    expect(getByText('5')).toBeTruthy();
  });

  it('moet onValueChange aanroepen bij verhogen', () => {
    const { getByText } = renderWithProviders(<InputCounter {...defaultProps} />);
    const plusButton = getByText('+');
    fireEvent.press(plusButton);
    expect(mockOnValueChange).toHaveBeenCalledWith(6);
  });

  it('mag niet onder het minimum gaan', () => {
    const { getByText } = renderWithProviders(<InputCounter {...defaultProps} value={0} />);
    const minusButton = getByText('-');
    fireEvent.press(minusButton);
    expect(mockOnValueChange).not.toHaveBeenCalled();
  });
});