// WAI-004A — NumericParser & NL-formatters (non-negative)
// -------------------------------------------------------
import { cleanName } from './strings';

/**
 * Tijdens typen: sta alleen cijfers, komma en punt toe.
 * Gebruikt cleanName voor emoji-stripping en limitering.
 * Verwijdert ook '-' conform de non-negative policy.
 */
export function formatDutchValue(raw: string): string {
  return cleanName(String(raw ?? ''), 256)
    .replace(/\s+/g, '')
    .replace(/-/g, '') // minus altijd weg
    .replace(/[^0-9,.]/g, ''); // alleen [0-9], ',' en '.'
}

/**
 * NL-parser: string/number → cents (integer, altijd ≥ 0).
 * Elimineert floating-point errors via integers.
 */
export function parseToCents(input: string | number): number {
  if (typeof input === 'number') {
    return Math.round(Math.abs(input) * 100);
  }
  if (!input) return 0;

  let s = formatDutchValue(input);
  s = s.replace(/\./g, ''); // duizendtallen weg

  const lastComma = s.lastIndexOf(',');
  if (lastComma >= 0) {
    s = s.slice(0, lastComma).replace(/,/g, '') + '.' + s.slice(lastComma + 1).replace(/,/g, '');
  } else {
    s = s.replace(/,/g, '');
  }

  const val = parseFloat(s);
  if (isNaN(val)) return 0;

  return Math.max(0, Math.round(val * 100));
}

/**
 * Formatter: cents → "1.250,50" (zonder €), altijd 2 decimalen.
 */
export function formatCentsToDutch(cents: number): string {
  const euros = (Number.isFinite(cents) ? cents : 0) / 100;
  return new Intl.NumberFormat('nl-NL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(euros);
}
// src/utils/numbers.ts

/**
 * Centen-gebaseerde berekeningen om afrondingsfouten te voorkomen (WAI-004)
 */
export const toCents = (amount: number): number => Math.round(amount * 100);

export const fromCents = (cents: number): string => (cents / 100).toFixed(2);

export const parseNumber = (input: string): number => {
    const cleanInput = input.replace(',', '.');
    return Math.max(0, parseFloat(cleanInput) || 0); // Non-negative parser (WAI-006D)
};
/**
 * Read-only currency formatter (met €).
 * Niet gebruiken in input-context.
 */
export function formatCurrency(amountCents: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(amountCents / 100);
}
