// src/ui/navigation/MainNavigator.tsx
import React from 'react';
import { useFormState } from '@ui/providers/FormStateProvider';
import { UniversalScreen } from '../screens/UniversalScreen';

const MainNavigator = () => {
  const { state } = useFormState();

  // state.activeStep is nu de leidende ID uit de ScreenRegistry [cite: 143, 145]
  return <UniversalScreen screenId={state.activeStep} />;
};

export default MainNavigator;