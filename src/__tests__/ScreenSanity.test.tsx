import React from 'react';
import { screen } from '@testing-library/react-native';
import { render } from '../test-utils/render/renderers';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import Screens
import { CsvUploadScreen } from '@ui/screens/CSV/CsvUploadScreen';
import { UndoScreen } from '@ui/screens/Daily/UndoScreen';
import DailyInputScreen from '@ui/screens/DailyInput/DailyInputScreen';
import DashboardScreen from '@ui/screens/Dashboard/DashboardScreen';
import OptionsScreen from '@ui/screens/Options/OptionsScreen';
import ResetScreen from '@ui/screens/Reset/ResetScreen';
import SettingsScreen from '@ui/screens/Settings/SettingsScreen';
import CriticalErrorScreen from '@ui/screens/Wizard/CriticalErrorScreen';
import SplashScreen from '@ui/screens/Wizard/SplashScreen';
import WelcomeWizard from '@ui/screens/Wizard/WelcomeWizard';

// Mock navigatie props
const mockNavigation = { navigate: jest.fn(), goBack: jest.fn(), setOptions: jest.fn() };

const safeAreaMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

describe('Screen Sanity Smoke Tests', () => {
  const screens = [
    { name: 'CsvUploadScreen', Component: CsvUploadScreen, props: {} },
    { name: 'UndoScreen', Component: UndoScreen, props: {} },
    {
      name: 'DailyInputScreen',
      Component: DailyInputScreen,
      props: {
        onClose: jest.fn(),
        members: [],
        setupData: {},
      },
    },
    { name: 'DashboardScreen', Component: DashboardScreen, props: { navigation: mockNavigation } },
    { name: 'OptionsScreen', Component: OptionsScreen, props: { navigation: mockNavigation, onClose: jest.fn() } },
    { name: 'ResetScreen', Component: ResetScreen, props: { navigation: mockNavigation, onWissen: jest.fn() } },
    { name: 'SettingsScreen', Component: SettingsScreen, props: { navigation: mockNavigation, onClose: jest.fn() } },
    { name: 'CriticalErrorScreen', Component: CriticalErrorScreen, props: {} },
    { name: 'SplashScreen', Component: SplashScreen, props: {} },
    { name: 'WelcomeWizard', Component: WelcomeWizard, props: {} },
  ];

  screens.forEach(({ name, Component, props }) => {
    test(`${name} renders without crashing`, () => {
      render(
        <SafeAreaProvider initialMetrics={safeAreaMetrics}>
          <Component {...(props as any)} />
        </SafeAreaProvider>
      );

      expect(screen.toJSON()).not.toBeNull();
    });
  });
});