// FIX A: Gebruik namespace import voor React om TS1259 te omzeilen
import * as React from 'react';
import { createContext, useContext, useState, useCallback } from 'react';

// FIX B: Verwijder FormValue als deze niet in de domain kernel zit
import { FormState, FormAction } from '@domain/types/form';

// ADR-12: Types voor selectors
export type { FormState, FormAction };

interface FormContextValue {
  state: FormState;
  dispatch: (action: FormAction) => void;
  updateField: (page: string, field: string, value: any) => void;
  isRefreshing: boolean;
  refreshData: () => Promise<void>;
}

const FormContext = createContext<FormContextValue | undefined>(undefined);

// FIX C: Expliciete type-definitie voor children om TS7031 te voorkomen
export const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<FormState>({
    schemaVersion: '2.0',
    isSpecialStatus: false,
    C1: { aantalMensen: 0, aantalVolwassen: 0 },
    C4: { leden: [] },
    C7: { items: [] },
    C10: { items: [] },
  });

  const [isRefreshing, setIsRefreshing] = useState(false);

  const dispatch = useCallback((action: FormAction) => {
    // Reducer logica hier...
  }, []);

  const updateField = useCallback((page: string, field: string, value: any) => {
    setState((prev: FormState) => {
      if (page === 'global') {
        return { ...prev, [field]: value };
      }
      return {
        ...prev,
        [page]: { ...prev[page as keyof FormState], [field]: value }
      };
    });
  }, []);

  const refreshData = useCallback(async () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
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