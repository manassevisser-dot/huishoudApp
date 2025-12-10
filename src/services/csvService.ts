// src/services/csvService.ts

export type CsvRow = {
  date?: string;
  amount?: number;
  note?: string;
};

export const csvService = {
  /**
   * Parse CSV text with flexible column detection
   * Supports headers: date/datum, amount/bedrag, note/notitie
   */
  parse(text: string): CsvRow[] {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];
    
    const headers = lines[0].toLowerCase().split(',').map(h => h.trim());
    const dateCol = headers.findIndex(h => h === 'date' || h === 'datum');
    const amountCol = headers.findIndex(h => h === 'amount' || h === 'bedrag');
    const noteCol = headers.findIndex(h => h === 'note' || h === 'notitie');
    
    if (dateCol === -1 || amountCol === -1) {
      throw new Error('CSV moet minimaal date/datum en amount/bedrag kolommen bevatten');
    }
    
    const rows: CsvRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map(c => c.trim());
      if (cols.length < 2) continue;
      
      rows.push({
        date: dateCol >= 0 ? cols[dateCol] : undefined,
        amount: amountCol >= 0 ? parseFloat(cols[amountCol]) : undefined,
        note: noteCol >= 0 ? cols[noteCol] : undefined,
      });
    }
    
    return rows;
  },
  
  /**
   * Validate date range is within 62 days
   */
  validateRange(rows: CsvRow[]): boolean {
    if (rows.length === 0) return true;
    
    const dates = rows
      .map(r => r.date ? new Date(r.date) : null)
      .filter(d => d !== null) as Date[];
    
    if (dates.length === 0) return false;
    
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
    const diffDays = (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
    
    return diffDays <= 62;
  },
  
  /**
   * Mock n8n webhook POST
   */
  async postToN8N(payload: any): Promise<void> {
    console.log('[CSV Upload] Mock n8n webhook call:', payload);
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log('[CSV Upload] Mock upload complete');
  },
};

