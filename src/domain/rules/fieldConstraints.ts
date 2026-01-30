export type FieldConstraint = {
  type?: 'number' | 'enum';
  min?: number;
  max?: number;
  required?: boolean;
  values?: string[]; // Voor enum type
};

export const FIELD_CONSTRAINTS_REGISTRY: Record<string, FieldConstraint> = {
  aantalMensen: { type: 'number', min: 1, max: 10, required: true },
  aantalVolwassen: { type: 'number', min: 1, max: 10, required: true },
  leeftijd: { type: 'number', min: 0, max: 120, required: true },
  autoCount: { 
    type: 'enum', 
    values: ['Nee', 'Een', 'Twee'], 
    required: true 
  },
  opmerking: {}, // tijdelijk optioneel veld
};

// Check of verplicht veld leeg is
function validateRequired(required: boolean | undefined, value: unknown): string | null {
  if (required === true) {
    const isEmpty = value === null || value === undefined || value === '';
    if (isEmpty) {
      return 'Dit veld is verplicht.';
    }
  }
  return null;
}

// Check numerieke grenzen (alleen als value number is)
function validateNumeric(min: number | undefined, max: number | undefined, value: unknown): string | null {
  if (typeof value !== 'number' || isNaN(value)) {
    return null; // Geen fout voor niet-numerieke waarden
  }

  if (min !== undefined && value < min) {
    return `Waarde moet minimaal ${min} zijn.`;
  }
  if (max !== undefined && value > max) {
    return `Waarde mag maximaal ${max} zijn.`;
  }
  return null;
}

// Check enum waarden
function validateEnum(allowedValues: string[] | undefined, value: unknown): string | null {
  if (allowedValues === undefined) {
    return null;
  }
  
  if (typeof value !== 'string') {
    return 'Waarde moet een tekst zijn.';
  }
  
  if (!allowedValues.includes(value)) {
    return `Ongeldige keuze. Toegestaan: ${allowedValues.join(', ')}.`;
  }
  
  return null;
}

// Domeinfunctie: geeft altijd {isValid, error?}
export function validateField(fieldId: string, value: unknown): { isValid: boolean; error?: string } {
  const rules = FIELD_CONSTRAINTS_REGISTRY[fieldId];

  // Expliciete check op onbekend veld
  if (rules === undefined) {
    return { isValid: true };
  }

  // Verplichte check
  const requiredError = validateRequired(rules.required, value);
  if (requiredError !== null) {
    return { isValid: false, error: requiredError };
  }

  // Type-based validation
  if (rules.type === 'number') {
    const numericError = validateNumeric(rules.min, rules.max, value);
    if (numericError !== null) {
      return { isValid: false, error: numericError };
    }
  }

  if (rules.type === 'enum') {
    const enumError = validateEnum(rules.values, value);
    if (enumError !== null) {
      return { isValid: false, error: enumError };
    }
  }

  return { isValid: true };
}