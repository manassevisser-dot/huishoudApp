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
 *
 * ADR-03: Centrale transformatie naar centen (integers).
 * Handelt NL formaten (1.250,50), US formaten (1250.50) en rommelige strings af.
 */
export function toCents(input: string | number | undefined | null): number {
  if (input === undefined || input === null) return 0;

  if (typeof input === 'number') {
    // Verwijder Math.abs, behoud Math.round voor floating point correctie
    return Math.round(input * 100);
  }

  // 1) Cleanup basis: verwijder € + spaties + letters (bv. 'EUR')
  let s = input.trim().replace(/[€\sA-Za-z]/g, '');

  const hasComma = s.includes(',');
  const hasDot = s.includes('.');

  // 2) Beide aanwezig? Bepaal welke de decimaal is op volgorde
  if (hasComma && hasDot) {
    const iComma = s.indexOf(',');
    const iDot = s.indexOf('.');

    if (iDot > iComma) {
      // US-stijl: duizendtal=komma, decimaal=punt
      s = s.replace(/,/g, '');
      // punt blijft staan
    } else {
      // EU-stijl: duizendtal=punt, decimaal=komma
      s = s.replace(/\./g, '').replace(/,/g, '.');
    }
  } else if (hasComma) {
    // 3) Alleen komma -> EU-pad: punten weg, komma -> punt
    s = s.replace(/\./g, '').replace(/,/g, '.');
  } else if (hasDot) {
    // 4) Alleen punt -> heuristiek
    const parts = s.split('.');
    if (parts.length === 2) {
      const [left, right] = parts;
      // 'X.YYY' met exact 3 cijfers rechts (en niet '0.XXX') -> duizendtal
      if (/^\d+$/.test(left) && /^\d{3}$/.test(right) && left !== '0') {
        s = left + right; // verwijder punt (duizendtal)
      }
      // anders: laat de enkele punt staan als decimaal
    } else if (parts.length > 2) {
      // meerdere punten -> alleen de laatste blijft decimaal
      const decimals = parts.pop()!;
      s = parts.join('') + '.' + decimals;
    }
  }

  // 5) parse en naar centen
  // Zorg dat de parseFloat aan het einde ook geen Math.abs heeft
  const val = parseFloat(s);
  return isNaN(val) ? 0 : Math.round(val * 100);
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