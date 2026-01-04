import { FieldConfig } from '@shared-types/form';
import { formatDutchValue } from '@utils/numbers';
import { isDigitsDatePlausible, parseDDMMYYYYtoISO } from '@utils/date';

export const validateField = (field: FieldConfig, value: any, state: any): string | null => {
  if (field.required && (value === undefined || value === null || value === '')) {
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
    if (field.validation?.postcode && typeof value === 'string' && !/^\d{4}$/.test(value.trim())) {
      return 'Ongeldige postcode (formaat: 4 cijfers, bijv. 1234).';
    }
  }


  if (Array.isArray(value) && field.validation?.lengthEqualsTo) {
    // We halen de path-string uit lengthEqualsTo (indien het een string is)
    const path = String(field.validation.lengthEqualsTo);
    const [tPage, tField] = path.split('.');
  
    // Veilig de state uitlezen
    const expected = Number(state?.[tPage]?.[tField] ?? 0);
    
    if (value.length !== expected) {
      return `Aantal leden (${value.length}) moet gelijk zijn aan totaal aantal personen (${expected}).`;
    }
  }


  return null;
};

/**
 * Valideer een NL geboortedatum invoer * Valideer een NL geboortedatum invoer (DD-MM-YYYY of alleen cijfers).
 * @returns null als geldig, anders fouttekst.
 */
export function validateDobNL(input: string): string | null {
  const raw = input ?? '';
  const digits = formatDutchValue(raw);

  if (digits.length < 8) {
    return 'Vul een volledige datum in (DD-MM-YYYY).';
  }
  if (!isDigitsDatePlausible(digits)) {
    return 'Ongeldige datum (dag/maand/jaar niet plausibel).';
  }

  // Zet cijfers om naar NL weergave en parse om echte kalender-validatie te doen
  const display = `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4, 8)}`;
  const iso = parseDDMMYYYYtoISO(display);
  if (!iso) {
    return 'Ongeldige datum (bestaat niet in kalender).';
  }
  return null; // geldig
}
