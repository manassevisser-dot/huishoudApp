// src/ui/screens/actions/DailyInputActionFooter.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { DailyInputActionFooter } from './DailyInputActionFooter';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStyles } from '@ui/styles/useAppStyles';
import { View} from 'react-native';

// Mocks
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(),
}));

jest.mock('@ui/styles/useAppStyles', () => ({
  useAppStyles: jest.fn(),
}));

describe('DailyInputActionFooter', () => {
  const mockInsets = {
    top: 50,
    bottom: 20,
    left: 0,
    right: 0,
  };

  const mockTokens = {
    Space: {
      lg: 16,
    },
  };

  const mockStyles = {
    buttonContainer: { paddingHorizontal: 16, backgroundColor: 'white' },
    button: { borderRadius: 8, padding: 12 },
    buttonText: { fontSize: 16, color: 'blue' },
  };

  const mockOnSave = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    
    (useSafeAreaInsets as jest.Mock).mockReturnValue(mockInsets);
    (useAppStyles as jest.Mock).mockReturnValue({
      styles: mockStyles,
      Tokens: mockTokens,
    });
  });

  it('should render correctly', () => {
    const { getByText } = render(<DailyInputActionFooter onSave={mockOnSave} />);
    
    expect(getByText('Opslaan & Terug')).toBeTruthy();
  });

  it('should call onSave when button is pressed', () => {
    const { getByText } = render(<DailyInputActionFooter onSave={mockOnSave} />);
    
    const button = getByText('Opslaan & Terug');
    fireEvent.press(button);
    
    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });

  it('should apply correct bottom padding based on insets', () => {
    const { UNSAFE_getByType } = render(<DailyInputActionFooter onSave={mockOnSave} />);
    
    const view = UNSAFE_getByType(View);
    
    const expectedBottomPadding = Math.max(mockInsets.bottom, mockTokens.Space.lg);
    
    expect(view.props.style).toEqual(
      expect.arrayContaining([
        mockStyles.buttonContainer,
        expect.objectContaining({
          paddingBottom: expectedBottomPadding,
        }),
      ])
    );
  });

  it('should use Math.max to ensure minimum padding', () => {
    // Test met kleine insets
    (useSafeAreaInsets as jest.Mock).mockReturnValueOnce({ ...mockInsets, bottom: 5 });
    
    const { UNSAFE_getByType } = render(<DailyInputActionFooter onSave={mockOnSave} />);
    
    const view = UNSAFE_getByType(View);
    
    // Moet Tokens.Space.lg (16) gebruiken, niet insets.bottom (5)
    expect(view.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          paddingBottom: mockTokens.Space.lg,
        }),
      ])
    );
  });

it('should apply button styles correctly', () => {
  const { getByText } = render(<DailyInputActionFooter onSave={mockOnSave} />);
  
  const text = getByText('Opslaan & Terug');
  const textParent = text.parent; // Dit is de inner View
  const buttonView = textParent?.parent; // Dit is de outer View met de button style
  
  // TouchableOpacity flattenStylet zijn style-prop naar een plain object — geen array.
  expect(buttonView?.props.style).toEqual(
    expect.objectContaining(mockStyles.button)
  );
});

it('should apply text styles correctly', () => {
  const { getByText } = render(<DailyInputActionFooter onSave={mockOnSave} />);
  
  const text = getByText('Opslaan & Terug');
  
  expect(text.props.style).toBe(mockStyles.buttonText);
});

it('should call onSave when button is pressed', () => {
  const { getByText } = render(<DailyInputActionFooter onSave={mockOnSave} />);
  
  const text = getByText('Opslaan & Terug');
  const buttonView = text.parent;
  
  // Simuleer press op de View
  fireEvent.press(buttonView);
  
  expect(mockOnSave).toHaveBeenCalledTimes(1);
});

  describe('edge cases', () => {
    it('should handle zero insets', () => {
      (useSafeAreaInsets as jest.Mock).mockReturnValueOnce({ ...mockInsets, bottom: 0 });
      
      const { UNSAFE_getByType } = render(<DailyInputActionFooter onSave={mockOnSave} />);
      
      const view = UNSAFE_getByType(View);
      
      expect(view.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            paddingBottom: mockTokens.Space.lg, // minimum van 16
          }),
        ])
      );
    });

    it('should handle very large insets', () => {
      const largeInset = 100;
      (useSafeAreaInsets as jest.Mock).mockReturnValueOnce({ ...mockInsets, bottom: largeInset });
      
      const { UNSAFE_getByType } = render(<DailyInputActionFooter onSave={mockOnSave} />);
      
      const view = UNSAFE_getByType(View);
      
      expect(view.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            paddingBottom: largeInset, // groter dan minimum, dus inset wordt gebruikt
          }),
        ])
      );
    });
  });

  describe('styling integration', () => {
    it('should use styles from useAppStyles', () => {
      render(<DailyInputActionFooter onSave={mockOnSave} />);
      
      expect(useAppStyles).toHaveBeenCalled();
    });

    it('should use insets from useSafeAreaInsets', () => {
      render(<DailyInputActionFooter onSave={mockOnSave} />);
      
      expect(useSafeAreaInsets).toHaveBeenCalled();
    });
  });
});