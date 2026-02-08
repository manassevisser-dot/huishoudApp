const WizardContent: React.FC = () => {
  const { state } = useFormContext();

  // De Controller is nu ECHT alleen een wisselwachter voor de config
  const config = React.useMemo(() => {
    switch (state.activeStep) {
      case 'WIZARD_SETUP': return setupHouseholdConfig;
      // ...
    }
  }, [state.activeStep]);

  // We geven ALLEEN de config door. De Page regelt de rest zelf met de Master.
  return <WizardPage config={config} />;
};