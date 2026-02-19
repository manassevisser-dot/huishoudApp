// src/ui/styles/UiPrimitiveStyles.ts
//
// UI-compositie (sibling/layout) — géén semantiek/policy hier.
/**
* TODO: 
* Imports updaten
* Waar je layout nodig had (chips/radio groepen), importeer je voortaan:
* import { UiPrimitiveStyles } from '@ui/styles/UiPrimitiveStyles';
*
* Waar je regels nodig had (error/labels/typografie/knoppen), gebruik je:
* import { PrimitiveStyleFactory } from '@domain/styles/PrimitiveStyleFactory';
*/
/**
 * UI PRIMITIVE STYLES — COMPOSITIE
 * - Layout/sibling-structuur (row, wrap, gap) voor groepen
 * - GEEN semantische policy/kleurenbeslissingen
 */

import { Tokens } from '@domain/constants/Tokens';
import type { PrimitiveStyleRule } from '@domain/registry/PrimitiveRegistry';

export const UiPrimitiveStyles = {
  getChipContainerStyle(): PrimitiveStyleRule {
    return {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: Tokens.Space.sm,
    };
  },

  getRadioContainerStyle(): PrimitiveStyleRule {
    return {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: Tokens.Space.sm,
    };
  },
};