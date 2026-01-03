import React from 'react';
import { ThemeProvider } from '@app/context/ThemeContext';
import { FormContext } from '@app/context/FormContext';
import { FormState } from '@shared-types/form';

// Mock Safe Area (Essentieel voor renders)
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Minimale, valide state voor tests (Lokaal gedefinieerd = Veilig)
const DEFAULT_TEST_STATE: FormState = {
  schemaVersion: '1.0',
  activeStep: 'LANDING',
  currentPageId: 'setupHousehold',
  isValid: false,
  data: {
    setup: { aantalMensen: 0, aantalVolwassen: 0, autoCount: 'Nee' },
    household: { members: [] },
    finance: { income: { items: [] }, expenses: { items: [] } },
  },
  meta: { lastModified: '', version: 1 }
};

type ProvidersProps = {
  children: React.ReactNode;
  state?: FormState;
  dispatch?: React.Dispatch<any>;
  theme?: 'light' | 'dark';
};

export function Providers({ children, state, dispatch }: ProvidersProps) {
  // Safety Check: Bestaan de Contexts?
  if (!ThemeProvider) throw new Error('❌ ThemeProvider is undefined! Check imports.');
  if (!FormContext) throw new Error('❌ FormContext is undefined! Check imports.');

  const value = {
    state: state ?? DEFAULT_TEST_STATE,
    dispatch: dispatch ?? jest.fn(),
  };

  return (
    <ThemeProvider>
      <FormContext.Provider value={value}>
        {children}
      </FormContext.Provider>
    </ThemeProvider>
  );
}

export default Providers;
