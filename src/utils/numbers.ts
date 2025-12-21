/**
 * Alleen numerieke helpers (geen string/emoji opschoning)
 */

export const onlyDigits = (val: string): string => val.replace(/\D/g, '');

export const onlyDigitsDotsComma = (val: string): string => val.replace(/[^0-9.,]/g, '');

export const formatCurrency = (amount: number | string): string => {
  const num = typeof amount === 'string' ? parseFloat(amount.replace(',', '.')) : amount;
  if (isNaN(num)) return '€ 0,00';
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(num);
};

/**
 * parseToCents: Zet een bedrag (string of number) om naar centen (integer).
 * Voorkomt floating point fouten door af te ronden.
 */
export const parseToCents = (value: string | number): number => {
  if (typeof value === 'number') return Math.round(value * 100);
  const normalized = value.replace(',', '.');
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? 0 : Math.round(parsed * 100);
};
