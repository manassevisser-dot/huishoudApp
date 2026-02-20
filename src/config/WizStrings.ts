// src/app/config/WizStrings.ts
/**
 * @file_intent Beheert de statische tekstuele content en lokalisatie-tokens voor de wizard en het dashboard.
 * @repo_architecture Mobile Industry (MI) - Presentation Assets Layer.
 * @term_definition WizStrings = De centrale dictionary voor UI-teksten. LABEL_TOESLAGEN = (In voorbereiding) Groepslabel voor de CollapsibleSection componenten in de financiële flows.
 * @contract Dient als de Single Source of Truth voor gebruikersgerichte communicatie. Door teksten hier te centraliseren, wordt consistentie gewaarborgd en is de applicatie voorbereid op toekomstige i18n (internationalisatie) implementaties.
 * @ai_instruction Gebruik deze tokens in de ViewModels en React componenten in plaats van hardcoded strings. Nieuwe labels voor secties (zoals 'Toeslagen') moeten hier worden toegevoegd om de herbruikbaarheid van UI-onderdelen te ondersteunen.
 */
export const WizStrings = {
  
  wizard: {
    back: 'Vorige',
    next: 'Volgende',
    finish: 'Afronden',
  },
  dashboard: {
    title: 'Dashboard',
    welcome: 'Welkom bij uw overzicht',
  },
  common: {
    loading: 'Laden...',
    error: 'Er is een fout opgetreden',
  },
};
export default WizStrings;
// 🆕 NIEUW: Group labels voor CollapsibleSection
//LABEL_TOESLAGEN: 'Toeslagen',
//LABEL_OVERIGE_VERZEKERINGEN: 'Overige verzekeringen',
//LABEL_ABONNEMENTEN: 'Abonnementen',
//},