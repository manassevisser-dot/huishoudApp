import * as React from 'react';
import { FormState } from '@core/types/core';
import LandingScreen from 'src/ui/screens/Wizard/LandingScreen';
import { WizardController } from '@ui/screens/Wizard/WizardController';
import MainNavigator from '@ui/navigation/MainNavigator';

interface NavigatorProps {
  state: FormState;
}

const Navigator: React.FC<NavigatorProps> = ({ state }) => {
  switch (state.activeStep) {
    case 'WIZARD':
      return <WizardController />;
    case 'DASHBOARD':
      return <MainNavigator />;
    case 'LANDING':
    default:
      // Geen errors meer, want onSignup/onSignin zijn optioneel in LandingScreen
      return <LandingScreen />;
  }
};

export default Navigator;
