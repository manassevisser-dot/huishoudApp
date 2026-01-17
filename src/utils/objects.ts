// src/utils/objects.ts

/**
 * Deep merge utility voor productie en test.
 * Objecten worden recursief samengevoegd, arrays worden overschreven.
 */
export function deepMerge<T extends object>(target: T, source?: any): T {
  const out: any = Array.isArray(target) ? [...(target as any)] : { ...target };
  if (!source) return out as T;

  for (const [key, srcVal] of Object.entries(source)) {
    const tgtVal = (out as any)[key];
    const isObj = (val: unknown) => val && typeof val === 'object' && !Array.isArray(val);

    if (isObj(srcVal) && isObj(tgtVal)) {
      (out as any)[key] = deepMerge(tgtVal, srcVal as any);
    } else {
      (out as any)[key] = srcVal as any;
    }
  }
  return out as T;
}
