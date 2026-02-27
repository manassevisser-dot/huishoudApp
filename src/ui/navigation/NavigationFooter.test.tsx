// src/ui/navigation/NavigationFooter.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { NavigationFooter, NavigationBackFooter } from './NavigationFooter';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMaster } from '@ui/providers/MasterProvider';
import { useAppStyles } from '@ui/styles/useAppStyles';
import { Tokens } from '@ui/kernel';

// Mocks
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(),
}));

jest.mock('@ui/providers/MasterProvider', () => ({
  useMaster: jest.fn(),
}));

jest.mock('@ui/styles/useAppStyles', () => ({
  useAppStyles: jest.fn(),
}));

jest.mock('@domain/constants/Tokens', () => ({
  Tokens: {
    Space: {
      lg: 16,
      md: 12,
    },
  },
}));

// --- Tree-traversal opmerking ------------------------------------------------
// In RNTL is UNSAFE_root de root HOST node — de <View> van FooterContainer.
// UNSAFE_root.children[0] = Terug TouchableOpacity
// UNSAFE_root.children[1] = Verder TouchableOpacity (NavigationFooter only)
// Gebruik getByTestId voor knoppen en UNSAFE_root.props.style voor container-stijlen.

describe('NavigationFooter', () => {
  const mockInsets = {
    top: 50,
    bottom: 20,
    left: 0,
    right: 0,
  };

  const mockColors = {
    surface: '#FFFFFF',
    border: '#E5E7EB',
  };

  const mockStyles = {
    button: { padding: 12, borderRadius: 8 },
    secondaryButton: { backgroundColor: '#f0f0f0' },
    secondaryButtonText: { color: '#666' },
    buttonDisabled: { opacity: 0.5 },
    buttonText: { color: '#fff', fontSize: 16 },
  };

  const mockNavigateBack = jest.fn();
  const mockNavigateNext = jest.fn();
  const mockCanNavigateNext = jest.fn();

  const mockMaster = {
    navigation: {
      navigateBack: mockNavigateBack,
      navigateNext: mockNavigateNext,
      canNavigateNext: mockCanNavigateNext,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useSafeAreaInsets as jest.Mock).mockReturnValue(mockInsets);
    (useAppStyles as jest.Mock).mockReturnValue({
      styles: mockStyles,
      colors: mockColors,
      Tokens: Tokens,
    });
    (useMaster as jest.Mock).mockReturnValue(mockMaster);
  });

  describe('NavigationFooter', () => {
    it('should render both buttons', () => {
      mockCanNavigateNext.mockReturnValue(true);

      const { getByText } = render(<NavigationFooter />);

      expect(getByText('Terug')).toBeTruthy();
      expect(getByText('Verder')).toBeTruthy();
    });

    it('should call navigateBack when Terug button is pressed', () => {
      mockCanNavigateNext.mockReturnValue(true);

      const { getByTestId } = render(<NavigationFooter />);

      fireEvent.press(getByTestId('nav-button-back'));

      expect(mockNavigateBack).toHaveBeenCalledTimes(1);
    });

    it('should call navigateNext when Verder button is pressed and enabled', () => {
      mockCanNavigateNext.mockReturnValue(true);

      const { getByTestId } = render(<NavigationFooter />);

      fireEvent.press(getByTestId('nav-button-next'));

      expect(mockNavigateNext).toHaveBeenCalledTimes(1);
    });

    it('should disable Verder button when canNavigateNext returns false', () => {
      mockCanNavigateNext.mockReturnValue(false);

      const { getByTestId } = render(<NavigationFooter />);
      const verderButton = getByTestId('nav-button-next');

      expect(verderButton.props.accessibilityState?.disabled).toBe(true);
    });

    it('should enable Verder button when canNavigateNext returns true', () => {
      mockCanNavigateNext.mockReturnValue(true);

      const { getByTestId } = render(<NavigationFooter />);
      const verderButton = getByTestId('nav-button-next');

      expect(verderButton.props.accessibilityState?.disabled).toBe(false);
    });

    it('should apply disabled styles when canGoNext is false', () => {
      mockCanNavigateNext.mockReturnValue(false);

      const { getByTestId } = render(<NavigationFooter />);
      const verderButton = getByTestId('nav-button-next');

      expect(verderButton.props.style).toEqual(
        expect.objectContaining({ ...mockStyles.button, ...mockStyles.buttonDisabled })
      );
    });

    it('should apply secondary button styles to Terug button', () => {
      mockCanNavigateNext.mockReturnValue(true);

      const { getByTestId } = render(<NavigationFooter />);
      const terugButton = getByTestId('nav-button-back');

      expect(terugButton.props.style).toEqual(
        expect.objectContaining({ ...mockStyles.button, ...mockStyles.secondaryButton })
      );
    });
  });

  describe('NavigationBackFooter', () => {
    it('should render only Terug button', () => {
      const { getByText, queryByText } = render(<NavigationBackFooter />);

      expect(getByText('Terug')).toBeTruthy();
      expect(queryByText('Verder')).toBeNull();
    });

    it('should call navigateBack when Terug button is pressed', () => {
      const { getByTestId } = render(<NavigationBackFooter />);

      fireEvent.press(getByTestId('nav-button-back'));

      expect(mockNavigateBack).toHaveBeenCalledTimes(1);
    });

    it('should apply secondary button styles', () => {
      const { getByTestId } = render(<NavigationBackFooter />);
      const terugButton = getByTestId('nav-button-back');

      expect(terugButton.props.style).toEqual(
        expect.objectContaining({ ...mockStyles.button, ...mockStyles.secondaryButton })
      );
    });
  });

  describe('FooterContainer', () => {
    // UNSAFE_root IS de FooterContainer View — container-stijlen zitten op UNSAFE_root.props.style.
    it('should apply correct bottom padding based on insets', () => {
      mockCanNavigateNext.mockReturnValue(true);

      const { getByTestId } = render(<NavigationFooter />);
      const container = getByTestId('footer-container');

      expect(container.props.style.paddingBottom).toBe(
        Math.max(mockInsets.bottom, Tokens.Space.lg)
      );
    });

    it('should apply correct colors from theme', () => {
      mockCanNavigateNext.mockReturnValue(true);

      const { getByTestId } = render(<NavigationFooter />);
      const container = getByTestId('footer-container');

      expect(container.props.style.backgroundColor).toBe(mockColors.surface);
      expect(container.props.style.borderTopColor).toBe(mockColors.border);
    });

    it('should use Tokens for spacing', () => {
      mockCanNavigateNext.mockReturnValue(true);

      const { getByTestId } = render(<NavigationFooter />);
      const container = getByTestId('footer-container');

      expect(container.props.style.paddingHorizontal).toBe(Tokens.Space.lg);
      expect(container.props.style.paddingTop).toBe(Tokens.Space.md);
      expect(container.props.style.gap).toBe(Tokens.Space.md);
    });

    it('should have absolute positioning', () => {
      mockCanNavigateNext.mockReturnValue(true);

      const { getByTestId } = render(<NavigationFooter />);
      const container = getByTestId('footer-container');

      expect(container.props.style.position).toBe('absolute');
      expect(container.props.style.bottom).toBe(0);
      expect(container.props.style.left).toBe(0);
      expect(container.props.style.right).toBe(0);
    });
  });

  describe('useFooterSetup hook', () => {
    it('should call all required hooks', () => {
      mockCanNavigateNext.mockReturnValue(true);

      render(<NavigationFooter />);

      expect(useSafeAreaInsets).toHaveBeenCalled();
      expect(useAppStyles).toHaveBeenCalled();
      expect(useMaster).toHaveBeenCalled();
    });

    it('should call canNavigateNext to determine button state', () => {
      mockCanNavigateNext.mockReturnValue(true);

      render(<NavigationFooter />);

      expect(mockCanNavigateNext).toHaveBeenCalled();
    });
  });

  describe('JSDoc claims verification', () => {
    it('should use master.navigation for all navigation logic', () => {
      mockCanNavigateNext.mockReturnValue(true);

      render(<NavigationFooter />);

      expect(useMaster).toHaveBeenCalled();
      expect(mockCanNavigateNext).toHaveBeenCalled();
    });

    it('should use useAppStyles for all styling', () => {
      mockCanNavigateNext.mockReturnValue(true);

      render(<NavigationFooter />);

      expect(useAppStyles).toHaveBeenCalled();
    });

    it('should use useSafeAreaInsets for bottom spacing', () => {
      mockCanNavigateNext.mockReturnValue(true);

      render(<NavigationFooter />);

      expect(useSafeAreaInsets).toHaveBeenCalled();
    });

    it('should disable Verder button based on orchestrator logic', () => {
      mockCanNavigateNext.mockReturnValue(false);

      const { getByTestId } = render(<NavigationFooter />);
      const verderButton = getByTestId('nav-button-next');

      expect(verderButton.props.accessibilityState?.disabled).toBe(true);
      expect(mockCanNavigateNext).toHaveBeenCalled();
    });
  });

  describe('edge cases', () => {
    it('should handle missing navigation methods gracefully', () => {
      (useMaster as jest.Mock).mockReturnValue({
        navigation: {
          navigateBack: mockNavigateBack,
          // navigateNext ontbreekt
          canNavigateNext: mockCanNavigateNext,
        },
      });
      mockCanNavigateNext.mockReturnValue(false);

      const { getByText } = render(<NavigationFooter />);

      expect(getByText('Terug')).toBeTruthy();
      expect(getByText('Verder')).toBeTruthy();
    });

    it('should handle zero insets', () => {
      (useSafeAreaInsets as jest.Mock).mockReturnValue({ ...mockInsets, bottom: 0 });
      mockCanNavigateNext.mockReturnValue(true);

      const { getByTestId } = render(<NavigationFooter />);

      // bottom=0 → Math.max(0, Tokens.Space.lg) = Tokens.Space.lg
      expect(getByTestId('footer-container').props.style.paddingBottom).toBe(Tokens.Space.lg);
    });

    it('should handle very large insets', () => {
      const largeInset = 100;
      (useSafeAreaInsets as jest.Mock).mockReturnValue({ ...mockInsets, bottom: largeInset });
      mockCanNavigateNext.mockReturnValue(true);

      const { getByTestId } = render(<NavigationFooter />);

      // largeInset=100 > Tokens.Space.lg=16 → Math.max(100, 16) = 100
      expect(getByTestId('footer-container').props.style.paddingBottom).toBe(largeInset);
    });
  });
});
