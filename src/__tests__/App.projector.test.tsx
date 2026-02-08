import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LandingScreen from '../ui/screens/Wizard/LandingScreen'; 
import { FormContext } from '../app/context/FormContext';
import { ThemeProvider } from '../app/context/ThemeContext';
import WizardController from '../ui/screens/Wizard/WizardController';

// 1. Definieer de mocks BOVENAAN zodat ze overal in het bestand bekend zijn
const mockDispatch = jest.fn();
const mockSignup = jest.fn();

// Dit is de ontbrekende schakel: een nep-orchestrator die doet alsof hij werkt
const mockOrchestrator = {
  getValue: jest.fn((key: string) => {
    if (key === 'show_debug') return false;
    return null;
  }),
  updateField: jest.fn(),
  validate: jest.fn(() => null),
  importCsvData: jest.fn(),
} as any;

describe('App Projector Flow', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Projector: switch LANDING → WIZARD rendert wizard UI', async () => {
    const { getByText } = render(
      <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 0, height: 0 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } }}>
        <ThemeProvider>
          {/* We geven nu de complete set door aan de Provider */}
          <FormContext.Provider value={{ state: {} as any, dispatch: mockDispatch, orchestrator: mockOrchestrator }}>
            <LandingScreen onSignup={mockSignup} />
          </FormContext.Provider>
        </ThemeProvider>
      </SafeAreaProvider>
    );

    const button = getByText('Aanmelden');
    fireEvent.press(button);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({ 
        type: 'SET_STEP', 
        payload: 'WIZARD' 
      });
    });
  });

  it('Projector: toont de eerste Wizard pagina na switch', async () => {
    // We gebruiken de mockOrchestrator die we bovenaan hebben gedefinieerd
    const { getByText } = render(
      <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 0, height: 0 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } }}>
        <ThemeProvider>
          <FormContext.Provider value={{ state: {} as any, dispatch: mockDispatch, orchestrator: mockOrchestrator }}>
            <WizardController />
          </FormContext.Provider>
        </ThemeProvider>
      </SafeAreaProvider>
    );
  
    await waitFor(() => {
      // In je WizardController/Page staat vaak tekst zoals 'Velden aanwezig'
      expect(getByText(/Velden aanwezig/i)).toBeTruthy();
    });
  });
});