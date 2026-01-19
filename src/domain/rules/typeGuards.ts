/**
 * Type guards voor visibility engine.
 */

export function isBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean';
  }
  
  export function isEmpty(value: unknown): boolean {
    if (value == null) return true;
    if (typeof value === 'string') return value.trim() === '';
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
  }