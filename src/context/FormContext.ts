import * as React from 'react';

type AnyState = Record<string, any>;
const Ctx = React.createContext<{ state: AnyState; dispatch: (a:any)=>void }>({
  state: {},
  dispatch: () => {},
});

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Ctx.Provider value={{ state: {}, dispatch: () => {} }}>{children}</Ctx.Provider>
);

export function useFormContext() { return React.useContext(Ctx); }
