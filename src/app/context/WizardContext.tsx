import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import { useFormState } from '@ui/providers/FormStateProvider';
import { useMaster } from '@ui/providers/MasterProvider';

interface WizardContextType {
  activeStepId: string; 
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  canNext: boolean; 
  master: ReturnType<typeof useMaster>;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const WizardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // FIX: Destructure 'state' uit de FormStateContextType
  const { state } = useFormState();
  const master = useMaster();
  
  const activeStepId = state.activeStep; 

  // De master bepaalt of we verder mogen op basis van de huidige sectie
  const canNext = useMemo(() => {
    return master.canNavigateNext(activeStepId); 
  }, [master, activeStepId, state.data]);

  const goToNextStep = () => {
    if (canNext) {
      master.onNavigateNext(); 
    }
  };

    const goToPreviousStep = () => {
      master.onNavigateBack();
    };

  const value = useMemo(() => ({
    activeStepId,
    goToNextStep,
    goToPreviousStep,
    canNext,
    master
  }), [activeStepId, canNext, master]);

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
};

export const useWizard = () => {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
};