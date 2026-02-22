/**
 * @file_intent Definieert de configuratie voor het "Inkomensgegevens" wizard-scherm, inclusief conditionele velden en een repeater voor de inkomsten per volwassene.
 * @repo_architecture Mobile Industry (MI) - UI Configuration / Screen Definition Layer.
 * @term_definition requiresVisibilityCheck = Een vlag die aangeeft dat de zichtbaarheid van een veld afhangt van een domeinregel. visibilityRule = De specifieke regelnaam die door een orchestrator wordt geëvalueerd om de zichtbaarheid te bepalen. repeater = Een UI-patroon dat een set velden herhaalt voor elk item in een collectie (bijv. voor elk volwassen lid).
 * @contract Exporteert een statisch `incomeDetailsConfig` object. De `visibilityRule` strings vormen een contract met de bovenliggende orchestrator, die de corresponderende logica moet implementeren om velden conditioneel te tonen of verbergen.
 * @ai_instruction De zichtbaarheidslogica is ontkoppeld en wordt niet hier gedefinieerd; pas de `visibilityRule` implementaties in de orchestrator-laag aan om het gedrag te wijzigen. De `itemFields` binnen de `adultIncome` repeater specificeren welke velden voor elke volwassene worden getoond.
 */
import { UI_SECTIONS } from '@domain/constants/uiSections';
import { UX_TOKENS } from '@domain/constants/uxTokens';

export const incomeDetailsConfig = {
  screenId: UI_SECTIONS.INCOME_DETAILS,
  titleToken: UX_TOKENS.SCREENS.INCOME_DETAILS,
  fields: [
    {
      fieldId: 'huurtoeslag',
      type: 'currency',
      labelToken: 'LABEL_HUURTOESLAG',
      requiresVisibilityCheck: true,
      visibilityRule: 'showHuurtoeslag' // Orchestrator checkt: woning == huur
    },
    {
      fieldId: 'kindgebondenBudget',
      type: 'currency',
      labelToken: 'LABEL_KGB',
      requiresVisibilityCheck: true,
      visibilityRule: 'showKgb' // Orchestrator checkt: kinderen > 0
    },
    {
      fieldId: 'adultIncome',
      type: 'repeater',
      itemFields: [
        {
          fieldId: 'incomeCategory',
          type: 'chip-group-multiple',
          labelToken: 'LABEL_INCOME_CATS'
        },
        {
          fieldId: 'nettoSalaris',
          type: 'currency',
          requiresVisibilityCheck: true,
          visibilityRule: 'hasWorkSelected' // Checkt of 'werk' is aangevinkt bij dit lid
        },
        {
          fieldId: 'uitkeringType',
          type: 'chip-group-multiple',
          requiresVisibilityCheck: true,
          visibilityRule: 'hasBenefitSelected'
        }
      ]
    }
  ]
};