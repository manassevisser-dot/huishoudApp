// WAI-006A-Projector — Pure projection via FSM
import * as React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './app/context/ThemeContext';
import { FormProvider } from './context/FormContext';
import { useAppOrchestration } from '@app/hooks/useAppOrchestration';
import { useAppStyles } from '@ui/styles/useAppStyles';

import SplashScreen from '@ui/screens/SplashScreen';
import WelcomeWizard from '@ui/screens/WelcomeWizard';
import MainNavigator from '@ui/navigation/MainNavigator';
import CriticalErrorScreen from '@ui/screens/CriticalErrorScreen';

const AppContent: React.FC = () => {
  const { status, resetApp } = useAppOrchestration();
  const { styles } = useAppStyles();

  switch (status) {
    case 'INITIALIZING':
    case 'HYDRATING':
      return <SplashScreen />;
    case 'UNBOARDING':
      return <WelcomeWizard />;
    case 'READY':
      return <MainNavigator />;
    case 'ERROR':
      return <CriticalErrorScreen onReset={resetApp} />;
    default:
      return <SplashScreen />; // defensief
  }
};

const App: React.FC = () => (
  <SafeAreaProvider>
    <ThemeProvider>
      <FormProvider>
        <AppContent />
      </FormProvider>
    </ThemeProvider>
  </SafeAreaProvider>
);

export default App;
