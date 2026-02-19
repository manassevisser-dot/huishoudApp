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
  
  // FIX TS2322: buildScreenViewModel moet een valide ScreenViewModel structuur mocken
  ui: {
    buildFieldViewModel: jest.fn(() => null),
    builScreenViewModel: jest.fn(() => ({
      screenId: state.currentScreenId,
      titleToken: 'mock.title',
      fields: []
    } as any)),
    buildScreenViewModels: jest.fn(() => []),
  },

  // FIX TS2739: IThemeOrchestrator mist methodes
  theme: {
    loadTheme: jest.fn(() => Promise.resolve('light' as any)),
    setTheme: jest.fn(),
    getTheme: jest.fn(() => 'light'),
    onThemeChange: jest.fn(() => () => {}), // Returns unsubscribe fn
  },

  // FIX TS2740: INavigationOrchestrator mist methodes (startWizard, goToDashboard, etc)
  navigation: {
    getCurrentScreenId: jest.fn(() => state.currentScreenId),
    canNavigateNext: jest.fn(() => true),
    navigateNext: jest.fn(),
    navigateBack: jest.fn(),
    startWizard: jest.fn(),
    goToDashboard: jest.fn(),
    goToOptions: jest.fn(),
    goToSettings: jest.fn(),
    // Spread any overige verplichte methodes als NOOP mocks
    ...({
      completeWizard: jest.fn(),
      resetWizard: jest.fn(),
      jumpToScreen: jest.fn(),
    } as any)
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