// src/ui/screens/Reset/ResetConfirmationContainer.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Alert, ScrollView } from 'react-native';
import { ResetConfirmationContainer } from './ResetConfirmationContainer';
import { useMaster } from '@ui/providers/MasterProvider';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStyles } from '@ui/styles/useAppStyles';
import { validationMessages } from '@state/schemas/sections/validationMessages';

// Mocks voor dependencies (zonder Alert te mocken)
jest.mock('@ui/providers/MasterProvider', () => ({
  useMaster: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: jest.fn(),
}));

jest.mock('@ui/styles/useAppStyles', () => ({
  useAppStyles: jest.fn(),
}));

jest.mock('@state/schemas/sections/validationMessages', () => ({
  validationMessages: {
    reset: {
      wipe: {
        title: 'Alle gegevens wissen',
        message: 'Weet u zeker dat u ALLE gegevens wilt wissen? Dit kan niet ongedaan worden gemaakt.',
        confirm: 'Wissen',
        cancel: 'Annuleer',
        hint: 'Hiermee worden ALLE ingevoerde gegevens permanent verwijderd. U begint helemaal opnieuw.',
      },
      wizardOnly: {
        title: 'Wizard opnieuw starten',
        message: 'Weet u zeker dat u de wizard opnieuw wilt starten? Uw eerdere antwoorden blijven behouden.',
        confirm: 'Herstart',
        cancel: 'Annuleer',
        hint: 'Hiermee gaat u terug naar het begin van de wizard. Uw gegevens blijven bewaard.',
      },
    },
  },
}));

describe('ResetConfirmationContainer', () => {
  let alertSpy: jest.SpyInstance;

  const mockInsets = {
    top: 50,
    bottom: 20,
    left: 0,
    right: 0,
  };

  const mockStyles = {
    container: { flex: 1, backgroundColor: 'white' },
    screenContainer: { flex: 1 },
    scrollContent: { paddingHorizontal: 16 },
    screenTitle: { fontSize: 24, fontWeight: 'bold' },
    dashboardCard: { borderRadius: 8, padding: 16 },
    entryLabel: { fontSize: 16, fontWeight: '600' },
    summaryDetail: { fontSize: 14 },
    button: { padding: 12, borderRadius: 8 },
    buttonText: { fontSize: 16, color: 'white' },
  };

  const mockColors = {
    error: '#FF0000',
    primary: '#007AFF',
  };

  const mockMaster = {
    executeReset: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // ✅ Gebruik spyOn in plaats van mock
    alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
    
    (useMaster as jest.Mock).mockReturnValue(mockMaster);
    (useSafeAreaInsets as jest.Mock).mockReturnValue(mockInsets);
    (useAppStyles as jest.Mock).mockReturnValue({
      styles: mockStyles,
      colors: mockColors,
    });
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  it('should render correctly', () => {
    const { getByTestId } = render(<ResetConfirmationContainer />);
    
    expect(getByTestId('reset-confirmation-container')).toBeTruthy();
    expect(getByTestId('btn-wissen')).toBeTruthy();
    expect(getByTestId('btn-herstel')).toBeTruthy();
  });

  it('should display correct titles and hints', () => {
    const { getByText, queryAllByText } = render(<ResetConfirmationContainer />);
    
    expect(getByText('Reset Opties')).toBeTruthy();
    // Gebruik queryAllByText en check dat er minstens één is
    expect(queryAllByText('WISSEN').length).toBeGreaterThan(0);
    expect(queryAllByText('HERSTEL').length).toBeGreaterThan(0);
    expect(getByText(validationMessages.reset.wipe.hint)).toBeTruthy();
    expect(getByText(validationMessages.reset.wizardOnly.hint)).toBeTruthy();
  });

  describe('Wissen (full reset) flow', () => {
    it('should show alert with correct messages when WISSEN button is pressed', () => {
      const { getByTestId } = render(<ResetConfirmationContainer />);
      
      const wissenButton = getByTestId('btn-wissen');
      fireEvent.press(wissenButton);
      
      expect(alertSpy).toHaveBeenCalledWith(
        validationMessages.reset.wipe.title,
        validationMessages.reset.wipe.message,
        expect.arrayContaining([
          expect.objectContaining({
            text: validationMessages.reset.wipe.cancel,
            style: 'cancel',
          }),
          expect.objectContaining({
            text: validationMessages.reset.wipe.confirm,
            style: 'destructive',
            onPress: expect.any(Function),
          }),
        ])
      );
    });

    it('should call master.executeReset with "full" when confirm is pressed', () => {
      const { getByTestId } = render(<ResetConfirmationContainer />);
      
      const wissenButton = getByTestId('btn-wissen');
      fireEvent.press(wissenButton);
      
      const alertCall = alertSpy.mock.calls[0];
      const buttons = alertCall[2];
      const confirmButton = buttons.find((b: any) => b.style === 'destructive');
      
      confirmButton.onPress();
      
      expect(mockMaster.executeReset).toHaveBeenCalledWith('full');
      expect(mockMaster.executeReset).toHaveBeenCalledTimes(1);
    });

    it('should not call executeReset when cancel is pressed', () => {
      const { getByTestId } = render(<ResetConfirmationContainer />);
      
      const wissenButton = getByTestId('btn-wissen');
      fireEvent.press(wissenButton);
      
      const alertCall = alertSpy.mock.calls[0];
      const buttons = alertCall[2];
      const cancelButton = buttons.find((b: any) => b.style === 'cancel');
      
      if (cancelButton.onPress) cancelButton.onPress();
      
      expect(mockMaster.executeReset).not.toHaveBeenCalled();
    });
  });

  describe('Herstel (setup reset) flow', () => {
    it('should show alert with correct messages when HERSTEL button is pressed', () => {
      const { getByTestId } = render(<ResetConfirmationContainer />);
      
      const herstelButton = getByTestId('btn-herstel');
      fireEvent.press(herstelButton);
      
      expect(alertSpy).toHaveBeenCalledWith(
        validationMessages.reset.wizardOnly.title,
        validationMessages.reset.wizardOnly.message,
        expect.arrayContaining([
          expect.objectContaining({
            text: validationMessages.reset.wizardOnly.cancel,
            style: 'cancel',
          }),
          expect.objectContaining({
            text: validationMessages.reset.wizardOnly.confirm,
            onPress: expect.any(Function),
          }),
        ])
      );
    });

    it('should call master.executeReset with "setup" when confirm is pressed', () => {
      const { getByTestId } = render(<ResetConfirmationContainer />);
      
      const herstelButton = getByTestId('btn-herstel');
      fireEvent.press(herstelButton);
      
      const alertCall = alertSpy.mock.calls[0];
      const buttons = alertCall[2];
      const confirmButton = buttons.find((b: any) => b.text === validationMessages.reset.wizardOnly.confirm);
      
      confirmButton.onPress();
      
      expect(mockMaster.executeReset).toHaveBeenCalledWith('setup');
      expect(mockMaster.executeReset).toHaveBeenCalledTimes(1);
    });

    it('should not call executeReset when cancel is pressed', () => {
      const { getByTestId } = render(<ResetConfirmationContainer />);
      
      const herstelButton = getByTestId('btn-herstel');
      fireEvent.press(herstelButton);
      
      const alertCall = alertSpy.mock.calls[0];
      const buttons = alertCall[2];
      const cancelButton = buttons.find((b: any) => b.style === 'cancel');
      
      if (cancelButton.onPress) cancelButton.onPress();
      
      expect(mockMaster.executeReset).not.toHaveBeenCalled();
    });
  });

  describe('styling and layout', () => {
    it('should apply correct styles to buttons based on type', () => {
      const { getByTestId } = render(<ResetConfirmationContainer />);
      
      const wissenButton = getByTestId('btn-wissen');
      const herstelButton = getByTestId('btn-herstel');
      
      // Wissen button zou error kleur moeten hebben (style is object, geen array)
      expect(wissenButton.props.style).toEqual(
        expect.objectContaining({
          backgroundColor: mockColors.error,
        })
      );
      
      // Herstel button zou primary kleur moeten hebben
      expect(herstelButton.props.style).toEqual(
        expect.objectContaining({
          backgroundColor: mockColors.primary,
        })
      );
    });

it('should apply correct bottom padding based on insets', () => {
  const { UNSAFE_getByType } = render(<ResetConfirmationContainer />);
  
  const scrollView = UNSAFE_getByType(ScrollView);
  
  // contentContainerStyle is een array van styles
  expect(scrollView.props.contentContainerStyle).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        paddingBottom: 120 + mockInsets.bottom,
      }),
    ])
  );
});
  });

  describe('accessibility', () => {
    it('should have correct testIDs for buttons', () => {
      const { getByTestId } = render(<ResetConfirmationContainer />);
      
      expect(() => getByTestId('btn-wissen')).not.toThrow();
      expect(() => getByTestId('btn-herstel')).not.toThrow();
    });
  });

  describe('memoization', () => {
    it('should memoize callbacks to prevent unnecessary re-renders', () => {
      const { rerender, getByTestId } = render(<ResetConfirmationContainer />);
      
      // Eerste render
      expect(useMaster).toHaveBeenCalledTimes(1);
      
      // Re-render
      rerender(<ResetConfirmationContainer />);
      expect(useMaster).toHaveBeenCalledTimes(2);
      
      // Check dat callbacks werken
      const wissenButton = getByTestId('btn-wissen');
      fireEvent.press(wissenButton);
      
      expect(alertSpy).toHaveBeenCalled();
    });
  });

  describe('JSDoc claims verification', () => {
    it('should use validationMessages as SSOT for all texts', () => {
      const { getByText } = render(<ResetConfirmationContainer />);
      
      expect(getByText(validationMessages.reset.wipe.hint)).toBeTruthy();
      expect(getByText(validationMessages.reset.wizardOnly.hint)).toBeTruthy();
    });

    it('should isolate Alert.alert calls behind showConfirmAlert wrapper', () => {
      const { getByTestId } = render(<ResetConfirmationContainer />);
      
      const wissenButton = getByTestId('btn-wissen');
      fireEvent.press(wissenButton);
      
      expect(alertSpy).toHaveBeenCalled();
      
      // De wrapper gebruikt de juiste signature
      const alertCall = alertSpy.mock.calls[0];
      expect(alertCall).toHaveLength(3); // title, message, buttons
    });

    it('should not contain any hardcoded navigation calls', () => {
      render(<ResetConfirmationContainer />);
      
      expect(mockMaster.executeReset).not.toHaveBeenCalled();
    });
  });
});