import * as React from 'react';
import { useForm } from '../../../app/context/FormContext';
import { WizardPage } from './WizardPage'; 
// Importeer de losse configs als bouwstenen
import { setupHouseholdConfig } from './pages/1setupHousehold.config';
import { detailsHouseholdConfig } from './pages/2detailsHousehold.config';
import { incomeDetailsConfig } from './pages/3incomeDetails.config';
import { fixedExpensesConfig } from './pages/4fixedExpenses.config';

const WizardController: React.FC = () => {
  const { state, dispatch } = useForm();
  
  // Dynamische mapping op basis van activeStep (conform je stateModel)
  const getConfig = () => {
    switch (state.activeStep) {
      case 'WIZARD_SETUP': return setupHouseholdConfig;
      case 'WIZARD_DETAILS': return detailsHouseholdConfig;
      case 'WIZARD_INCOME': return incomeDetailsConfig;
      case 'WIZARD_EXPENSES': return fixedExpensesConfig;
      default: return setupHouseholdConfig;
    }
  };

  const config = getConfig();

  return (
    <WizardPage 
      config={config}
      isFirst={state.activeStep === 'WIZARD_SETUP'}
      isLast={state.activeStep === 'WIZARD_EXPENSES'}
      onNext={() => dispatch({ type: 'NEXT_STEP' })}
      onBack={() => dispatch({ type: 'PREV_STEP' })}
    />
  );
};

export default WizardController;