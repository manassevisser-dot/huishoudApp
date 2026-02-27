// src/core/types/base.ts

/**
 * Fundamentele JSON-serialisatie types en generieke object-utilities.
 *
 * @module core/types
 * @see {@link ./README.md | Core Types — Details}
 *
 * @remarks
 * Gebruik deze types als veilig alternatief voor `any` bij ongestructureerde input
 * (bijv. AsyncStorage-reads, externe API-responses) vóór parsing naar concrete domein-types.
 */

/** Bladwaarden in een JSON-structuur: alles wat geen object of array is. */
export type JsonPrimitive = string | number | boolean | null;

/**
 * Elke geldige JSON-waarde, inclusief geneste objecten en arrays.
 * Veilig te serialiseren via `JSON.stringify` / `JSON.parse`.
 *
 * @example
 * function parseConfig(raw: JsonValue): AppConfig { ... }
 */
export type JsonValue =
  | JsonPrimitive
  | JsonObject
  | JsonArray;

/** Een JSON-object: string-sleutels met `JsonValue`-waarden. */
export interface JsonObject {
  [key: string]: JsonValue;
}

/** Een JSON-array: geordende lijst van `JsonValue`-elementen. */
export interface JsonArray extends Array<JsonValue> {}

/**
 * Vrij object met `unknown` waarden — voor tijdelijke transformaties
 * waarbij de interne structuur nog niet vaststaat.
 *
 * @remarks
 * Gebruik dit type alleen aan grenzen (bijv. raw reducer-payloads, legacy API-responses).
 * Zo snel mogelijk narrowen naar een concreet type.
 *
 * @example
 * function toSetupData(raw: AnyObject): SetupData {
 *   return SetupSchema.parse(raw);
 * }
 */
export type AnyObject = Record<string, unknown>;
