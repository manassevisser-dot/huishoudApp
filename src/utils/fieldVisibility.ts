// src/ui/utils/fieldVisibility.ts
import type { FieldConfig } from '@shared-types/form';
import type { FormState } from '@shared-types/form';

export function evaluateVisibleIf(visibleIf: FieldConfig['visibleIf'], state: FormState): boolean {
  if (typeof visibleIf === 'function') {
    return visibleIf(state);
  }
  if (typeof visibleIf === 'string') {
    return Boolean((state as any).data?.[visibleIf]);
  }
  return true;
}
