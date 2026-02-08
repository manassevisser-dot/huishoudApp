// src/domain/helpers/numbers.ts
import { cleanName } from '@utils/strings';

export function formatDutchValue(raw: string): string {
  return cleanName(String(raw ?? ''), 256)
    .replace(/\s+/g, '')
    .replace(/-/g, '')
    .replace(/[^0-9,.]/g, '');
}

/**
 * Helper voor normalisatie van duizendtal- en decimaalscheiders.
 * Verplaatst complexiteit uit de hoofd-toCents functie.
 */
function normalizeDecimalSeparator(s: string): string {
  const hasComma = s.includes(',');
  const hasDot = s.includes('.');

  if (hasComma && hasDot) {
    return s.indexOf('.') > s.indexOf(',') 
      ? s.replace(/,/g, '') // US
      : s.replace(/\./g, '').replace(/,/g, '.'); // EU
  }

  if (hasComma) {
    return s.replace(/\./g, '').replace(/,/g, '.');
  }

  if (hasDot) {
    const parts = s.split('.');
    if (parts.length === 2 && parts[1].length === 3 && parts[0] !== '0') {
      return parts.join(''); // Duizendtal punt
    }
    if (parts.length > 2) {
      const decimals = parts.pop()!;
      return parts.join('') + '.' + decimals;
    }
  }
  return s;
}

/**
 * DE PHOENIX PARSER: Zet alles om naar centen (integer).
 */
export function toCents(input: string | number | undefined | null): number {
  if (input === undefined || input === null) return 0;

  if (typeof input === 'number') {
    return Math.round(input * 100);
  }

  let s = input.trim().replace(/[€\sA-Za-z]/g, '');
  s = normalizeDecimalSeparator(s);

  const val = parseFloat(s);
  return isNaN(val) ? 0 : Math.round(val * 100);
}

export function formatCentsToDutch(cents: number): string {
  const euros = (Number.isFinite(cents) ? cents : 0) / 100;
  return new Intl.NumberFormat('nl-NL', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(euros);
}

export function formatCurrency(amountCents: number): string {
  // FIX: Expliciete check op 0 of NaN voor strict-boolean-expressions
  const validAmount = Number.isFinite(amountCents) ? amountCents : 0;
  
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(validAmount / 100);
}