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
