
// src/test-utils/renderHook.tsx
import * as React from 'react';
import { renderHook, act } from '@testing-library/react-native';
import { ThemeProvider } from '@app/context/ThemeContext';
import { FormContext } from '@app/context/FormContext';
import { FormStateFixture } from '@test-utils/fixtures';
import type { FormState } from '@shared-types/form';

// Optioneel maar handig in RN-test suites:
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

type HookProvidersProps = {
  children: React.ReactNode;
  state?: FormState;
  dispatch?: React.Dispatch<any>;
};

export function HookProviders({ children, state, dispatch }: HookProvidersProps) {
  const value = {
    state: state ?? FormStateFixture,
    dispatch: dispatch ?? jest.fn(),
  };
  return (
    <ThemeProvider>
      <FormContext.Provider value={value}>{children}</FormContext.Provider>
    </ThemeProvider>
  );
}

/**
 * renderHookWithProviders:
 * - Wrapt je hook automatisch met ThemeProvider + FormContext
 * - Handig voor hooks die `useTheme()` of `useForm()` gebruiken
 */
/**
 * renderHookWithProviders:
 * - Wrapt je hook automatisch met ThemeProvider + FormContext
 */
export function renderHookWithProviders<TProps, TResult>(
  callback: (props: TProps) => TResult, // Verwijder de optionele '?' voor betere type-safety
  options?: {
    initialProps?: TProps;
    state?: FormState;
    dispatch?: React.Dispatch<any>;
  }
) {
  const { initialProps, state, dispatch } = options ?? {};

  // De wrapper krijgt nu de props door van de rerender
  const wrapper = ({ children, ...props }: { children: React.ReactNode } & TProps) => (
    <HookProviders 
      state={(props as any).state || state} 
      dispatch={dispatch}
    >
      {children}
    </HookProviders>
  );

  const utils = renderHook(callback, { 
    initialProps: { ...initialProps, state } as any, 
    wrapper 
  });

  return {
    ...utils,
    act,
    // Fix voor de rerender error
    setState(nextState: FormState) {
      // In RN RTL geef je alleen de nieuwe props mee
      utils.rerender({ state: nextState } as any);
    },
    getDispatch() {
      return dispatch ?? jest.fn();
    },
  };
}