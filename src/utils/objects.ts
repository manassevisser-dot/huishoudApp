/**
 * @file_intent Biedt een set van generieke, herbruikbare utility-functies voor het manipuleren van JavaScript-objecten, met als kern de `deepMerge`-functie. Deze functies zijn ontworpen om robuust, type-veilig en zonder externe afhankelijkheden te zijn.
 * @repo_architecture Utils Layer - Object Manipulation. Dit is een op zichzelf staande utility-module. Het heeft geen kennis van de applicatie-specifieke domeinlogica of UI, en kan in elke laag van de applicatie worden gebruikt waar objectmanipulatie nodig is.
 * @term_definition
 *   - `deepMerge`: Een recursieve functie die twee objecten samenvoegt. In tegenstelling tot een 'shallow merge' (zoals `Object.assign` of `{...a, ...b}`), navigeert deze functie door geneste objecten en voegt hun properties ook samen.
 *   - `Type Guard`: Een functie (zoals `isObject`) die een runtime-check uitvoert en aan de TypeScript-compiler een signaal geeft over het type van een variabele binnen een bepaald bereik.
 *   - `DeepPartial<T>`: Een utility-type dat een bestaand type `T` neemt en alle properties (en die van geneste objecten) optioneel maakt. Dit is handig voor de `source` van een merge, die misschien niet alle properties van de `target` bevat.
 * @contract De `deepMerge<T>`-functie accepteert twee argumenten: `target` (het basisobject) en `source` (het object met de te mergen properties). Het retourneert een *nieuw* object van type `T`. De merge-regels zijn: 1. Geneste objecten worden recursief samengevoegd. 2. Arrays worden *niet* samengevoegd, maar volledig overschreven door de `source`-array. 3. Alle andere waarden (primitives, functies) van de `source` overschrijven die van de `target`. De functie muteert de originele `target`- en `source`-objecten niet.
 * @ai_instruction Gebruik `deepMerge` wanneer je configuratie-objecten of state-updates moet samenvoegen waarbij geneste waarden behouden moeten blijven. Wees je bewust van het feit dat arrays altijd worden vervangen, niet samengevoegd. Gebruik de `isObject` type guard in combinatie met `deepMerge` of in andere scenario's waar je zeker moet weten dat je met een echt object te maken hebt en niet met een array of `null`.
 */
// src/utils/objects.ts

/**
 * Helper type for deep partial objects
 */
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

/**
 * Type guard for objects (not arrays, not null)
 */
const isObject = (val: unknown): val is Record<string, unknown> => 
  val !== null && typeof val === 'object' && !Array.isArray(val);

/**
 * Deep merge utility voor productie en test.
 * Objecten worden recursief samengevoegd, arrays worden overschreven.
 */
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source?: DeepPartial<T>
): T {
  // Explicit null/undefined check (strict-boolean-expressions)
  if (source === null || source === undefined) {
    return { ...target };
  }

  // Handle arrays - overwrite completely
  if (Array.isArray(target)) {
    return (Array.isArray(source) ? [...source] : [...target]) as unknown as T;
  }

  const output: Record<string, unknown> = { ...target };

  for (const key in source) {
    if (!Object.prototype.hasOwnProperty.call(source, key)) continue;

    const sourceValue = source[key];
    const targetValue = output[key];

    if (isObject(sourceValue) && isObject(targetValue)) {
      output[key] = deepMerge(
        targetValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>
      );
    } else {
      output[key] = sourceValue as unknown; 
    }
  }

  return output as T;
}