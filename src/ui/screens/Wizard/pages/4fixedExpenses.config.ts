/**
 * @file_intent Definieert de structuur voor het "Vaste Lasten" wizard-scherm, waarbij secties en repeaters worden gebruikt om een complexe datastructuur te representeren.
 * @repo_architecture Mobile Industry (MI) - UI Configuration / Screen Definition Layer.
 * @term_definition section = Een logische groepering van velden die door de orchestrator wordt ingevuld (bijv. alle velden gerelateerd aan huisvesting). repeater = Een UI-structuur die een set velden herhaalt voor elk item in een lijst, zoals persoonlijke uitgaven per lid of kosten per auto.
 * @contract Exporteert een statisch `fixedExpensesConfig` object. De `fieldId`s die eindigen op 'Section' zijn placeholders; de orchestrator is verantwoordelijk voor het dynamisch injecteren van de correcte velden gebaseerd op de domein-logica (bv. huur- vs. koopwoning velden).
 * @ai_instruction De inhoud van secties (zoals `housingSection`) en de zichtbaarheid van repeaters (zoals `carExpenses`) wordt volledig beheerd door de orchestrator. Om de velden binnen deze secties aan te passen, moet de logica in de orchestrator worden gewijzigd, niet in dit configuratiebestand.
 */
import { UI_SECTIONS } from '@domain/constants/uiSections';
import { UX_TOKENS } from '@domain/constants/uxTokens';

export const fixedExpensesConfig = {
  screenId: UI_SECTIONS.FIXED_EXPENSES,
  titleToken: UX_TOKENS.SCREENS.FIXED_EXPENSES,
  fields: [
    { fieldId: 'housingSection' },   // Orchestrator bepaalt: huur- of koopvelden?
    { fieldId: 'utilitiesSection' }, // Energie, water, etc.
    { fieldId: 'insuranceSection' }, // De lijst met verzekeringen
    { fieldId: 'subscriptionSection' }, 
    { fieldId: 'personExpenses', type: 'repeater' }, // Voor elk lid de persoonlijke lasten
    { fieldId: 'carExpenses', type: 'repeater' }     // Alleen als er auto's zijn
  ]
};