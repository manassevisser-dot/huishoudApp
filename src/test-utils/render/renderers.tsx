import React from 'react';
import {
  render as rtlRender,
  RenderOptions as RTLRenderOptions,
  renderHook,
  screen,
  waitFor,
} from '@testing-library/react-native';
import { ThemeProvider } from '@ui/providers/ThemeProvider';
import { FormContext } from '@app/context/FormContext';
import { FormState } from '@core/types/core';
import { makePhoenixState } from '../factories/stateFactory';

// We maken een herbruikbare mock orchestrator voor de renderers
const createMockOrchestrator = () => ({
  getValue: jest.fn(),
  updateField: jest.fn(),
  validate: jest.fn(() => null),
  importCsvData: jest.fn(),
} as any);

export type RenderOptions = Omit<RTLRenderOptions, 'wrapper'> & {
  state?: FormState;
  dispatch?: jest.Mock;
};

export function render(
  ui: React.ReactElement,
  { state, dispatch, ...rtlOptions }: RenderOptions = {},
) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    // ESLint fix: expliciet checken op undefined
    const activeState = state !== undefined ? state : makePhoenixState();
    const activeDispatch = dispatch !== undefined ? dispatch : jest.fn();

    const contextValue = {
      state: activeState,
      dispatch: activeDispatch,
      orchestrator: createMockOrchestrator(),
    };

    return (
      <ThemeProvider>
        <FormContext.Provider value={contextValue}>{children}</FormContext.Provider>
      </ThemeProvider>
    );
  };
  return rtlRender(ui, { wrapper: Wrapper, ...rtlOptions });
}

export const renderWithState = render;

export function renderHookWithProviders<TProps, TResult>(
  callback: (props: TProps) => TResult,
  options: RenderOptions = {},
) {
  const { state, dispatch } = options;
  
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    // ESLint fix: expliciet checken op undefined
    const activeState = state !== undefined ? state : makePhoenixState();
    const activeDispatch = dispatch !== undefined ? dispatch : jest.fn();

    return (
      <ThemeProvider>
        <FormContext.Provider
          value={{ 
            state: activeState, 
            dispatch: activeDispatch,
            orchestrator: createMockOrchestrator()
          }}
        >
          {children}
        </FormContext.Provider>
      </ThemeProvider>
    );
  };

  return renderHook(callback, { wrapper: Wrapper });
}

export const expectTextAsync = async (text: string | RegExp) => {
  await waitFor(
    () => {
      expect(screen.getByText(text)).toBeTruthy();
    },
    { timeout: 2000 },
  );
};