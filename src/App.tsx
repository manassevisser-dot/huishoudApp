// src/App.tsx
/**
 * @file_intent Hoofd-entrypoint van de applicatie. Brengt alle basis-providers samen en start de UI.
 * @repo_architecture Application Core - UI Layer.
 * @term_definition Provider Composition = Het nesten van React Context Providers om een globale state en functionaliteit op te bouwen.
 * @contract Zorgt ervoor dat alle componenten toegang hebben tot de benodigde contexts (form state, master orchestrator, theme, wizard).
 * @ai_instruction Wijzigingen in de provider-structuur hier kunnen de hele applicatie beïnvloeden. Wees voorzichtig bij het toevoegen of verwijderen van globale providers.
 */
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