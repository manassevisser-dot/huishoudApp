/**
* Format Date naar ISO-YYYY-MM-DD (alleen datumdeel)
*/
export function formatDateISO(date: Date): string {
return date.toISOString().split('T')[0];
}

/**
 * Huidige datum als ISO-YYYY-MM-DD
 */
export function getCurrentDateISO(): string {
  return formatDateISO(new Date());
}

 /**
  * Get ISO week number for a given date
  * ISO weeks start on Monday and week 1 is the first week with Thursday in it
  */
 export function getISOWeek(date: Date): number {
   const d = new Date(date.getTime());
   d.setHours(0, 0, 0, 0);
   d.setDate(d.getDate() + 4 - (d.getDay() || 7));
   const yearStart = new Date(d.getFullYear(), 0, 1);
   const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
   return weekNo;
 }
