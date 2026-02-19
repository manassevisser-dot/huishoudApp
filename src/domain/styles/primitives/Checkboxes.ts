// src/domain/styles/modules/Checkboxes.ts
import { Sizes } from '@domain/constants/Tokens';
import type { ColorScheme } from '@domain/constants/Colors';

export function makeCheckboxes(c: ColorScheme) {
  return {
    checkbox: {
      width: Sizes.checkbox,
      height: Sizes.checkbox,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: c.border,
      backgroundColor: c.surface,
    },
    checkboxSelected: {
      borderColor: c.primary,
      backgroundColor: c.primary,
    },
  } as const;
}

export type CheckboxStyles = ReturnType<typeof makeCheckboxes>;