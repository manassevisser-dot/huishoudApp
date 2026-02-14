// src/ui/screens/Wizard/WizardController.tsx
import React, { useMemo } from 'react';
import { useFormState } from '@ui/providers/FormStateProvider';
import { WizardPage } from './WizardPage';
import { getPageConfig } from '@ui/screens/Wizard/registry/pageConfigRegistry';

export const WizardController: React.FC = () => {
  const { state } = useFormState();

  const config = useMemo(
    () => getPageConfig(state.currentPageId),
    [state.currentPageId]
  );

  return <WizardPage config={config} />;
};