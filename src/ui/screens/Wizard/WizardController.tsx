
// src/ui/screens/Wizard/WizardController.tsx
import * as React from 'react';
import { useState, useMemo, useCallback } from 'react';
import { useForm } from '@app/context/FormContext';
import { WizardPage } from './WizardPage';
// Geen vage import uit de map './pages' meer, maar direct naar de bron:
import { setupHouseholdConfig } from './pages/1setupHousehold.config';
import { detailsHouseholdConfig } from './pages/2detailsHousehold.config';
import { incomeDetailsConfig } from './pages/3incomeDetails.config';
import { fixedExpensesConfig } from './pages/4fixedExpenses.config';

// Dit vormt je 'slimme' array die de Wizard aanstuurt
const pages = [
  setupHouseholdConfig,
  detailsHouseholdConfig,
  incomeDetailsConfig,
  fixedExpensesConfig,
];

export const WizardController: React.FC<any> = () => {
  const { state, dispatch } = useForm() as any;
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Bundel configs — memoize om re-renders wat rustiger te maken
  const pages = useMemo(
    () => [
      setupHouseholdConfig,
      detailsHouseholdConfig,
      incomeDetailsConfig,
      fixedExpensesConfig,
    ],
    []
  );

  const currentPageConfig = pages[currentPageIndex];

  const handleNext = useCallback(() => {
    // BUSINESS RULE: Bij het verlaten van de setup, synchroniseer we de ledenlijst
    if (currentPageConfig?.id === '1setupHousehold') {
      const aantal = state.setup?.aantalMensen ?? 1;
      dispatch({
        type: 'SYNC_MEMBERS',
        payload: { count: aantal },
      });
    }

    // Navigeer naar de volgende pagina (alleen als we niet op de laatste zitten)
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex((prev) => prev + 1);
    }
  }, [currentPageConfig?.id, currentPageIndex, pages.length, state.setup?.aantalMensen, dispatch]);

  const handleBack = useCallback(() => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
    }
  }, [currentPageIndex]);

  // (optioneel) Guard — als er geen config is (out of bounds), render niets of een fallback
  if (!currentPageConfig) {
    return null;
  }

  return (
    <WizardPage
      config={currentPageConfig}
      onNext={handleNext}
      onBack={handleBack}
      isFirst={currentPageIndex === 0}
      isLast={currentPageIndex === pages.length - 1}
    />
  );
};
