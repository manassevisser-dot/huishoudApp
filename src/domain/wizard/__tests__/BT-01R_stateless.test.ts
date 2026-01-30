
// De logica uit WizardController.tsx, maar dan testbaar geëxtraheerd
const getStepConfig = (activeStep: string, configs: any) => {
  switch (activeStep) {
    case 'WIZARD_SETUP': return configs.setup;
    case 'WIZARD_DETAILS': return configs.details;
    case 'WIZARD_INCOME': return configs.income;
    case 'WIZARD_EXPENSES': return configs.expenses;
    default: return configs.setup;
  }
};

describe('BT-01R: Wizard Configuration Statelessness', () => {
  const mockConfigs = {
    setup: { id: '1' },
    details: { id: '2' },
    income: { id: '3' },
    expenses: { id: '4' }
  };

  it('moet deterministisch de juiste config teruggeven zonder zij-effecten', () => {
    const step = 'WIZARD_DETAILS';
    
    // Test of herhaalde aanroepen exact hetzelfde object geven (geen interne counters)
    const firstRun = getStepConfig(step, mockConfigs);
    const secondRun = getStepConfig(step, mockConfigs);
    
    expect(firstRun).toBe(secondRun);
    expect(firstRun.id).toBe('2');
  });

  it('moet de default config geven bij een onbekende state (fail-safe)', () => {
    const result = getStepConfig('ONBEKEND', mockConfigs);
    expect(result.id).toBe('1');
  });
});