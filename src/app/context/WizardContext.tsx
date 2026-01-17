import * as React from 'react';
import { createContext, useContext, useReducer, ReactNode } from 'react';
import { formReducer } from './formReducer';
import { FormState } from '@shared-types/form';
import { makePhoenixState } from '../../test-utils/factories/stateFactory';

// De vorm van de context die beschikbaar is in de app
interface WizardContextType {
  state: FormState;
  dispatch: React.Dispatch<any>;
}

// Props voor de provider, inclusief injectie-opties voor tests
interface WizardProviderProps {
  children: ReactNode;
  initialState?: FormState; // Voor test-injectie
  mockDispatch?: React.Dispatch<any>; // Voor test-injectie (jest.fn())
}

const FormContext = createContext<WizardContextType | undefined>(undefined);

// De standaard initiële staat van de applicatie via de factory
const defaultInitialState = makePhoenixState();

export const WizardProvider: React.FC<WizardProviderProps> = ({
  children,
  initialState,
  mockDispatch,
}) => {
  // 1. Initialiseer de reducer met ofwel de geïnjecteerde staat, of de standaard
  const [state, dispatch] = useReducer(formReducer, initialState || defaultInitialState);

  // 2. Bepaal welke dispatch we gebruiken (echt of mock)
  // Dit zorgt ervoor dat we in tests acties kunnen onderscheppen
  const activeDispatch = mockDispatch || dispatch;

  return (
    <FormContext.Provider value={{ state, dispatch: activeDispatch }}>
      {children}
    </FormContext.Provider>
  );
};

// De hook die gebruikt wordt in componenten zoals LandingScreen
export const useForm = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useForm must be used within a WizardProvider/FormProvider');
  }
  return context;
};

// Alias voor backwards compatibility mocht je nog useWizard gebruiken
export const useWizard = useForm;
