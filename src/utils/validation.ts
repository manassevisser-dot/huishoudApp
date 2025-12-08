import { FieldConfig } from '../types/form';

export const validateField = (
  field: FieldConfig,
  value: any,
  state: any
): string | null => {
  if (
    field.required &&
    (value === undefined || value === null || value === '')
  ) {
    return 'Dit veld is verplicht.';
  }
  if (field.validation) {
    if (
      field.validation.min !== undefined &&
      typeof value === 'number' &&
      value < field.validation.min
    ) {
      return `Waarde moet minimaal ${field.validation.min} zijn.`;
    }
    if (
      field.validation.max !== undefined &&
      typeof value === 'number' &&
      value > field.validation.max
    ) {
      return `Waarde mag maximaal ${field.validation.max} zijn.`;
    }
    if (
      field.validation.postcode &&
      typeof value === 'string' &&
      !/^\d{4}$/.test(value.trim())
    ) {
      return 'Ongeldige postcode (formaat: 4 cijfers, bijv. 1234).';
    }
  }

  // Cross-page array length validation (declarative)
  if (
    Array.isArray(value) &&
    typeof field.validation?.lengthEqualsTo === 'string'
  ) {
    const [tPage, tField] = field.validation.lengthEqualsTo.split('.');
    const expected = Number(state?.[tPage]?.[tField] ?? 0);
    if (value.length !== expected) {
      return `Aantal leden (${value.length}) moet gelijk zijn aan totaal aantal personen (${expected}).`;
    }
  }

  return null;
};
