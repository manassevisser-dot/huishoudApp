/**
 * ===========================================
 * Datumhulpen — TZ-robuust met lokale tijdzone
 * ===========================================
 */

/** Herkent exact 'YYYY-MM-DD'. */
function isIsoDateOnly(input: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.test(input);
  }
  
  /** Geldigheidscheck van een Y/M/D kalenderdatum. */
  function isValidYMD(y: number, m: number, d: number): boolean {
    if (!Number.isInteger(y) || !Number.isInteger(m) || !Number.isInteger(d)) return false;
    const test = new Date(y, m - 1, d, 12, 0, 0, 0); // lokale noon
    return test.getFullYear() === y && test.getMonth() === m - 1 && test.getDate() === d;
  }
  
  /** Parse 'YYYY-MM-DD' naar een lokale Date op 12:00 (noon). */
  export function isoDateOnlyToLocalNoon(iso: string): Date | null {
    if (!isIsoDateOnly(iso)) return null;
    const [yy, mm, dd] = iso.split('-').map(Number);
    if (!isValidYMD(yy, mm, dd)) return null;
    return new Date(yy, mm - 1, dd, 12, 0, 0, 0);
  }
  
  /** YYYY-MM-DD uit een lokale Date (zonder tijdcomponenten). */
  export function toISOFromLocal(dateLocal: Date): string {
    const y = dateLocal.getFullYear();
    const m = String(dateLocal.getMonth() + 1).padStart(2, '0');
    const d = String(dateLocal.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
  
  /** Helper voor consistente benaming conform legacy. */
  export function toISOFromLocalNoon(dateLocalNoon: Date): string {
    return toISOFromLocal(dateLocalNoon);
  }
  
  /** Vandaag op 12:00 lokale tijd. */
  export function todayLocalNoon(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0, 0);
  }
  
  /** * Business Rules: Limits voor orchestratie
   * Gekopieerd uit src/utils/date.ts per WAI-SVZ3
   */
  
  export function getAdultMaxISO(base?: Date): string {
    const baseLocal = base ?? todayLocalNoon();
    const d = new Date(baseLocal);
    d.setFullYear(d.getFullYear() - 18);
    return toISOFromLocalNoon(d);
  }
  
  export function getChildMinISO(base?: Date): string {
    const baseLocal = base ?? todayLocalNoon();
    const d = new Date(baseLocal);
    d.setFullYear(d.getFullYear() - 18);
    d.setDate(d.getDate() + 1);
    return toISOFromLocalNoon(d);
  }
  
  export function getChildMaxISO(base?: Date): string {
    return toISOFromLocalNoon(base ?? todayLocalNoon());
  }

  /** Parseert dd-mm-jjjj naar ISO. */
/** * Parseert dd-mm-jjjj naar ISO (jjjj-mm-dd).
 * Bevat extra robuustheid tegen niet-string input en valideert de kalenderdatum.
 */
export function parseDDMMYYYYtoISO(input: string): string | null {
    // 1. Guard clause: voorkom crashes bij null, undefined of verkeerde types
    if (!input || typeof input !== 'string') {
      return null;
    }
  
    // 2. Regex match voor het formaat
    const match = input.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
    if (!match) {
      return null;
    }
  
    // 3. Destructureer de match (d=dag, m=maand, y=jaar)
    const [, d, m, y] = match;
  
    // 4. Formatteer naar ISO (met padding voor 1-cijferige dagen/maanden)
    const iso = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  
    // 5. Valideer of de datum daadwerkelijk bestaat (bijv. geen 31-02-2024)
    // via de bestaande helper isoDateOnlyToLocalNoon
    return isoDateOnlyToLocalNoon(iso) ? iso : null;
  }
  
  /** Geeft ISO-weeknummer (1-53). */
  export function getISOWeek(date: Date): number {
    const target = new Date(date.valueOf());
    const dayNumber = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNumber + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    const week = 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
    return week;
  }