import React, { createContext, useContext, useState, useCallback } from 'react';
import { FormState, FormAction } from '@shared-types/form';

export { FormState, FormAction }; // Exporteer ze hier ook voor selectors/test-logic.ts

interface FormContextValue {
  state: FormState;
  dispatch: (action: FormAction) => void; // Legacy ondersteuning
  updateField: (page: string, field: string, value: any) => void;
  isRefreshing: boolean;
  refreshData: () => Promise<void>;
}

const FormContext = createContext<FormContextValue | undefined>(undefined);

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<FormState>({
    schemaVersion: '2.0',
    isSpecialStatus: false,
    C1: { aantalMensen: 0, aantalVolwassen: 0 },
    C4: { leden: [] },
    C7: { items: [] },
    C10: { items: [] },
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Legacy dispatch om bestaande componenten te laten werken
  const dispatch = useCallback((action: FormAction) => {
    // Hier kun je een simpele reducer-logica toevoegen indien nodig
  }, []);

  const updateField = useCallback((page: string, field: string, value: any) => {
    setState((prev: FormState) => {
      // Als de 'page' global is, zetten we het op de root
      if (page === 'global') {
        return { ...prev, [field]: value };
      }
      // Anders zetten we het in de specifieke sectie (C1, C4, etc)
      return {
        ...prev,
        [page]: { ...prev[page], [field]: value },
      };
    });
  }, []);

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
  }, []);

  return (
    <FormContext.Provider value={{ state, dispatch, updateField, isRefreshing, refreshData }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) throw new Error('useFormContext must be used within FormProvider');
  return context;
};
