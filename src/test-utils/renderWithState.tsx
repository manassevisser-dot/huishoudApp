
// src/test-utils/renderWithState.tsx
import * as React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { ThemeProvider } from '/home/user/pre7/src/app/context/ThemeContext';
import  {FormContext}  from '@context/FormContext';
import { FormStateFixture } from '@test-utils/rtl';
import type { FormState } from '@shared-types/form';

type ProvidersProps = {
  children: React.ReactNode;
  state?: FormState;
  dispatch?: React.Dispatch<any>;
};

export function Providers({ children, state, dispatch }: ProvidersProps) {
  const value = { state: state ?? FormStateFixture, dispatch: dispatch ?? jest.fn() };
  return (
    <ThemeProvider>
      <FormContext.Provider value={value}>
        {children}
      </FormContext.Provider>
    </ThemeProvider>
  );
}

/**
 * renderWithState:
 * - gebruik voor componenten die (indirect) FormContext + ThemeContext nodig hebben
 * - optioneel custom state meegeven
 */
export function renderWithState(
  ui: React.ReactElement,
  options?: RenderOptions & { state?: FormState; dispatch?: React.Dispatch<any> }
) {
  const { state, dispatch, ...rest } = options ?? {};
  return render(<Providers state={state} dispatch={dispatch}>{ui}</Providers>, rest);
}
