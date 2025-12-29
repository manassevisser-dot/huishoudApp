import * as React from 'react'; import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface WizardState {
  pageIndex: number;
  steps: string[];
}

interface WizardContextType {
  state: WizardState;
  setPageIndex: (index: number) => void;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const WizardProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<WizardState>({ pageIndex: 0, steps: [] });

  const setPageIndex = useCallback((index: number) => {
    setState(prev => ({ ...prev, pageIndex: index }));
  }, []);

  return (
    <WizardContext.Provider value={{ state, setPageIndex }}>
      {children}
    </WizardContext.Provider>
  );
};

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (!context) throw new Error('useWizard must be used within WizardProvider');
  return context;
};