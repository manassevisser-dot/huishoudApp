// src/domain/styles/ComponentStyleFactory.ts

import { Colors } from '@domain/constants/Colors';

import { Tokens } from '@domain/constants/Tokens';

import { ComponentStyleRule } from '@domain/registry/ComponentRegistry';



export const ComponentStyleFactory = {

  /**

   * Regel voor de standaard veld-container

   */

  getFieldContainer: (hasError: boolean): ComponentStyleRule => ({

    marginBottom: Tokens.Space.md,

    padding: Tokens.Space.sm,

    borderWidth: 1,

    borderColor: hasError ? Colors.light.error : Colors.light.border,

    borderRadius: Tokens.Radius.sm,

    backgroundColor: Colors.light.surface,

  }),



  /**

   * Regel voor labels boven velden

   */

  getLabelStyle: (hasError: boolean): ComponentStyleRule => ({

    fontSize: Tokens.Type.sm, // Correcte key: Type

    color: hasError ? Colors.light.error : Colors.light.textPrimary, // Correcte key: textPrimary

    marginBottom: Tokens.Space.xs,

    fontWeight: '600',

  }),



  /**

   * Regel voor de weergave van foutmeldingen

   */

  getErrorTextStyle: (): ComponentStyleRule => ({

    fontSize: Tokens.Type.xs, // Correcte key: Type

    color: Colors.light.error,

    marginTop: Tokens.Space.xs,

  }),



  /**

   * Regel voor individuele Chips

   */

  getChipStyle: (selected: boolean): { container: ComponentStyleRule; text: ComponentStyleRule } => ({

    container: {

      paddingHorizontal: Tokens.Space.md,

      paddingVertical: Tokens.Space.xs,

      borderRadius: Tokens.Radius.circle, // Correcte key: circle

      backgroundColor: selected ? Colors.light.primary : Colors.light.surface,

      borderWidth: 1,

      borderColor: selected ? Colors.light.primary : Colors.light.border,

    },

    text: {

      color: selected ? Colors.light.onPrimary : Colors.light.textPrimary,

      fontSize: Tokens.Type.sm,

    },

  }),



  /**

   * Regel voor de read-only 'Label' component

   */

  getDerivedValueStyle: (): ComponentStyleRule => ({

    fontSize: Tokens.Type.md,

    color: Colors.light.textSecondary,

    paddingVertical: Tokens.Space.xs,

  }),



 /**
   * Layout regel voor Chip groepen
   */
 getChipContainerStyle: (): ComponentStyleRule => ({
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Tokens.Space.sm,
  }),

  /**
   * Layout regel voor Radio button groepen
   */
  getRadioContainerStyle: (): ComponentStyleRule => ({
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Tokens.Space.sm,
  })

  

};