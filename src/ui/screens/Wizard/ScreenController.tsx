// src/ui/screens/Wizard/WizardController.tsx
import React from 'react';
import { useFormState } from '@ui/providers/FormStateProvider';

import { UniversalScreen } from '@ui/screens/UniversalScreen'; // De nieuwe bestemming

/**
 * SCREEN CONTROLLER
 * * Verantwoordelijkheid: 
 * Het koppelen van de huidige navigatiestate aan de MasterOrchestrator
 * om het juiste scherm-ViewModel te genereren.
 */
export const ScreenController: React.FC = () => {
  // 1. Haal de huidige state op (voor de ID)
  const { state } = useFormState();
  
  // 2. Haal de Master op (voor de logica)
  //const master = useMaster();

  // 3. We renderen nu direct het UniversalScreen.
  // We geven ALLEEN de ID door. De UniversalScreen zal de master.ui.buildScreen(id) 
  // aanroep doen om de boomstructuur op te halen.
  return <UniversalScreen screenId={state.currentScreenId} />;
};