/**
 * Format date object of ISO string naar verschillende weergaven:
 * 'dd-mm-yyyy' | 'weekday' | 'short' | 'full'
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
    if (typeof input === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input)) {
      // Parseer ISO-dagstring TZ-robuust
      const [yy, mm, dd] = input.split('-').map(Number);
      const test = new Date(yy, mm - 1, dd, 12, 0, 0, 0);
      if (test.getFullYear() !== yy || test.getMonth() !== mm - 1 || test.getDate() !== dd) return '';
      date = test;
    } else if (typeof input === 'string') {
      const d = new Date(input);
      if (isNaN(d.getTime())) return '';
      date = d;
    } else {
      date = input;
    }
    if (!date || isNaN(date.getTime())) {
      return '';
    }
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

  /** Formateert Date of ISO naar YYYY-MM-DD. */
export function formatDateISO(input: Date | string): string {
    let date: Date;
    if (typeof input === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input)) {
      const [yy, mm, dd] = input.split('-').map(Number);
      const test = new Date(yy, mm - 1, dd, 12, 0, 0, 0);
      if (test.getFullYear() !== yy || test.getMonth() !== mm - 1 || test.getDate() !== dd) return '';
      date = test;
    } else if (typeof input === 'string') {
      const d = new Date(input);
      if (isNaN(d.getTime())) return '';
      date = d;
    } else {
      date = input;
    }
    if (!date || isNaN(date.getTime())) return '';
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }