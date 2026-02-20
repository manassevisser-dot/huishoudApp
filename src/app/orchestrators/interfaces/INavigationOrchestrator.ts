// src/app/orchestrators/interfaces/INavigationOrchestrator.ts
/**
 * @file_intent Definieert het navigatiecontract voor de applicatie, verantwoordelijk voor schermovergangen en de flow-control van de wizard.
 * @repo_architecture Mobile Industry (MI) - Navigation Interface Layer.
 * @term_definition canNavigateNext = Een guard-conditie die valideert of de huidige stap voltooid is voordat de gebruiker verder mag. startWizard = Initialiseert de lineaire flow voor het aanmaken van een nieuw huishoudprofiel.
 * @contract Ontkoppelt de UI-componenten (knoppen, menu's) van de onderliggende routeringslogica. Dwingt een abstractie af waarbij de UI alleen 'intenties' uitspreekt (bv. goToSettings), terwijl de orchestrator de daadwerkelijke state-update naar het juiste screenId afhandelt.
 * @ai_instruction Bij het toevoegen van nieuwe schermen aan de applicatie moet dit interface worden uitgebreid met de bijbehorende 'goTo' methoden om consistentie in de navigatie-architectuur te bewaren.
 */

export interface INavigationOrchestrator {
  // bestaand
  getCurrentScreenId(): string;
  canNavigateNext(): boolean;
  navigateNext(): void;
  navigateBack(): void;
  startWizard(): void;
  goToDashboard(): void;
  goToOptions(): void;
  goToSettings(): void;
  goToCsvUpload(): void;
  goToReset(): void;
  goBack(): void;
}