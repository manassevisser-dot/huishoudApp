import { validateField } from '../../validation/fieldValidator';
import { createMockState } from '../../../test-utils/factories/stateFactory';
import { setupHouseholdConfig } from '../../../ui/screens/Wizard/pages/1setupHousehold.config';

describe('BT-02 Baseline: Field Validation Integrity', () => {
  const mockState = createMockState();
  
  // Gebruik de fields uit de officiële wizard config
  const fields = setupHouseholdConfig.fields || [];

  const scenarios = [
    { label: 'Lege invoer', value: '' },
    { label: 'Null waarde', value: null },
    { label: 'Geldig getal', value: 10 },
    { label: 'Te laag getal', value: -1 },
    { label: 'Foutieve string', value: 'not-a-number' }
  ];

  test('Snapshot: Setup Wizard Validation', () => {
    // Fail-safe check conform Phoenix standaarden
    expect(fields.length).toBeGreaterThan(0);

    fields.forEach((fieldConfig) => {
      scenarios.forEach(scenario => {
        /** * FIX (SVZ-2-Q): We geven fieldConfig.fieldId (string) mee 
         * in plaats van het gehele object om path.split crashes te voorkomen.
         */
        const result = validateField(fieldConfig.fieldId, scenario.value, mockState.data);

        expect({
          fieldId: fieldConfig.fieldId,
          scenario: scenario.label,
          inputValue: scenario.value,
          error: result
        }).toMatchSnapshot();
      });
    });
  });
});