// src/utils/date.ts

/**
 * Parse DD-MM-YYYY string naar ISO-YYYY-MM-DD
 */
export function parseDDMMYYYYtoISO(input: string): string | null {
  const match = input.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  const day = Number(dd);
  const month = Number(mm);
  const year = Number(yyyy);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return null; // invalid date
  }
  return formatDateISO(date);
}

/**
 * Format date object of ISO string naar verschillende weergaven
 * 'dd-mm-yyyy' | 'weekday' | 'short' | 'full'
 */
export function formatDate(input: Date | string, formatType: 'dd-mm-yyyy' | 'weekday' | 'short' | 'full' = 'dd-mm-yyyy'): string {
  const date = typeof input === 'string' ? new Date(input) : input;
  const options: Intl.DateTimeFormatOptions = {};
  
  switch (formatType) {
    case 'dd-mm-yyyy': {
      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const yyyy = date.getFullYear();
      return `${dd}-${mm}-${yyyy}`;
    }
    case 'weekday': {
      options.weekday = 'short';
      return date.toLocaleDateString('nl-NL', options);
    }
    case 'short': {
      options.day = 'numeric';
      options.month = 'short';
      options.year = '2-digit';
      return date.toLocaleDateString('nl-NL', options);
    }
    case 'full': {
      options.weekday = 'long';
      options.day = 'numeric';
      options.month = 'long';
      options.year = 'numeric';
      return date.toLocaleDateString('nl-NL', options);
    }
    default:
      return date.toLocaleDateString('nl-NL');
  }
}

/**
 * Bereken leeftijd op basis van ISO string
 */
export function calculateAge(isoDate: string): number | null {
  const birth = new Date(isoDate);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

// Bestaande functies blijven ongewijzigd
export function formatDateISO(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getCurrentDateISO(): string {
  return formatDateISO(new Date());
}

export function getISOWeek(date: Date): number {
  const d = new Date(date.getTime());
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return weekNo;
}



export function isDigitsDatePlausible(digits: string): boolean {
  if (digits.length !== 8) return false;
  const dd = Number(digits.slice(0, 2));
  const mm = Number(digits.slice(2, 4));
  const yyyy = Number(digits.slice(4, 8));
  if (!Number.isInteger(dd) || !Number.isInteger(mm) || !Number.isInteger(yyyy)) return false;
  if (dd < 1 || dd > 31) return false;
  if (mm < 1 || mm > 12) return false;
  if (yyyy < 1900 || yyyy > 2099) return false;
  return true;
}

// === Grenzen t.o.v. vandaag (UTC-noon) voor DOB ===

/** Vandaag op 12:00 UTC (noon), om TZ-dagverschuivingen te voorkomen. */
export function todayUtcNoon(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0));
}

/** YYYY-MM-DD uit een UTC Date (zonder tijdcomponenten). */
export function toISOFromUTC(dateUtc: Date): string {
  const y = dateUtc.getUTCFullYear();
  const m = String(dateUtc.getUTCMonth() + 1).padStart(2, '0');
  const d = String(dateUtc.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/** Max DOB voor VOLWASSENE: vandaag - 18 jaar. */
export function getAdultMaxISO(base?: Date): string {
  const baseUtc = base ?? todayUtcNoon();
  const d = new Date(baseUtc);
  d.setUTCFullYear(d.getUTCFullYear() - 18);
  return toISOFromUTC(d);
}

/** Min DOB voor KIND: (vandaag - 18 jaar) + 1 dag (voorkomt exact 18). */
export function getChildMinISO(base?: Date): string {
  const baseUtc = base ?? todayUtcNoon();
  const d = new Date(baseUtc);
  d.setUTCFullYear(d.getUTCFullYear() - 18);
  d.setUTCDate(d.getUTCDate() + 1);
  return toISOFromUTC(d);
}

/** Max DOB voor KIND: vandaag (UTC-noon). */
export function getChildMaxISO(base?: Date): string {
  return toISOFromUTC(base ?? todayUtcNoon());
}
