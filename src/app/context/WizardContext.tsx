// src/app/context/WizardContext.tsx
import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { useFormContext } from './FormContext';

/**
 * WIZARD CONTEXT
 * * Verantwoordelijkheid:
 * ✅ Navigatie (currentStep, goToNextStep)
 * ✅ De brug vormen tussen de MasterOrchestrator en de WizardPage
 */

interface WizardContextType {
  // Navigatie state
  currentStep: number;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
  
  // Toegang tot de MasterOrchestrator voor de UI
  // We exposen de master zodat de Page 'master.render' kan aanroepen
  master: ReturnType<typeof useFormContext>['orchestrator'];
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export const WizardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // 1. Haal de MasterOrchestrator op uit de FormContext
  const { orchestrator: master } = useFormContext();
  
  // 2. Beheer navigatie state
  const [currentStep, setCurrentStep] = useState(0);

  // 3. Navigatie functies
  const goToNextStep = () => setCurrentStep(prev => prev + 1);
  const goToPreviousStep = () => setCurrentStep(prev => prev - 1);

  // 4. Memoizeer de context waarde
  const value = useMemo(() => ({
    currentStep,
    goToNextStep,
    goToPreviousStep,
    master // De master bevat master.render, master.updateField, etc.
  }), [currentStep, master]);

  return <WizardContext.Provider value={value}>{children}</WizardContext.Provider>;
};

/**
 * Hook om de Wizard te gebruiken.
 * Moet ALTIJD binnen een FormProvider staan!
 */
export const useWizard = () => {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error('useWizard must be used within a WizardProvider (which must be inside a FormProvider)');
  }
  return context;
};