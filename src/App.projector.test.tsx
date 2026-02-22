// src/App.projector.test.tsx
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LandingScreen from '@ui/screens/Wizard/LandingScreen';
import { FormProvider } from '@app/context/FormContext'; // ✅ was FormStateProvider
import { ThemeProvider } from '@ui/providers/ThemeProvider';
import { ScreenController } from '@ui/screens/Wizard/ScreenController'; // ✅ named import

// Mocks
const mockDispatch = jest.fn();
const mockOnStartWizard = jest.fn();
const mockOnGoToDashboard = jest.fn();

// Mock master orchestrator met theme
const mockMaster = {
  theme: {
    loadTheme: jest.fn().mockResolvedValue({}),
  },
} as any;

describe('App Projector Flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Projector: switch LANDING → WIZARD rendert wizard UI', async () => {
    const { getByText } = render(
      <SafeAreaProvider>
        <ThemeProvider master={mockMaster}>
          <FormProvider>
            <LandingScreen
              onStartWizard={mockOnStartWizard}
              onGoToDashboard={mockOnGoToDashboard}
            />
          </FormProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    );

    const button = getByText('Aanmelden');
    fireEvent.press(button);

    await waitFor(() => {
      expect(mockOnStartWizard).toHaveBeenCalled();
    });
  });

  it('Projector: toont de eerste Wizard pagina na switch', async () => {
    const { getByText } = render(
      <SafeAreaProvider>
        <ThemeProvider master={mockMaster}>
          <FormProvider>
            <ScreenController />
          </FormProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    );

    await waitFor(() => {
      expect(getByText(/Velden aanwezig/i)).toBeTruthy();
    });
  });
});