import * as React from 'react';
import { render } from '@testing-library/react-native';
import App from '../App';

// Mock styles
jest.mock('@ui/styles/useAppStyles', () => ({
  useAppStyles: () => ({
    colors: { primary: '#00f' },
    styles: { screen: {}, textBody: {}, screenError: {}, textError: {} },
  }),
}));

// Mock orchestration statuses
jest.mock('@app/hooks/useAppOrchestration', () => ({
  __esModule: true,
  useAppOrchestration: () => ({ status: 'HYDRATING', resetApp: jest.fn() }),
}));

jest.mock('@ui/screens/SplashScreen', () => () => null);
jest.mock('@ui/screens/WelcomeWizard', () => () => null);
jest.mock('@ui/navigation/MainNavigator', () => () => null);
jest.mock('@ui/screens/CriticalErrorScreen', () => () => null);

describe('App projector', () => {
  it('renders SplashScreen on HYDRATING', () => {
    const tree = render(<App />);
    expect(tree.toJSON()).toBeTruthy();
  });
});
