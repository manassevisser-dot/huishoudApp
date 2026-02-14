// src/ui/styles/UiComponentStyles.ts
//
// UI-compositie (sibling/layout) — géén semantiek/policy hier.
/**
* TODO: 
* Imports updaten
* Waar je layout nodig had (chips/radio groepen), importeer je voortaan:
* import { UiComponentStyles } from '@ui/styles/UiComponentStyles';
*
* Waar je regels nodig had (error/labels/typografie/knoppen), gebruik je:
* import { ComponentStyleFactory } from '@domain/styles/ComponentStyleFactory';
*/
/**
 * UI COMPONENT STYLES — COMPOSITIE
 * - Layout/sibling-structuur (row, wrap, gap) voor groepen
 * - GEEN semantische policy/kleurenbeslissingen
 */

import { Tokens } from '@domain/constants/Tokens';
import type { ComponentStyleRule } from '@domain/registry/ComponentRegistry';

export const UiComponentStyles = {
  getChipContainerStyle(): ComponentStyleRule {
    return {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: Tokens.Space.sm,
    };
  },

  getRadioContainerStyle(): ComponentStyleRule {
    return {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: Tokens.Space.sm,
    };
  },
};