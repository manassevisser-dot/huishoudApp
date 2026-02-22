/**
 * @file_intent Definieert de structuur en velden voor het "Huishouden Instellen" wizard-scherm.
 * @repo_architecture Mobile Industry (MI) - UI Configuration / Screen Definition Layer.
 * @term_definition screenId = Unieke identifier die deze configuratie koppelt aan een specifieke UI-sectie. titleToken = Sleutel voor het ophalen van de gelokaliseerde schermtitel. fields = Een array van objecten die de invoervelden op het scherm specificeren.
 * @contract Exporteert een statisch `setupHouseholdConfig` object. Deze configuratie is puur data en bevat geen logica. Het wordt door de UI-laag gebruikt om het scherm dynamisch op te bouwen.
 * @ai_instruction Pas de `fields` array aan om velden toe te voegen, te verwijderen of te herordenen. Zorg ervoor dat elke `fieldId` correspondeert met een geregistreerd veld in de `FieldRegistry`. De volgorde in de array bepaalt de visuele volgorde op het scherm.
 */
import { UI_SECTIONS } from '@domain/constants/uiSections';
import { UX_TOKENS } from '@domain/constants/uxTokens';

export const setupHouseholdConfig = {
  screenId: UI_SECTIONS.HOUSEHOLD_SETUP,
  titleToken: UX_TOKENS.SCREENS.HOUSEHOLD_SETUP,
  fields: [
    { fieldId: 'aantalMensen' },
    { fieldId: 'aantalVolwassen' },
    { fieldId: 'kinderenLabel' },
    { fieldId: 'postcode' },
    { fieldId: 'autoCount' },
    { fieldId: 'heeftHuisdieren' }
  ]
};