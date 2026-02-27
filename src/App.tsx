/**
 * @file_intent Definieert het root-component `App`, het startpunt van de React Native-applicatie. De primaire verantwoordelijkheid is het samenstellen en initialiseren van alle essentiële, globale `Providers` die state en services aan de gehele componentenboom leveren.
 * @repo_architecture Composition Root. Dit bestand is het hoogste component in de hiërarchie van de applicatie. Het stelt de globale context vast door providers zoals `FormStateProvider`, `MasterProvider` en `ThemeProvider` te nesten.
 * @term_definition
 *   - `Provider Composition`: De praktijk van het nesten van meerdere React Context Providers om een gelaagde, gedeelde state en functionaliteit te creëren die overal in de applicatie toegankelijk is.
 *   - `Composition Root`: Een enkele, centrale locatie in een applicatie waar de objectgraaf (afhankelijkheden, services, providers) wordt geconstrueerd en samengesteld.
 *   - `AppContent`: Een tussenliggend component dat wordt gebruikt om de `master` orchestrator uit de `MasterProvider`-context te halen en deze als een prop in de `ThemeProvider` te injecteren. Dit patroon is nodig omdat een component niet rechtstreeks toegang heeft tot een context die door een sibling wordt geleverd.
 * @contract Het `App`-component garandeert dat elk onderliggend component dat erin wordt gerenderd (beginnend met `MainNavigator`) toegang heeft tot de contexts die worden geleverd door `FormStateProvider`, `MasterProvider`, `ThemeProvider` en `WizardProvider`. Het rendert de `MainNavigator` als het primaire UI-startpunt.
 * @ai_instruction Het toevoegen van een nieuwe globale provider moet hier gebeuren. Wikkel de bestaande `AppContent` of `MasterProvider` in met de nieuwe provider. Let op de afhankelijkheidsvolgorde; als een nieuwe provider `A` afhankelijk is van een waarde van provider `B`, moet `A` binnen `B` genest worden. Het verwijderen van providers uit dit bestand kan wijdverspreide storingen veroorzaken in elk component dat afhankelijk is van de verwijderde context.
 */
// src/App.tsx
import React from 'react';
import { FormStateProvider } from '@ui/providers/FormStateProvider';
import { MasterProvider, useMaster } from '@ui/providers/MasterProvider';
import { ThemeProvider } from '@ui/providers/ThemeProvider';

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
      
        <MainNavigator />
     
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