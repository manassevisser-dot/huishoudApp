/** 
 * csvHelper.ts
 * Universele CSV naar JSON parser.
 * Ondersteunt: Komma (,), Puntkomma (;) en Tabs (\t).
 */
export const parseRawCsv = (text: string): Record<string, string>[] => {
  if (!text) return [];

  // 1. Schoon de tekst op (verwijder Byte Order Marks)
  const cleanText = text.replace(/^\uFEFF/, '').trim();
  const lines = cleanText.split(/\r?\n/); // Werkt voor zowel Windows als Unix line-endings

  if (lines.length < 2) return [];

  // 2. Detecteer de scheider op basis van de eerste regel
  let delimiter = ',';
  if (lines[0].includes('\t')) delimiter = '\t';
  else if (lines[0].includes(';')) delimiter = ';';

  // 3. Extraheer headers
  const headers = lines[0].split(delimiter).map((h) => h.trim().replace(/"/g, ''));

  // 4. Map de rijen naar objecten
  return lines.slice(1).map((line) => {
    const values = line.split(delimiter);
    return headers.reduce(
      (obj, header, i) => {
        // Verwijder eventuele aanhalingstekens rondom waarden
        const val = values[i] ? values[i].trim().replace(/"/g, '') : '';
        obj[header] = val;
        return obj;
      },
      {} as Record<string, string>,
    );
  });
};
