import { FormState } from '@shared-types/form';

export const evaluateConditions = (condition: any, state: FormState): boolean => {
  if (!condition || !state) return true;

  const { fieldId, operator, value } = condition;

  // Phoenix 2025 data-lookup:
  // We checken de root, de SETUP bucket en de HOUSEHOLD bucket
  const actualValue =
    (state as any)[fieldId] ??
    (state as any).SETUP?.[fieldId] ??
    (state as any).household?.[fieldId];

  // Zorg dat we niet vergelijken met undefined
  if (actualValue === undefined) return false;

  switch (operator) {
    case 'eq':
      return actualValue === value;
    case 'neq':
      return actualValue !== value;
    case 'gt':
      return Number(actualValue) > Number(value);
    case 'lt':
      return Number(actualValue) < Number(value);
    default:
      return true;
  }
};
