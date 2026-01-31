import React from 'react';
import type { AlertButton } from 'react-native';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ResetScreen from '../ResetScreen';
import { ThemeProvider } from '@/app/context/ThemeContext';

// ==========================================
// Canonical Alert mock (RN-safe)
// ==========================================
const mockAlert = jest.fn();

jest.mock('react-native/Libraries/Alert/Alert', () => ({
  __esModule: true,
  default: {
    alert: mockAlert,
  },
}));

// ==========================================
// Tests
// ==========================================
describe('ResetScreen - alerts', () => {
  const mockWissen = jest.fn();
  const mockHerstel = jest.fn();
  const mockClose = jest.fn();

  const renderResetScreen = (): void => {
    render(
      <ThemeProvider>
        <SafeAreaProvider
          initialMetrics={{
            frame: { x: 0, y: 0, width: 375, height: 812 },
            insets: { top: 0, left: 0, right: 0, bottom: 0 },
          }}
        >
          <ResetScreen
            onWissen={mockWissen}
            onHerstel={mockHerstel}
            onClose={mockClose}
          />
        </SafeAreaProvider>
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    mockAlert.mockClear();
    jest.clearAllMocks();
  });

  test('triggert WISSEN-alert en voert onWissen uit na bevestiging', () => {
    renderResetScreen();

    const wissenButtons = screen.getAllByText(/WISSEN/i);
    fireEvent.press(wissenButtons[wissenButtons.length - 1]);

    expect(mockAlert).toHaveBeenCalledTimes(1);

    const alertCalls = mockAlert.mock.calls as [
      string,
      string,
      AlertButton[],
    ][];

    const buttons = alertCalls[0][2];
    const confirmButton = buttons?.[1];

    confirmButton?.onPress?.();

    expect(mockWissen).toHaveBeenCalledTimes(1);
  });

  test('triggert HERSTEL-alert en voert onHerstel uit na bevestiging', () => {
    renderResetScreen();

    const herstelButton = screen.getByTestId('herstel');
    fireEvent.press(herstelButton);

    expect(mockAlert).toHaveBeenCalledTimes(1);

    const alertCalls = mockAlert.mock.calls as [
      string,
      string,
      AlertButton[],
    ][];

    const buttons = alertCalls[0][2];
    const confirmButton = buttons?.[1];

    confirmButton?.onPress?.();

    expect(mockHerstel).toHaveBeenCalledTimes(1);
  });
});
