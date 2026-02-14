import React from 'react';
import LandingScreen from '../screens/Wizard/LandingScreen';
import { WizardController} from '@ui/screens/Wizard/WizardController';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import { useFormState } from '@ui/providers/FormStateProvider';


const MainNavigator = () => {
  const {state}= useFormState();

  // Bepaal welk scherm getoond moet worden op basis van de globale state
  switch (state.activeStep) {
    case 'WIZARD':
      return <WizardController />;
    case 'DASHBOARD':
      return <DashboardScreen />;
    case 'LANDING':
    default:
      return <LandingScreen />;
  }
};

export default MainNavigator;
