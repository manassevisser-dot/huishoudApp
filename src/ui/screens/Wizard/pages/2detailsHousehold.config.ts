/**
 * @file_intent Definieert de structuur en inhoud van het "Huishoudendetails" wizard-scherm.
 * @repo_architecture Mobile Industry (MI) - UI Configuration / Screen Definition Layer.
 * @term_definition screenId = Unieke identifier die de configuratie koppelt aan een navigation entry. titleToken = Sleutel voor het ophalen van de gelokaliseerde schermtitel. repeater = Een UI-structuur voor een dynamische lijst van items, elk met eigen velden.
 * @contract Dit bestand exporteert een statische, declaratieve datastructuur (ScreenConfig). Het bevat geen uitvoerbare code of logica en dient als input voor de UI-rendering engine (bijv. een ScreenController).
 * @ai_instruction Wijzig de 'fields' array om velden op het scherm aan te passen. Voor nieuwe velden, zorg dat de 'fieldId' is geregistreerd in de domain layer. De volgorde in de array bepaalt de visuele weergave.
 */
import { UI_SECTIONS } from '@domain/constants/uiSections';
import { UX_TOKENS } from '@domain/constants/uxTokens';

export const detailsHouseholdConfig = {
  screenId: UI_SECTIONS.HOUSEHOLD_DETAILS,
  titleToken: UX_TOKENS.SCREENS.HOUSEHOLD_DETAILS,
  fields: [
    { fieldId: 'burgerlijkeStaat' },
    { fieldId: 'woningType' },
    { fieldId: 'postcode' },
    {
      fieldId: 'members',
      type: 'repeater', // De repeater zelf is een UI-structuur
      itemFields: [
        { fieldId: 'naam' },
        { fieldId: 'leeftijd' },
        { fieldId: 'gender' }
      ]
    }
  ]
};