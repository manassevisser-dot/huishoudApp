/** * csvHelper.ts
 * Universele CSV naar JSON parser.
 */

const MIN_LINES_FOR_CSV = 2; // Header + minstens 1 data rij

export const parseRawCsv = (text: string): Record<string, string>[] => {
  // FIX: Expliciete lege string check
  if (text === '') return [];

  // 1. Schoon de tekst op (verwijder Byte Order Marks)
  const cleanText = text.replace(/^\uFEFF/, '').trim();
  const lines = cleanText.split(/\r?\n/);

  // FIX: Magic number vervangen door constante
  if (lines.length < MIN_LINES_FOR_CSV) return [];

  // 2. Detecteer de scheider op basis van de eerste regel
  let delimiter = ',';
  const firstLine = lines[0] ?? ''; // Veilige fallback voor index access
  
  if (firstLine.includes('\t')) {
    delimiter = '\t';
  } else if (firstLine.includes(';')) {
    delimiter = ';';
  }

  // 3. Extraheer headers
  const headers = firstLine.split(delimiter).map((h) => h.trim().replace(/"/g, ''));

  // 4. Map de rijen naar objecten
  return lines.slice(1).map((line) => {
    const values = line.split(delimiter);
    return headers.reduce(
      (obj, header, i) => {
        const rawValue = values[i];
        // FIX: Expliciete check of de waarde bestaat en geen lege string is
        const val = (rawValue !== undefined && rawValue !== '') 
          ? rawValue.trim().replace(/"/g, '') 
          : '';
          
        obj[header] = val;
        return obj;
      },
      {} as Record<string, string>,
    );
  });
};