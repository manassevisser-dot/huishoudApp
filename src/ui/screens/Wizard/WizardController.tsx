import * as React from 'react';
import { useForm } from '@app/context/FormContext';
import { WizardPage } from './WizardPage';
import { setupHouseholdConfig } from './pages/1setupHousehold.config';
import { detailsHouseholdConfig } from './pages/2detailsHousehold.config';
import { incomeDetailsConfig } from './pages/3incomeDetails.config';
import { fixedExpensesConfig } from './pages/4fixedExpenses.config';
import { FormStateValueProvider } from '@adapters/valueProviders/FormStateValueProvider';
import { StateWriterAdapter } from '@adapters/valueProviders/StateWriterAdapter';
import { FormStateOrchestrator } from '@app/orchestrators/FormStateOrchestrator';

const WizardController: React.FC = () => {
  const { state } = useForm();

  const config = React.useMemo(() => {
    switch (state.activeStep) {
      case 'WIZARD_SETUP':   return setupHouseholdConfig;
      case 'WIZARD_DETAILS': return detailsHouseholdConfig;
      case 'WIZARD_INCOME':  return incomeDetailsConfig;
      case 'WIZARD_EXPENSES':return fixedExpensesConfig;
      default:               return setupHouseholdConfig;
    }
  }, [state.activeStep]);

  // ✅ Orchestrator eerst
  const orchestrator = React.useMemo(
    () => new FormStateOrchestrator(state),
    [state]
  );

  // ✅ Adapter-ValueProvider voed je met de orchestrator (heeft getValue(FieldId))
  const valueProvider = React.useMemo(
    () => new FormStateValueProvider(orchestrator),
    [orchestrator]
  );

  // ✅ K-B2: StateWriterAdapter façade voor writes (validatie/coercion via boundary)
  const stateWriter = React.useMemo(
    () => new StateWriterAdapter(orchestrator),
    [orchestrator]
  );

  return (
    <WizardPage
      config={config}
      valueProvider={valueProvider}
      stateWriter={stateWriter}                           // K-B2: StateWriterAdapter façade
      validate={orchestrator.validate ?? (() => null)}    // P2: fallback naar no-op
    />
  );
};

export default WizardController;