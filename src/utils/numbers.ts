import { cleanName } from './strings';

/**
 * Tijdens typen: sta alleen cijfers, komma en punt toe.
 * Verwijdert ook '-' conform de non-negative policy.
 */
export function formatDutchValue(raw: string): string {
  return cleanName(String(raw ?? ''), 256)
    .replace(/\s+/g, '')
    .replace(/-/g, '') 
    .replace(/[^0-9,.]/g, ''); 
}

/**
 * DE PHOENIX PARSER: Zet alles (string met komma of getal) om naar centen (integer).
 * Dit is de enige functie die je gebruikt voor invoer naar de state.
 */
export function toCents(input: string | number | undefined | null): number {
  if (typeof input === 'number') {
    return Math.round(Math.abs(input) * 100);
  }
  if (!input) return 0;

  // NL-formaat afhandelen: 1.250,50 -> 1250.50
  let s = formatDutchValue(input).replace(/\./g, ''); // duizendtallen weg
  const lastComma = s.lastIndexOf(',');
  
  if (lastComma >= 0) {
    s = s.slice(0, lastComma).replace(/,/g, '') + '.' + s.slice(lastComma + 1).replace(/,/g, '');
  } else {
    s = s.replace(/,/g, '');
  }

  const val = parseFloat(s);
  return isNaN(val) ? 0 : Math.max(0, Math.round(val * 100));
}

/**
 * Formatter voor INPUT velden (zonder € symbool)
 */
export function formatCentsToDutch(cents: number): string {
  const euros = (Number.isFinite(cents) ? cents : 0) / 100;
  return new Intl.NumberFormat('nl-NL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(euros);
}

/**
 * Formatter voor DISPLAY (met € symbool)
 */
export function formatCurrency(amountCents: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format((amountCents || 0) / 100);
}