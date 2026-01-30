import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LandingScreen from '../ui/screens/Wizard/LandingScreen'; 
import { FormContext } from '../app/context/FormContext';
import { ThemeProvider } from '../app/context/ThemeContext';
import WizardController from '../ui/screens/Wizard/WizardController';

const mockDispatch = jest.fn();
const mockSignup = jest.fn();

describe('App Projector Flow', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Projector: switch LANDING → WIZARD rendert wizard UI', async () => {
    const { getByText } = render(
      <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 0, height: 0 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } }}>
        <ThemeProvider>
          <FormContext.Provider value={{ state: {} as any, dispatch: mockDispatch }}>
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
    // Deze state is tegelijk de ValueProvider voor de WizardPage
    const wizardState = {
      activeStep: 'WIZARD_SETUP', 
      data: {},
      // De cruciale functie die de crash veroorzaakte:
      getValue: jest.fn((key: string) => {
        if (key === 'show_debug') return false;
        return null;
      }),
      // Voeg een updateField mock toe voor de stateWriter prop
      updateField: jest.fn(),
    };
  
    const { getByText } = render(
      <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 0, height: 0 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } }}>
        <ThemeProvider>
          <FormContext.Provider value={{ 
            state: wizardState as any, 
            dispatch: mockDispatch 
          }}>
            <WizardController />
          </FormContext.Provider>
        </ThemeProvider>
      </SafeAreaProvider>
    );
  
    // We wachten tot de WizardPage rendert. 
    // We zoeken naar 'Velden aanwezig' omdat die tekst letterlijk in je WizardPage.tsx staat.
    await waitFor(() => {
      expect(getByText(/Velden aanwezig/i)).toBeTruthy();
    });
  });
});