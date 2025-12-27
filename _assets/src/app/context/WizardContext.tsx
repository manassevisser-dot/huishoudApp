// src/a../a../a../a../a../a../a../a../a../a../a../a../a../a../a../a../a../a../app/context/WizardContext.tsx
import React from 'react';

export type WizardState = {
  id?: string;
  pageIndex?: number;
  totalPages?: number;
};

type WizardContextValue = {
  wizard: WizardState;
  setWizardState: (next: WizardState) => void;
};

const defaultValue: WizardContextValue = {
  wizard: {},
  setWizardState: () => {}, // no-op voorkomt crashes als er (nog) niets luistert
};

const WizardContext = React.createContext<WizardContextValue>(defaultValue);

export const WizardProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wizard, setWizard] = React.useState<WizardState>({});

  const setWizardState = React.useCallback((next: WizardState) => {
    setWizard((prev) => ({ ...prev, ...next }));
  }, []);

  return (
    <WizardContext.Provider value={{ wizard, setWizardState }}>{children}</WizardContext.Provider>
  );
};

export const useWizard = () => React.useContext(WizardContext);
