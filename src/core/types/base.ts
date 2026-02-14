/**
 * De absolute basis: JSON-compatibele types.
 * Let op: We gebruiken geen 'object' maar Record of Array.
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

/**
 * AnyObject is de standaard voor 'een verzameling data' in de wizard.
 */
export type AnyObject = Record<string, unknown>; // We gebruiken even any om de cirkel-referentie te breken, we fixen dit in de volgende stap.