import React from 'react';
import { render as rtlRender, RenderOptions as RTLRenderOptions, renderHook } from '@testing-library/react-native';
import { ThemeProvider } from '@app/context/ThemeContext';
import { FormContext } from '@app/context/FormContext';
import { FormState } from '@shared-types/form';
import { makePhoenixState } from '../factories/stateFactory';
// Voeg waitFor toe aan de lijst met imports
import { 
   
  screen, 
  waitFor, // <--- DEZE MOET ERBIJ
  // ... andere imports zoals fireEvent
} from '@testing-library/react-native';
export type RenderOptions = Omit<RTLRenderOptions, 'wrapper'> & {
  state?: FormState;
  dispatch?: jest.Mock;
};

// De hoofd-render functie
export function render(
  ui: React.ReactElement,
  { state, dispatch, ...rtlOptions }: RenderOptions = {}
) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const contextValue = {
      state: state || makePhoenixState(),
      dispatch: dispatch || jest.fn(),
    };

    return (
      <ThemeProvider>
        <FormContext.Provider value={contextValue}>
          {children}
        </FormContext.Provider>
      </ThemeProvider>
    );
  };
  return rtlRender(ui, { wrapper: Wrapper, ...rtlOptions });
}

// Aliassen zodat alle verschillende tests blijven werken
export const renderWithState = render;

export function renderHookWithProviders<TProps, TResult>(
  callback: (props: TProps) => TResult,
  options: RenderOptions = {}
) {
  const { state, dispatch } = options;
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ThemeProvider>
      <FormContext.Provider value={{ state: state || makePhoenixState(), dispatch: dispatch || jest.fn() }}>
        {children}
      </FormContext.Provider>
    </ThemeProvider>
  );

  return renderHook(callback, { wrapper: Wrapper });
}

// Voeg dit toe aan je test-utils voor later
export const expectTextAsync = async (text: string | RegExp) => {
  await waitFor(() => {
    expect(screen.getByText(text)).toBeTruthy();
  }, { timeout: 2000 });
};