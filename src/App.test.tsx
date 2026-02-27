// src/App.test.tsx
import React from 'react';
import { render } from '@testing-library/react-native';
import App from './App';

// Mock alle providers en navigators

// SafeAreaProvider is toegevoegd als root wrapper in App.tsx (fase 1).
// Zonder mock crasht de test omdat react-native-safe-area-context
// native modules vereist die niet beschikbaar zijn in jsdom.
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: jest.fn(({ children }) => children),
  useSafeAreaInsets: jest.fn(() => ({ top: 0, right: 0, bottom: 0, left: 0 })),
}));

jest.mock('@ui/providers/FormStateProvider', () => ({
  FormStateProvider: jest.fn(({ children }) => (
    <>{children}</>
  )),
}));

jest.mock('@ui/providers/MasterProvider', () => ({
  MasterProvider: jest.fn(({ children }) => <>{children}</>),
  useMaster: jest.fn(() => ({
    theme: {},
    navigation: {},
    ui: {},
  })),
}));

jest.mock('@ui/providers/ThemeProvider', () => ({
  ThemeProvider: jest.fn(({ children }) => <>{children}</>),
}));



jest.mock('@ui/navigation/MainNavigator', () => {
  const { View, Text } = require('react-native');
  return jest.fn(() => (
    <View testID="mock-main-navigator">
      <Text>MainNavigator</Text>
    </View>
  ));
});

// Mock initialFormState
jest.mock('@app/state/initialFormState', () => ({
  initialFormState: { test: 'mock-state' },
}));

import { FormStateProvider } from '@ui/providers/FormStateProvider';
import { MasterProvider, useMaster } from '@ui/providers/MasterProvider';
import { ThemeProvider } from '@ui/providers/ThemeProvider';
import MainNavigator from '@ui/navigation/MainNavigator';

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('mock-main-navigator')).toBeTruthy();
  });

  it('should nest providers in correct order', () => {
    render(<App />);

    // Check provider instantiation order (binnenste eerst?)
    expect(FormStateProvider).toHaveBeenCalledTimes(1);
    expect(MasterProvider).toHaveBeenCalledTimes(1);
    expect(ThemeProvider).toHaveBeenCalledTimes(1);
    expect(MainNavigator).toHaveBeenCalledTimes(1);

    // Check dat FormStateProvider de buitenste is (krijgt children)
    const formStateProps = (FormStateProvider as jest.Mock).mock.calls[0][0];
    expect(formStateProps.initialState).toEqual({ test: 'mock-state' });
    expect(formStateProps.children).toBeDefined();

    // Check dat MasterProvider binnen FormStateProvider zit
    const masterProps = (MasterProvider as jest.Mock).mock.calls[0][0];
    expect(masterProps.children).toBeDefined();

    // Check dat useMaster wordt aangeroepen in AppContent
    expect(useMaster).toHaveBeenCalledTimes(1);

    // Check dat ThemeProvider master prop krijgt
    const themeProps = (ThemeProvider as jest.Mock).mock.calls[0][0];
    expect(themeProps.master).toBeDefined();
    expect(themeProps.children).toBeDefined();

    
    const navigatorProps = (MainNavigator as jest.Mock).mock.calls[0][0];
    expect(navigatorProps).toEqual({});
  });

  it('should pass master from useMaster to ThemeProvider', () => {
    const mockMaster = { test: 'master-object' };
    (useMaster as jest.Mock).mockReturnValueOnce(mockMaster);

    render(<App />);

    const themeProps = (ThemeProvider as jest.Mock).mock.calls[0][0];
    expect(themeProps.master).toBe(mockMaster);
  });

  it('should have correct provider hierarchy', () => {
    render(<App />);

    // Controleer de volgorde van aanroepen
    const formStateCall = (FormStateProvider as jest.Mock).mock.invocationCallOrder[0];
    const masterCall = (MasterProvider as jest.Mock).mock.invocationCallOrder[0];
    const themeCall = (ThemeProvider as jest.Mock).mock.invocationCallOrder[0];
    const navigatorCall = (MainNavigator as jest.Mock).mock.invocationCallOrder[0];

    // De buitenste providers worden eerst aangeroepen
    expect(formStateCall).toBeLessThan(masterCall);
    expect(masterCall).toBeLessThan(themeCall);

  });

  // In src/App.test.tsx, vervang de failing test (rond regel 127-133) met:

describe('AppContent', () => {
  it('should render children correctly', () => {
    render(<App />);

    // React geeft 'undefined' als tweede arg aan function components —
    // toHaveBeenCalledWith mislukt dan met expect.anything() (matcht geen undefined).
    // Oplossing: check props direct via mock.calls[0][0].
    const themeProps = (ThemeProvider as jest.Mock).mock.calls[0][0];
    expect(themeProps).toMatchObject({
      master: expect.any(Object),
      children: expect.any(Object),
    });
  });
});

  describe('error handling', () => {
    it('should handle missing master gracefully', () => {
      // useMaster returned undefined (hoewel dat normaal niet gebeurt)
      (useMaster as jest.Mock).mockReturnValueOnce(undefined);

      expect(() => render(<App />)).not.toThrow();
      
      const themeProps = (ThemeProvider as jest.Mock).mock.calls[0][0];
      expect(themeProps.master).toBeUndefined();
    });
  });

  describe('provider integration', () => {
    it('should provide all contexts to MainNavigator', () => {
      render(<App />);

      // MainNavigator zou moeten renderen zonder errors
      expect(MainNavigator).toHaveBeenCalled();
    });
  });
});