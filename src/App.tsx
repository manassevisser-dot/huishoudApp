import React from 'react';
import { ThemeProvider } from '@app/context/ThemeContext';
import { WizardProvider } from '@app/context/WizardContext';
import { FormProvider } from '@app/context/FormContext';
import MainNavigator from '@ui/navigation/MainNavigator';
// Let op de kleine 'i'
import { initialFormState } from '@app/context/initialFormState';

const App = () => {
  return (
    <ThemeProvider>
      {/* Gebruik de juiste variabele naam */}
      <FormProvider initialState={initialFormState}>
        <WizardProvider>
          <MainNavigator />
        </WizardProvider>
      </FormProvider>
    </ThemeProvider>
  );
};

export default App;
// PHOENIX_EVENT: Boot sequence initiated
