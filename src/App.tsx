import React from 'react';
import { FormStateProvider } from '@ui/providers/FormStateProvider';
import { MasterProvider, useMaster } from '@ui/providers/MasterProvider';
import { ThemeProvider } from '@ui/providers/ThemeProvider';
import { WizardProvider } from '@app/context/WizardContext';
import MainNavigator from '@ui/navigation/MainNavigator';
import { initialFormState } from '@app/state/initialFormState';

/**
 * AppContent zorgt ervoor dat we de MasterOrchestrator uit de MasterProvider 
 * kunnen halen en doorgeven aan de ThemeProvider prop.
 */
const AppContent = () => {
  const master = useMaster();

  return (
    <ThemeProvider master={master}>
      <WizardProvider>
        <MainNavigator />
      </WizardProvider>
    </ThemeProvider>
  );
};

const App = () => {
  return (
    <FormStateProvider initialState={initialFormState}>
      <MasterProvider>
        <AppContent />
      </MasterProvider>
    </FormStateProvider>
  );
};

export default App;