// src/test-utils/render/providers.tsx
import React from 'react';
import { ThemeProvider } from '@ui/providers/ThemeProvider';
import { FormContext } from '@app/context/FormContext';
import { FormState } from '@core/types/core';

// jest.Mock Safe Area
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

const DEFAULT_TEST_STATE: FormState = {
  schemaVersion: '1.0',
  activeStep: 'LANDING',
  currentPageId: 'setupHousehold',
  isValid: false,
  viewModels: {},
  data: {
    setup: { aantalMensen: 0, aantalVolwassen: 0, autoCount: 'Geen' },
    household: { members: [] },
    finance: { income: { items: [] }, expenses: { items: [] } },
  },
  meta: { lastModified: '', version: 1 },
};

// FIX: Interface uitgebreid om exact te matchen met MasterOrchestrator
interface MockOrchestrator {
  getValue: jest.Mock;
  updateField: jest.Mock;
  validate: jest.Mock;
  handleCsvImport: jest.Mock; // Naam gecorrigeerd
  fso: Record<string, unknown>; // Toegevoegd
  research: Record<string, unknown>; // Toegevoegd
}

const createMockOrchestrator = (state: FormState): MockOrchestrator => ({
  getValue: jest.fn((fieldId: string) => {
    if (fieldId === 'aantalVolwassen') {
      return state.data.setup.aantalVolwassen;
    }
    return null;
  }),
  updateField: jest.fn(),
  validate: jest.fn(() => null),
  handleCsvImport: jest.fn(), // Gecorrigeerde naam naar aanleiding van error
  fso: {}, 
  research: {},
});

type ProvidersProps = {
  children: React.ReactNode;
  state?: FormState;
  dispatch?: React.Dispatch<any>;
  theme?: 'light' | 'dark';
};

export function Providers({ children, state, dispatch }: ProvidersProps) {
  const activeState = state !== undefined ? state : DEFAULT_TEST_STATE;
  
  // We gebruiken hier 'as a_ny' voor de context-waarde om de complexe 
  // Dispatch-type mismatches in tests te omzeilen, maar de orchestrator is nu wel compleet.
  const value = {
    state: activeState,
    dispatch: dispatch !== undefined ? dispatch : jest.fn(),
    orchestrator: createMockOrchestrator(activeState),
  };
//we accept 'as any' this is a test utility
  return (
    <ThemeProvider>
      <FormContext.Provider value={value as any}>{children}</FormContext.Provider>
    </ThemeProvider>
  );
}

export default Providers;