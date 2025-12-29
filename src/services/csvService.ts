import logger from '@services/logger';
// src/services/csvService.ts

// Helper: valideer Date
const isValidDate = (d: Date) => !Number.isNaN(d.getTime());

export type CsvRow = {
  date?: string;
  amount?: number;
  note?: string;
};

export const csvService = {
  /**
   * Parse CSV text met flexibele kolomdetectie
   * Headers: date/datum, amount/bedrag, note/notitie
   * - Normaliseert amount (geen NaN doorlaten)
   */
  parse(text: string): CsvRow[] {
    const trimmed: string = text.trim();
    if (!trimmed) return [];

    const lines: string[] = trimmed.split('\n');
    if (lines.length < 2) return [];

    const headers: string[] = lines[0]
      .toLowerCase()
      .split(',')
      .map((h: string) => h.trim());
    const dateCol: number = headers.findIndex((h: string) => h === 'date' || h === 'datum');
    const amountCol: number = headers.findIndex((h: string) => h === 'amount' || h === 'bedrag');
    const noteCol: number = headers.findIndex((h: string) => h === 'note' || h === 'notitie');

    if (dateCol === -1 || amountCol === -1) {
      throw new Error('CSV moet minimaal date/datum en amount/bedrag kolommen bevatten');
    }

    const rows: CsvRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cols: string[] = lines[i].split(',').map((c: string) => c.trim());
      if (cols.length < 2) continue;

      // Amount veilig parsen
      let amt: number | undefined = undefined;
      if (amountCol >= 0) {
        const rawAmount: string = cols[amountCol];
        const num: number = parseFloat(rawAmount);
        if (!Number.isNaN(num)) {
          amt = num;
        } else if (__DEV__) {
          logger.warn(`[CSV Parse] Ongeldig bedrag op regel ${i + 1}: ${rawAmount}`);
        }
      }

      rows.push({
        date: dateCol >= 0 ? cols[dateCol] : undefined,
        amount: amt,
        note: noteCol >= 0 ? cols[noteCol] : undefined,
      });
    }

    return rows;
  },

  /**
   * Valideer: geldige datums moeten binnen 62 dagen liggen
   * - Rijen zonder   * - Rijen zonder geldige datum negeren
   * - Geen enkele geldige datum → false
   */
  validateRange(rows: CsvRow[]): boolean {
    if (rows.length === 0) return true;

    // Verzamel eerst geldige date-strings
    const dateStrings: string[] = rows
      .map((r: CsvRow) => r.date)
      .filter((s: string | undefined): s is string => typeof s === 'string');

    if (dateStrings.length === 0) return false;

    // Converteer naar Date en filter op geldige datums
    const dates: Date[] = dateStrings
      .map((s: string) => new Date(s))
      .filter((d: Date) => isValidDate(d));

    if (dates.length === 0) return false;

    const minDate = new Date(Math.min(...dates.map((d: Date) => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map((d: Date) => d.getTime())));
    const diffDays = (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);

    return diffDays <= 62;
  },

  /**
   * Mock n8n webhook POST
   * - Dev sanity-check
   * - Try/catch voor voorspelbaar gedrag
   */
  async postToN8N(payload: any): Promise<void> {
    try {
      if (__DEV__ && (typeof payload !== 'object' || payload == null)) {
        logger.warn('[CSV Upload] Invalid payload for mock upload:', payload);
      }
      // Simuleer netwerklatency
      await new Promise((resolve) => setTimeout(resolve, 800));
    } catch (e) {
      if (__DEV__) logger.warn('[CSV Upload] Mock upload failed (unexpected):', e);
    }
  },
};
