/**
 * Type guards voor visibility engine.
 */

  export function isEmpty(value: unknown): boolean {
    if (value == null) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  }

  /**
 * numeric guard: Checks if value can be used in numeric comparisons
 * 
 * @pure function - no side effects, deterministic output
 * @param val - Value to check
 * @returns true if value is a valid number or numeric string
 * 
 * Accepts both:
 * - number types (excluding NaN and Infinity)
 * - string types that represent valid numbers
 * 
 * Fail-closed: returns false for undefined/null/non-numeric values
 * 
 * Note: Uses Number() coercion for string validation
 */
export function isNumeric(val: unknown): val is string | number {
  // Handle number type - reject NaN and Infinity
  if (typeof val === 'number') {
    return !isNaN(val) && isFinite(val);
  }
  
  // Handle string type - use Number() coercion
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed === '') return false;
    
    const coerced = Number(trimmed);
    return !isNaN(coerced) && isFinite(coerced);
  }
  
  // Fail-closed: all other types return false
  return false;
}
