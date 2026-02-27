// src/test-utils/render/providers.tsx
import React from 'react';
import { ThemeProvider } from '@ui/providers/ThemeProvider';
import { FormContext } from '@app/context/FormContext';
import { FormState } from '@core/types/core';
import type { MasterOrchestratorAPI } from '@app/types/MasterOrchestratorAPI';

// jest.Mock Safe Area - Behouden uit origineel
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

const DEFAULT_TEST_STATE: FormState = {
  schemaVersion: '1.0',
  activeStep: 'LANDING',
  currentScreenId: 'setupHousehold',
  isValid: false,
  viewModels: {},
  data: {
    setup: { 
      aantalMensen: 0, 
      aantalVolwassen: 0, 
      autoCount: 'Geen',
      woningType: 'Koop', 
    },
    household: { members: [] },
    finance: { income: { items: [] }, expenses: { items: [] } },
  },
  meta: { lastModified: '', version: 1 },
};

export interface MockMasterOrchestrator extends MasterOrchestratorAPI {}

export const createMockOrchestrator = (state: FormState): MockMasterOrchestrator => ({
canNavigateNext: jest.fn(() => true),
onNavigateNext: jest.fn(),
onNavigateBack: jest.fn(),
isVisible: jest.fn(() => true),
updateField: jest.fn(),
handleCsvImport: jest.fn(() => Promise.resolve()),
executeReset: jest.fn(),
saveDailyTransaction: jest.fn(),
buildRenderScreen: jest.fn(() => ({
  screenId: state.currentScreenId,
  titleToken: 'mock.title',
  fields: [],
} as any)),

  // ✔ IUIOrchestrator – enige geldige methode
  ui: {
    buildScreen: jest.fn(() => ({
      screenId: state.currentScreenId,
      titleToken: 'mock.title',
      fields: [],
    } as any)),
  },

  // ✔ IThemeOrchestrator
  theme: {
    loadTheme: jest.fn(() => Promise.resolve('light' as any)),
    setTheme: jest.fn(),
    getTheme: jest.fn(() => 'light'),
    onThemeChange: jest.fn(() => () => {}),
  },

  // ✔ INavigationOrchestrator – volledig & correct
  navigation: {
    getCurrentScreenId: jest.fn(() => state.currentScreenId),
    canNavigateNext: jest.fn(() => true),
    navigateNext: jest.fn(),
    navigateBack: jest.fn(),
    startWizard: jest.fn(),
    goToDashboard: jest.fn(),
    goToOptions: jest.fn(),
    goToSettings: jest.fn(),
    goToCsvUpload: jest.fn(),
    goToCsvAnalysis: jest.fn(),
    goToReset: jest.fn(),
    goBack: jest.fn(),
    goToUndo: jest.fn(), // ← verplicht volgens interface
  },
});

type ProvidersProps = {
  children: React.ReactNode;
  state?: FormState;
  dispatch?: React.Dispatch<any>;
};

export function Providers({ children, state, dispatch }: ProvidersProps) {
  const activeState = state !== undefined ? state : DEFAULT_TEST_STATE;
  const orchestrator = createMockOrchestrator(activeState);

  const value = {
    state: activeState,
    dispatch: dispatch !== undefined ? dispatch : jest.fn(),
    orchestrator,
  };

  return (
    <ThemeProvider master={orchestrator as any}>
      <FormContext.Provider value={value as any}>
        {children}
      </FormContext.Provider>
    </ThemeProvider>
  );
}

export default Providers;