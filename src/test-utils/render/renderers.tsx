import React from 'react';
import { render as rtlRender, RenderOptions as RTLRenderOptions, renderHook } from '@testing-library/react-native';
import { ThemeProvider } from '../../app/context/ThemeContext';
import { FormContext } from '../../app/context/FormContext';
import { FormState } from '../../shared-types/form';
import { makePhoenixState } from '../factories/stateFactory';

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
  console.log('UI to render:', ui);
  console.log('Wrapper component:', Wrapper);
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