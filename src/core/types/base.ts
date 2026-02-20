// src/core/types/base.ts
/**
 * @file_intent Definieert de fundamentele primitieve types en datastructuren voor veilige JSON-serialisatie en generieke objectmanipulatie binnen de core.
 * @repo_architecture Mobile Industry (MI) - Core Foundation Layer.
 * @term_definition JsonValue = Een recursieve type-definitie die alle geldige JSON-datastructuren omvat. AnyObject = Een flexibele utility type voor objecten waarbij de interne structuur op runtime-niveau nog onbekend is.
 * @contract Waarborgt dat data die door de orchestrators en adapters vloeit, compatibel is met standaard JSON-transfers (bijv. voor opslag in AsyncStorage of API-communicatie). Het dwingt type-safety af bij het parsen van ongestructureerde input naar bekende domeinmodellen.
 * @ai_instruction Gebruik `JsonValue` bij het definiëren van interfaces voor data-opslag en `AnyObject` voor tijdelijke transformaties in managers. Deze types vormen de basis voor de `FormState` en voorkomen het gebruik van het onveilige `any`.
 */
export type JsonPrimitive = string | number | boolean | null;

export type JsonValue = 
  | JsonPrimitive 
  | JsonObject 
  | JsonArray;

export interface JsonObject {
  [key: string]: JsonValue;
}

export interface JsonArray extends Array<JsonValue> {}
export type AnyObject = Record<string, unknown>; 