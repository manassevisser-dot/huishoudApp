// src/ui/screens/Wizard/screens/3incomeDetails.config.ts
import { UI_SECTIONS } from '@domain/constants/uiSections';
import { UX_TOKENS } from '@domain/constants/uxTokens';

// src/ui/screens/Wizard/screens/3incomeDetails.config.ts

export const incomeDetailsConfig = {
  // Verander UI_SECTIONS.INCOME naar:
  screenId: UI_SECTIONS.INCOME_DETAILS, 
  
  // Verander UX_TOKENS.SCREENS.INCOME naar:
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
      // Geen vlaggen hier, de MasterOrchestrator injecteert de juiste lijst
      itemFields: [
        {
          fieldId: 'incomeCategory',
          type: 'chip-group-multiple',
          labelToken: 'LABEL_INCOME_CATS'
          // Opties komen via getOptions(fieldId, memberId)
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
          // Opties (DUO, WW, AOW) worden door de Orchestrator bepaald o.b.v. leeftijd
        }
      ]
    }
  ]
};