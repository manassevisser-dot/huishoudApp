/**
 * @file_intent Biedt een robuuste, pure functie voor het parsen van ruwe CSV-tekst naar een gestructureerde array van JSON-objecten. Het is ontworpen om flexibel te zijn door automatisch het scheidingsteken (komma, puntkomma, of tab) te detecteren en edge-cases zoals lege input en byte order marks (BOM) correct af te handelen.
 * @repo_architecture Utils Layer - Data Parser. Dit is een op zichzelf staande utility die geen afhankelijkheden heeft met andere lagen van de applicatie zoals `core` of `ui`. Het kan overal worden gebruikt waar CSV-data verwerkt moet worden.
 * @term_definition
 *   - `CSV (Comma-Separated Values)`: Een tekstformaat om tabel-data op te slaan, waarbij waarden worden gescheiden door een scheidingsteken.
 *   - `Delimiter`: Het teken dat wordt gebruikt om waarden in een CSV-bestand te scheiden (bijv. ',', ';', of '\t'). Deze parser detecteert dit automatisch.
 *   - `Byte Order Mark (BOM)`: Een speciaal onzichtbaar teken (`\uFEFF`) aan het begin van sommige tekstbestanden. Deze parser verwijdert dit teken om parse-fouten te voorkomen.
 *   - `Header Row`: De eerste regel van de CSV, die de kolomnamen (en dus de keys van het uiteindelijke JSON-object) bevat.
 *   - `Pure Function`: Een functie die, gegeven dezelfde input, altijd dezelfde output produceert en geen externe state of side-effects heeft. `parseRawCsv` is een pure functie.
 * @contract De `parseRawCsv`-functie accepteert een enkele string `text` als input. Het retourneert een array van objecten (`Record<string, string>[]`), waarbij elke key overeenkomt met een header-kolom en elke value een string is. Als de input-tekst leeg is of minder dan twee regels bevat (geen data), retourneert het een lege array.
 * @ai_instruction Gebruik de `parseRawCsv`-functie om data uit CSV-bestanden te verwerken. Je hoeft het scheidingsteken niet van tevoren te specificeren. De functie zorgt voor het opschonen van de data. De output is direct bruikbaar voor verdere data-manipulatie of weergave. De functie heeft geen externe afhankelijkheden en kan veilig overal in de codebase worden aangeroepen.
 */
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