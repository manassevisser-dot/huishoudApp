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
    return (Array.isArray(source) ? [...source] : { ...target }) as unknown as T;
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
      output[key] = sourceValue;
    }
  }

  return output as T;
}