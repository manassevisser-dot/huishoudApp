/**
 * @file_intent Biedt een set van herbruikbare, defensieve `type guard`-functies. Deze functies zijn de fundering voor het veilig omgaan met data van onbekende types (`unknown`) binnen de domeinlaag. Ze stellen de applicatie in staat om robuust te reageren op variabele, ontbrekende of incorrecte data zonder te crashen.
 * @repo_architecture Domain Layer - Business Rules (Helpers/Utilities).
 * @term_definition
 *   - `Type Guard`: Een functie in TypeScript die een `boolean` retourneert en een `type predicate` heeft (bv. `val is string | number`). Als de functie `true` retourneert, weet de TypeScript-compiler dat de variabele binnen die scope het gespecificeerde type heeft, wat type-veilige operaties mogelijk maakt.
 *   - `Defensive Programming`: Een programmeerstijl die focust op het anticiperen op en correct afhandelen van onverwachte inputs. Deze type guards zijn een kernonderdeel van die strategie.
 *   - `Fail-safe`: De `isNumeric` guard is een goed voorbeeld; het probeert een waarde te interpreteren, maar als dat niet veilig kan, retourneert het `false` in plaats van een `NaN` of een error te produceren.
 * @contract Dit bestand exporteert pure, stand-alone functies zoals `isEmpty` en `isNumeric`.
 *   - `isEmpty`: Controleert of een waarde `null`, `undefined`, een lege string, een leeg array of een leeg object is.
 *   - `isNumeric`: Controleert of een `unknown` waarde veilig kan worden geïnterpreteerd en gebruikt als een eindig getal (`number`), inclusief waarden die als numerieke strings binnenkomen (bv. "67").
 * @ai_instruction Deze `type guards` zijn utility-functies die overal in de **domeinlaag** en door **orchestrators** worden gebruikt. Een orchestrator kan bijvoorbeeld `isNumeric` gebruiken om een waarde uit de ruwe state te valideren voordat deze wordt doorgegeven aan een domeinregel (zoals `isAowEligible`). De domeinregels zelf gebruiken ze ook intern om hun eigen inputs te valideren. Dit zorgt voor een gelaagde verdediging en maakt de business-logica zelf schoner, omdat de logica kan uitgaan van al gevalideerde data. Deze guards zijn essentieel voor de algehele stabiliteit van de applicatie.
 */

/**
 * Un_known is needed in this file
 * Type guards voor visibility engine.
 */

export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true; // Explicieter dan ==
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object' && value !== null) return Object.keys(value).length === 0;
  return false;
}

/**
 * numeric guard: Checks if value can be used in numeric comparisons
 */
export function isNumeric(val: unknown): val is string | number {
  // 1. Check op type number
  if (typeof val === 'number') {
    return Number.isFinite(val); // Modernere check voor finite + !NaN
  }
  
  // 2. Check op type string
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed === '') return false;
    
    const coerced = Number(trimmed);
    return Number.isFinite(coerced);
  }
  
  return false;
}
