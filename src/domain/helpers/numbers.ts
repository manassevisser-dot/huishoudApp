/**
 * @file_intent Biedt een set zeer robuuste functies voor het parsen en formatteren van numerieke (valuta)waarden. De kernstrategie is om alle financiële waarden te converteren naar en te werken met integers van centen om floating-point onnauwkeurigheden te elimineren.
 * @repo_architecture Domain Layer - Helpers.
 * @term_definition
 *   - `Cents (Integer)`: De fundamentele eenheid voor alle financiële berekeningen in het domein. Door valuta als een integer van centen te representeren (bv. €12,34 wordt `1234`), worden problemen met zwevendekommagetallen vermeden.
 *   - `Parsing / Normalization`: Het proces van het omzetten van een gebruikersinvoer (string), die verschillende formaten kan hebben (bv. "1.234,56", "1234.56", "€ 1.234"), naar een schone, gestandaardiseerde numerieke waarde (de integer van centen).
 * @contract Dit bestand exporteert cruciale functies: `toCents` (de "Phoenix Parser") die diverse string- en getalinvoeren omzet naar een integer van centen, en `formatCentsToDutch`/`formatCurrency` die een integer van centen formatteren naar een leesbare string voor de UI. De logica is ontworpen om tolerant te zijn voor verschillende duizendtal- en decimaalscheiders.
 * @ai_instruction Gebruik `toCents` als de *enige* manier om externe numerieke/valuta-invoer het domein binnen te brengen. Alle interne domeinlogica, berekeningen en state management moeten uitsluitend opereren op de integer-waarden van centen die door `toCents` worden geproduceerd. Gebruik de `format*` functies alleen in de UI-laag of bij het presenteren van data aan de gebruiker.
 */

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