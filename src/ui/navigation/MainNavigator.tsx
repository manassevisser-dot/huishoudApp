import React from 'react';
import { useFormContext as useForm } from '@app/context/FormContext';
import LandingScreen from '../screens/Wizard/LandingScreen';
import WizardController from '../screens/Wizard/WizardController';
import DashboardScreen from '../screens/Dashboard/DashboardScreen';

const MainNavigator = () => {
  const { state } = useForm();

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
