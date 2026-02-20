// src/app/context/WizardContext.tsx
/**
 * @file_intent Faciliteert de navigatie-logica binnen de wizard-flow door de MasterProvider en FormState te koppelen aan specifieke UI-acties.
 * @repo_architecture Mobile Industry (MI) - UI Navigation Layer.
 * @term_definition activeStepId = De huidige stap in de wizard. canNext = Berekende boolean die aangeeft of de huidige stap valide is voor navigatie.
 * @contract Delegeert navigatie-orders naar de 'Master' (Orchestrator-laag). Zorgt voor een abstractie-laag zodat UI-knoppen niet direct met de orchestrator hoeven te praten.
 * @ai_instruction ⚠️ DEPRECATION WARNING: Dit bestand is mogelijk redundant geworden door de gecentraliseerde UIOrchestrator. Controleer of componenten nog 'useWizard' gebruiken of dat ze direct naar de orchestrator via 'FormContext' zijn gemigreerd.
 */

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