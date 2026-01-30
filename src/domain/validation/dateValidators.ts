import { isoDateOnlyToLocalNoon, todayLocalNoon } from '@domain/helpers/DateHydrator';

/**
 * Controleert of een ISO string een bestaande datum is die niet in de toekomst ligt.
 */
export function isValidDateStr(iso: string): boolean {
  const date = isoDateOnlyToLocalNoon(iso);
  // ESLint fix: expliciete null check ipv !date
  if (date === null) {
    return false;
  }
  
  const today = todayLocalNoon();
  return date <= today;
}

/**
 * Technische plausibiliteitscheck voor handmatige invoer.
 * STRIKT: Alleen DD-MM-YYYY of DDMMYYYY.
 * Dit zorgt dat de test 'faalt voor niet-DD-MM-YYYY patronen' slaagt.
 */
export function isDigitsDatePlausible(input: string): boolean {
  // ESLint fix: expliciete empty string check
  if (input === '') {
    return false;
  }

  const nlMatch = input.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  const eightDigitMatch = input.match(/^(\d{2})(\d{2})(\d{4})$/);

  const match = nlMatch !== null ? nlMatch : eightDigitMatch;
  if (match === null) {
    return false;
  }

  const d = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const y = parseInt(match[3], 10);

  const dateObj = new Date(y, m - 1, d);
  
  // Kalender-check: voorkom dat 31-02-2024 geldig is
  const exists = dateObj.getFullYear() === y && 
                 dateObj.getMonth() === m - 1 && 
                 dateObj.getDate() === d;

  return exists && y >= 1900 && dateObj <= new Date();
}

/**
 * Check of de datum in de toekomst ligt.
 */
export function isFutureDate(iso: string): boolean {
  const date = isoDateOnlyToLocalNoon(iso);
  if (date === null) {
    return false;
  }
  return date > todayLocalNoon();
}