/**
 * @file_intent Biedt een verzameling robuuste, timezone-bewuste utility-functies voor het afhandelen en converteren van datums. De focus ligt op het `YYYY-MM-DD` formaat en de lokale tijdzone om `off-by-one` fouten te voorkomen.
 * @repo_architecture Domain Layer - Helpers.
 * @term_definition
 *   - `ISO Date (YYYY-MM-DD)`: Het standaard datumformaat voor data-uitwisseling.
 *   - `Local Noon`: Een `Date` object ingesteld op 12:00 uur in de lokale tijdzone van de gebruiker. Dit is een belangrijke strategie in dit bestand om datumberekeningen betrouwbaar uit te voeren zonder dat tijdzone-verschuivingen de datum veranderen.
 *   - `Date Hydration`: Het proces van het omzetten van een plat dataformaat (zoals een ISO-string) naar een rijk `Date`-object dat gemanipuleerd kan worden.
 * @contract Dit bestand exporteert een reeks pure functies voor datamanipulatie. Belangrijke functies zijn `isoDateOnlyToLocalNoon` voor veilig parsen, `toISOFromLocal` voor serialisatie, `parseDDMMYYYYtoISO` voor het robuust parsen van Nederlandse datumformaten, en `formatToDisplay` voor UI-formattering. Het bevat ook business-specifieke datumberekeningen zoals `getAdultMaxISO`.
 * @ai_instruction Gebruik deze helpers voor alle datum-gerelateerde operaties om consistentie te waarborgen en tijdzone-problemen te voorkomen. De `*LocalNoon` functies zijn cruciaal bij het werken met datums zonder tijdcomponent. Centraliseer nieuwe datumlogica hier. Vermijd het direct gebruiken van de native `new Date(string)` constructor met datum-only strings, omdat het gedrag hiervan inconsistent is tussen omgevingen; gebruik in plaats daarvan `isoDateOnlyToLocalNoon`.
 */

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
  
  /** YYYY-MM-DD uit een lokale Date (zonder tijdsectionen). */
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


/** * Parseert dd-mm-jjjj naar ISO (jjjj-mm-dd).
 * Bevat extra robuustheid tegen niet-string input en valideert de kalenderdatum.
 */
export function parseDDMMYYYYtoISO(input: string): string | null {
  // 1. FIX: Expliciete checks op type en lege string
  if (typeof input !== 'string' || input === '') {
    return null;
  }

  // 2. Regex match
  const match = input.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  
  // 3. FIX: Expliciete null check op de match result
  if (match === null) {
    return null;
  }

  // 4. Destructureer (d=dag, m=maand, y=jaar)
  const [, d, m, y] = match;

  // 5. Formatteer naar ISO
  const iso = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;

  // 6. FIX: Expliciete null check op de return waarde van de helper
  return isoDateOnlyToLocalNoon(iso) !== null ? iso : null;
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
  /** * Formatteert een Date naar een leesbare NL string conform formatType.
 * Verplaatst uit UI-helpers naar Domein voor centrale orchestratie.
 */
  function getFormatOptions(type: string): Intl.DateTimeFormatOptions {
    switch (type) {
      case 'weekday': return { weekday: 'short' };
      case 'short': return { day: 'numeric', month: 'short', year: '2-digit' };
      case 'full': return { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
      default: return {};
    }
  }
  
  /** * Formatteert een Date naar een leesbare NL string conform formatType.
   * Nu linter-proof (< 30 regels).
   */
  export function formatToDisplay(
    date: Date, 
    formatType: 'dd-mm-yyyy' | 'weekday' | 'short' | 'full' = 'dd-mm-yyyy'
  ): string {
    if (isNaN(date.getTime())) return '';
  
    if (formatType === 'dd-mm-yyyy') {
      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const yyyy = date.getFullYear();
      return `${dd}-${mm}-${yyyy}`;
    }
  
    return date.toLocaleDateString('nl-NL', getFormatOptions(formatType));
  }