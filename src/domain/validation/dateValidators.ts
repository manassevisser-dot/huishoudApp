import { isoDateOnlyToLocalNoon, todayLocalNoon } from '@domain/helpers/DateHydrator';

export function isValidBirthDate(iso: string): boolean {
  const birthDate = isoDateOnlyToLocalNoon(iso);
  if (!birthDate) return false;
  const today = todayLocalNoon();
  const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
  const maxDate = today;
  return birthDate >= minDate && birthDate <= maxDate;
}

/** Controleert of een string een plausibele datum bevat (DDMMYYYY, DD-MM-YYYY of ISO). */
export function isDigitsDatePlausible(input: string): boolean {
    if (!input) return false;
  
    let d: number, m: number, y: number;
  
    // 1. Parsing: Probeer de getallen uit de string te halen
    const isoMatch = input.match(/^(\d{4})-(\d{2})-(\d{2})$/); // YYYY-MM-DD
    const nlMatch = input.match(/^(\d{1,2})[-/ ]?(\d{1,2})[-/ ]?(\d{4})$/); // D-M-YYYY
    const eightDigitMatch = input.match(/^(\d{2})(\d{2})(\d{4})$/); // DDMMYYYY
  
    if (isoMatch) {
      // ISO: group 1=Jaar, 2=Maand, 3=Dag
      y = parseInt(isoMatch[1], 10);
      m = parseInt(isoMatch[2], 10);
      d = parseInt(isoMatch[3], 10);
    } else if (eightDigitMatch) {
      // 8 Cijfers: group 1=Dag, 2=Maand, 3=Jaar
      d = parseInt(eightDigitMatch[1], 10);
      m = parseInt(eightDigitMatch[2], 10);
      y = parseInt(eightDigitMatch[3], 10);
    } else if (nlMatch) {
      // NL: group 1=Dag, 2=Maand, 3=Jaar
      d = parseInt(nlMatch[1], 10);
      m = parseInt(nlMatch[2], 10);
      y = parseInt(nlMatch[3], 10);
    } else {
      // Geen geldig formaat herkend
      return false;
    }
  
    // 2. Logische Validatie
    
    // A. Harde grenzen
    if (y < 1900) return false;       // Niet voor 1900
    if (m < 1 || m > 12) return false; // Maand moet 1-12 zijn
    if (d < 1 || d > 31) return false; // Dag moet 1-31 zijn
  
    // B. Kalender validatie & Toekomst check
    const dateObj = new Date(y, m - 1, d); // Let op: maand is 0-based in JS
    const now = new Date();
    now.setHours(0, 0, 0, 0); // Zet tijd op middernacht voor eerlijke vergelijking
  
    // Ligt de datum in de toekomst?
    if (dateObj > now) return false;
  
    // Bestaat de datum echt? (Voorkomt 30 februari of 31 april)
    // Als JS de maand heeft doorgeschoven (bijv. 31 april -> 1 mei), is de maand veranderd.
    if (dateObj.getMonth() !== m - 1) return false;
    
    // Extra check: klopt de dag nog? (Soms schuift JS ver door)
    if (dateObj.getDate() !== d) return false;
  
    return true;
  }



export function isFutureDate(iso: string): boolean {
  const date = isoDateOnlyToLocalNoon(iso);
  if (!date) return false;
  return date > todayLocalNoon();
}

