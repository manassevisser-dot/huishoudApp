import * as React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { ThemeProvider } from '@context/ThemeContext';
import { FormContext } from '@app/context/FormContext';
import { FormStateFixture } from './fixtures';
import { FormState } from '@shared-types/form';

// Safe-area stabiel houden
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

type ProvidersProps = {
  children: React.ReactNode;
  state?: FormState;
  dispatch?: React.Dispatch<any>;
  theme?: 'light' | 'dark';
};

export function Providers({ children, state, dispatch }: ProvidersProps) {
  const value = {
    state: state ?? FormStateFixture,
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

export function renderWithProviders(
  ui: React.ReactElement,
  options?: RenderOptions & { state?: FormState; dispatch?: React.Dispatch<any>; theme?: 'light' | 'dark' }
) {
  const { state, dispatch, theme = 'light', ...rest } = options ?? {};
  return render(
    <Providers state={state} dispatch={dispatch} theme={theme}>
      {ui}
    </Providers>, 
    rest
  );
}