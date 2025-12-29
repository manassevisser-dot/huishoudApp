import * as React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';
import { useAppOrchestration } from '@app/hooks/useAppOrchestration';

// Mock de orchestrator hook
jest.mock('@app/hooks/useAppOrchestration');

// Mock de schermen om te kijken of de juiste wordt aangeroepen
jest.mock('src/ui/screens/Wizard/SplashScreen', () => {
  const { Text } = require('react-native');
  return () => <Text testID="splash-screen">Splash</Text>;
});

jest.mock('@ui/screens/Wizard/WelcomeWizard', () => {
  const { Text } = require('react-native');
  return () => <Text testID="welcome-wizard">Wizard</Text>;
});

describe('WAI-006A-Projector: State Machine Rendering', () => {
  const mockOrch = useAppOrchestration as jest.Mock;

  it('rendeert SplashScreen bij status HYDRATING', () => {
    mockOrch.mockReturnValue({ status: 'HYDRATING' });
    const { getByTestId } = render(<App />);
    expect(getByTestId('splash-screen')).toBeTruthy();
  });

  it('rendeert WelcomeWizard bij status UNBOARDING', () => {
    mockOrch.mockReturnValue({ status: 'UNBOARDING' });
    const { getByTestId } = render(<App />);
    expect(getByTestId('welcome-wizard')).toBeTruthy();
  });
});