import { it, expect, describe } from 'vitest';
import { validateField } from '@domain/validation/fieldValidator';

describe('BT-02-validation-smoke-v2', () => {
  const scenarios = [
    { value: "", label: "Lege invoer" },
    { value: null, label: "Null waarde" },
    { value: 10, label: "Geldig getal" },
    { value: -1, label: "Te laag getal" },
    { value: "not-a-number", label: "Foutieve string" }
  ];

  const fields = [
    { id: "aantalMensen", path: "data.setup.aantalMensen" },
    { id: "aantalVolwassen", path: "data.setup.aantalVolwassen" },
    { id: "autoCount", path: "data.setup.autoCount" }
  ];

  it('genereert de nieuwe waarheid voor de audit', () => {
    const auditLog = fields.flatMap(field => 
      scenarios.map(scenario => ({
        fieldId: field.id,
        scenario: scenario.label,
        inputValue: scenario.value,
        // De nieuwe validator geeft een array van strings terug
        errors: validateField(field.path, scenario.value)
      }))
    );

    expect(auditLog).toMatchSnapshot();
  });
});