// 1. Herstel de import naar de juiste folder (validation ipv rules)
import { validateField } from '../../validation/fieldValidator';
import { createMockState } from '../../../test-utils/factories/stateFactory';

// 2. Importeer de SPECIFIEKE naam uit de config
import { setupHouseholdConfig } from '../../../ui/screens/Wizard/pages/1setupHousehold.config';

describe('BT-02 Baseline: Field Validation Integrity', () => {
  const mockState = createMockState();
  
  // Gebruik de fields uit de correcte variabele
  const fields = setupHouseholdConfig.fields || [];

  const scenarios = [
    { label: 'Lege invoer', value: '' },
    { label: 'Null waarde', value: null },
    { label: 'Geldig getal', value: 10 },
    { label: 'Te laag getal', value: -1 },
    { label: 'Foutieve string', value: 'not-a-number' }
  ];

  test('Snapshot: Setup Wizard Validation', () => {
    // Fail-safe check
    expect(fields.length).toBeGreaterThan(0);

    fields.forEach((fieldConfig) => {
      scenarios.forEach(scenario => {
        // We sturen de data bucket mee zoals de factory die bouwt
        const result = validateField(fieldConfig as any, scenario.value, mockState.data);

        expect({
          fieldId: (fieldConfig as any).fieldId,
          scenario: scenario.label,
          inputValue: scenario.value,
          error: result
        }).toMatchSnapshot();
      });
    });
  });
});