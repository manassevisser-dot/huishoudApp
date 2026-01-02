import React from 'react';
import { 
  render as rtlRender, 
  renderHook as rtlRenderHook,
  RenderOptions 
} from '@testing-library/react-native';
import { Providers } from './providers';
import { FormState } from '@shared-types/form';

// Custom Render
export function renderWithProviders(
  ui: React.ReactElement,
  options?: RenderOptions & { state?: FormState; dispatch?: React.Dispatch<any> }
) {
  const { state, dispatch, ...rest } = options ?? {};
  
  return rtlRender(
    <Providers state={state} dispatch={dispatch}>
      {ui}
    </Providers>, 
    rest
  );
}

// Custom RenderHook
export function renderHookWithProviders<Result, Props>(
  render: (initialProps: Props) => Result,
  options?: { state?: FormState; dispatch?: React.Dispatch<any> }
) {
  const { state, dispatch } = options ?? {};
  
  return rtlRenderHook(render, {
    wrapper: ({ children }) => (
      <Providers state={state} dispatch={dispatch}>
        {children}
      </Providers>
    ),
  });
}

// Aliases voor backward compatibility
export const renderWithState = renderWithProviders;
export const render = renderWithProviders;

// Re-export RTL utilities
export * from '@testing-library/react-native';
