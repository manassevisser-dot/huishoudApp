// src/test-utils/render/renderers.tsx
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
// Importeer de factory uit providers om dubbele code te voorkomen
import { createMockOrchestrator, MockMasterOrchestrator } from './providers'; 

export type RenderOptions = Omit<RTLRenderOptions, 'wrapper'> & {
  state?: FormState;
  dispatch?: jest.Mock;
};

export function render(
  ui: React.ReactElement,
  { state, dispatch, ...rtlOptions }: RenderOptions = {},
) {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const activeState = state !== undefined ? state : makePhoenixState();
    const activeDispatch = dispatch !== undefined ? dispatch : jest.fn();
    
    // Initialiseer de orchestrator met de actieve state
    const orchestrator = createMockOrchestrator(activeState);

    const contextValue = {
      state: activeState,
      dispatch: activeDispatch,
      orchestrator,
    };

    return (
      /* ✅ FIX: 'master' prop toegevoegd (vereist door ThemeProvider) */
      <ThemeProvider master={orchestrator as any}>
        <FormContext.Provider value={contextValue as any}>
          {children}
        </FormContext.Provider>
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
    const activeState = state !== undefined ? state : makePhoenixState();
    const activeDispatch = dispatch !== undefined ? dispatch : jest.fn();
    const orchestrator = createMockOrchestrator(activeState);

    return (
      /* ✅ FIX: 'master' prop toegevoegd */
      <ThemeProvider master={orchestrator as any}>
        <FormContext.Provider
          value={{ 
            state: activeState, 
            dispatch: activeDispatch,
            orchestrator
          } as any}
        >
          {children}
        </FormContext.Provider>
      </ThemeProvider>
    );
  };

  return renderHook(callback, { wrapper: Wrapper });
}

/** ✅ Behouden: Jouw async helper */
export const expectTextAsync = async (text: string | RegExp) => {
  await waitFor(
    () => {
      expect(screen.getByText(text)).toBeTruthy();
    },
    { timeout: 2000 },
  );
};