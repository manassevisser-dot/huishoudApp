
 /**
  * JURIDISCHE KERNREGEL 2026:
  * Iedereen die 67 jaar of ouder is, is AOW-gerechtigd.
  *
  * Let op: leeftijd kan uit passthrough-state als string binnenkomen.
  * We normaliseren daarom veilig met TypeGuards.
  */
 import { isNumeric } from '../rules/typeGuards';
 
 export const CURRENT_AOW_AGE = 67;
 
 /**
  * Bepaalt of iemand AOW-gerechtigd is op basis van leeftijd.
  * - Staat numeric strings toe ("68" -> 68).
  * - Non-numeric of lege waarden geven false terug (fail-closed).
  */
 export function isAowEligible(ageOrUnknown: unknown): boolean {
   if (!isNumeric(ageOrUnknown)) {
     return false;
   }
   const age = Number(ageOrUnknown);
   return age >= CURRENT_AOW_AGE;
 }
