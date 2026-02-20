/**
 * @file_intent Implementeert de specifieke Nederlandse juridische business rule voor AOW-gerechtigdheid. Deze regel isoleert een belangrijke, mogelijk veranderlijke, wettelijke constante (`CURRENT_AOW_AGE`) en de logica om deze toe te passen.
 * @repo_architecture Domain Layer - Business Rules.
 * @term_definition
 *   - `AOW (Algemene Ouderdomswet)`: Een Nederlandse wet die het basispensioen voor ouderen regelt.
 *   - `Juridische Kernregel`: Een business rule die direct is afgeleid uit wet- of regelgeving. Deze regels zijn vaak onderhevig aan verandering door de overheid.
 *   - `Fail-closed`: Een veiligheidsprincipe waarbij een functie in geval van ongeldige of onverwachte input een "negatief" of "veilig" resultaat retourneert (in dit geval `false`), in plaats van een fout te genereren of een onjuist positief resultaat te geven.
 * @contract Dit bestand exporteert de constante `CURRENT_AOW_AGE` en de functie `isAowEligible`. De functie accepteert een `unknown` type, controleert robuust of de input een getal of een numerieke string is, en retourneert `true` als de leeftijd gelijk aan of hoger is dan de AOW-leeftijd, anders `false`.
 * @ai_instruction De `isAowEligible` functie wordt aangeroepen door een **orchestrator** om te bepalen of een persoon AOW-gerechtigd is. De orchestrator haalt de leeftijd van een persoon uit de state, roept deze domeinfunctie aan, en gebruikt het `boolean` resultaat om de UI-staat te bepalen (bv. het tonen of verbergen van AOW-gerelateerde informatie). Door de `CURRENT_AOW_AGE` als constante te exporteren, kan deze logica centraal beheerd en eenvoudig aangepast worden bij wetswijzigingen, terwijl de orchestrator en de UI ongewijzigd blijven.
 */

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
