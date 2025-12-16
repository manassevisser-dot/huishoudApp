import * as React from 'react';

type AnyState = Record<string, any>;

const defaultValue = {
  state: {} as AnyState,
  dispatch: (_action: any) => {},
};

/**
 * Minimal stub: always returns an empty state and no-op dispatch.
 * Enough for module resolution in snack-min; no JSX here (TS-friendly).
 */
export function useFormContext() {
  return defaultValue;
}

/**
 * Minimal FormProvider: just returns children without JSX to avoid parsing issues in .ts.
 */
export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return React.createElement(React.Fragment, null, children);
};
