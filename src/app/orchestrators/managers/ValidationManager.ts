// src/app/orchestrators/managers/ValidationManager.ts
import { validateAtBoundary } from '@adapters/validation/validateAtBoundary';

export class ValidationManager {
  /**
   * De manager is een puur doorgeefluik naar de domein-regels (via de adapter).
   * Hij rekent alleen: waarde + regel = resultaat.
   */
  public validateField(fieldId: string, value: unknown): string | null {
    const result = validateAtBoundary(fieldId, value);
    return result.success ? null : result.error;
  }
}