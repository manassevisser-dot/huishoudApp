
// src/utils/date.ts

/**
 * ===========================================
 *  Datumhulpen — TZ-robuust met lokale tijdzone
 * ===========================================
 * Richtlijnen:
 * - 'YYYY-MM-DD' ("ISO zonder tijd") wordt NIET via new Date(iso) geparsed,
 *   maar handmatig naar een lokale Date op 12:00 (lokale noon), om
 *   dagverschuivingen (UTC-midnight interpretatie) te voorkomen.
 * - Strings met tijd (bv. '2026-01-02T08:30:00Z') laat je bewust aan Date-API,
 *   omdat ze een expliciete tijdzone/offset dragen.
 */

/* ======================================================================================
 *  Interne helpers voor ISO-datum (YYYY-MM-DD) ↔ lokale Date op 12:00 (noon)
 * ====================================================================================== */

/** Herkent exact 'YYYY-MM-DD'. */
function isIsoDateOnly(input: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(input);
}

/** Geldigheidscheck van een Y/M/D kalenderdatum. */
function isValidYMD(y: number, m: number, d: number): boolean {
  if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) return false;
  const test = new Date(y, m - 1, d, 12, 0, 0, 0); // lokale noon
  return (
    test.getFullYear() === y &&
    test.getMonth() === m - 1 &&
    test.getDate() === d
  );
}

/**
 * Parse 'YYYY-MM-DD' naar een lokale Date op 12:00 (noon).
 * Retourneert null bij ongeldige kalenderdatum.
 */
export function isoDateOnlyToLocalNoon(iso: string): Date | null {
  if (!isIsoDateOnly(iso)) return null;
  const [yy, mm, dd] = iso.split('-').map(Number);
  if (!isValidYMD(yy, mm, dd)) return null;
  return new Date(yy, mm - 1, dd, 12, 0, 0, 0); // lokale noon
}

/**
 * Maak van een lokale Date (waarvan alleen de dag relevant is) een 'YYYY-MM-DD'.
 * Gebruikt locale componenten, dus geen TZ-drift.
 */
export function toISOFromLocal(dateLocal: Date): string {
  const y = dateLocal.getFullYear();
  const m = String(dateLocal.getMonth() + 1).padStart(2, '0');
  const d = String(dateLocal.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/* ======================================================================================
 *  API: Parsen en formatteren
 * ====================================================================================== */

/**
 * Parse DD-MM-YYYY string naar ISO-YYYY-MM-DD.
 * Valideert de kalenderdatum.
 */
export function parseDDMMYYYYtoISO(input: string): string | null {
  const match = input.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (!match) return null;
  const [, dd, mm, yyyy] = match;
  const day = Number(dd);
  const month = Number(mm);
  const year = Number(yyyy);
  if (!isValidYMD(year, month, day)) return null;
  // We willen een 'YYYY-MM-DD' string terug
  const asLocal = new Date(year, month - 1, day, 12, 0, 0, 0);
  return toISOFromLocal(asLocal);
}

/**
 * Format date object of ISO string naar verschillende weergaven:
 *   'dd-mm-yyyy' | 'weekday' | 'short' | 'full'
 *
 * - 'YYYY-MM-DD' wordt TZ-robuust behandeld via lokale noon.
 * - Strings met tijd laten we bewust aan new Date(...) (heeft al offset/context).
 * - Een Date blijft een Date.
 */
export function formatDate(
  input: Date | string,
  formatType: 'dd-mm-yyyy' | 'weekday' | 'short' | 'full' = 'dd-mm-yyyy',
): string {
  let date: Date;

  if (typeof input === 'string' && isIsoDateOnly(input)) {
    const local = isoDateOnlyToLocalNoon(input);
    if (!local) return ''; // ongeldige string
    date = local;
  } else if (typeof input === 'string') {
    // Date-time string (bv. ISO met tijdzone/offset)
    const d = new Date(input);
    if (isNaN(d.getTime())) return '';
    date = d;
  } else {
    date = input;
  }

  const options: Intl.DateTimeFormatOptions = {};

  switch (formatType) {
    case 'dd-mm-yyyy': {
      // Gebruik lokale componenten voor consistente kalenderweergave
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
 * Berekent leeftijd op basis van ISO string 'YYYY-MM-DD'.
 * Robuust tegen TZ en valideert invoer; geeft null bij ongeldige datum.
 */
export function calculateAge(iso: string): number | null {
  if (typeof iso !== 'string' || !isIsoDateOnly(iso)) return null;
  const d = isoDateOnlyToLocalNoon(iso);
  if (!d) return null;

  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();

  const today = new Date();
  let age = today.getFullYear() - y;

  const mDiff = (today.getMonth() + 1) - m;
  if (mDiff < 0 || (mDiff === 0 && today.getDate() < day)) age--;

  return age;
}

/* ======================================================================================
 *  Bestaande hulpen (ongewijzigde API, maar TZ-bewust waar zinvol)
 * ====================================================================================== */

/** ISO 'YYYY-MM-DD' uit een Date (lokale kalenderdag). */
export function formatDateISO(date: Date): string {
  return toISOFromLocal(date);
}

/** Huidige lokale kalenderdag als 'YYYY-MM-DD'. */
export function getCurrentDateISO(): string {
  return toISOFromLocal(new Date());
}

/**
 * ISO weeknummer (ISO-8601).
 * We rekenen in lokale tijd (standaard JS Date), wat in NL/EU doorgaans gewenst is.
 */
export function getISOWeek(date: Date): number {
  const d = new Date(date.getTime());
  d.setHours(0, 0, 0, 0);
  // donderdag als anker (ISO): 4 - (day||7)
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  const weekNo = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return weekNo;
}

/**
 * Snelle plausibiliteitscheck voor 'DDMMYYYY' strings (zonder separators).
 * Let op: valideert NIET de exacte kalenderdag (bv. 31/02 gaat hier door);
 * gebruik daarna parseDDMMYYYYtoISO voor kalender-validatie.
 */
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

/* ======================================================================================
 *  Grenzen t.o.v. vandaag (LOKALE noon) voor DOB (Age gates)
 * ====================================================================================== */

/** Vandaag op 12:00 lokale tijd (noon), om TZ/DST-dagverschuivingen te voorkomen. */
export function todayLocalNoon(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0);
}

/** YYYY-MM-DD uit een lokale Date (zonder tijdcomponenten). */
export function toISOFromLocalNoon(dateLocalNoon: Date): string {
  return toISOFromLocal(dateLocalNoon);
}

/** Max DOB voor VOLWASSENE: vandaag - 18 jaar (lokale noon). */
export function getAdultMaxISO(base?: Date): string {
  const baseLocal = base ?? todayLocalNoon();
  const d = new Date(baseLocal);
  d.setFullYear(d.getFullYear() - 18);
  return toISOFromLocalNoon(d);
}

/** Min DOB voor KIND: (vandaag - 18 jaar) + 1 dag (voorkomt exact 18). */
export function getChildMinISO(base?: Date): string {
  const baseLocal = base ?? todayLocalNoon();
  const d = new Date(baseLocal);
  d.setFullYear(d.getFullYear() - 18);
  d.setDate(d.getDate() + 1);
  return toISOFromLocalNoon(d);
}

/** Max DOB voor KIND: vandaag (lokale noon). */
export function getChildMaxISO(base?: Date): string {
  return toISOFromLocalNoon(base ?? todayLocalNoon());
}
