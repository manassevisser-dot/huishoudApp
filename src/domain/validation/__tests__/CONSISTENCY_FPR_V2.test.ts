import { it, expect, describe } from 'vitest';
import { validateField } from '../fieldValidator';
import { initialFormState } from '../../../state/schemas/FormStateSchema';

describe('CONSISTENCY-TEST-FPR-V2', () => {
  it('moet bevestigen dat de initialFormState 100% valide is', () => {
    const testCases = [
      { path: 'data.setup.aantalMensen', value: initialFormState.data.setup.aantalMensen },
      { path: 'data.setup.aantalVolwassen', value: initialFormState.data.setup.aantalVolwassen },
      { path: 'data.setup.autoCount', value: initialFormState.data.setup.autoCount }
    ];

    const results = testCases.map(tc => ({
      path: tc.path,
      value: tc.value,
      errors: validateField(tc.path, tc.value)
    }));

    // Check of alles leeg is
    results.forEach(res => {
      expect(res.errors).toHaveLength(0);
    });

    // Leg het resultaat vast voor de audit
    expect(results).toMatchSnapshot();
  });
});