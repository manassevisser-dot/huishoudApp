// src/app/orchestrators/NavigationManager.ts
/**
 * @file_intent Beheert de volgorde en hiërarchie van de applicatieschermen en de lineaire wizard-flow.
 * @repo_architecture Mobile Industry (MI) - Navigation Management Layer.
 * @term_definition wizardSteps = De hardcoded array die de verplichte volgorde van de intake-flow dwingt. DASHBOARD/OPTIONS = Ankerpunten buiten de lineaire wizard.
 * @contract Fungeert als de bron van waarheid voor schermvolgorde. Het berekent op basis van de huidige state wat het logische volgende of vorige scherm is, inclusief de transitie van de wizard terug naar het dashboard.
 * @ai_instruction De wizardSteps zijn strikt geordend. Bij het toevoegen van een nieuwe stap in de onboarding moet de string-ID hier op de juiste positie in de array worden geplaatst. De manager is stateless; hij reageert puur op de meegegeven `currentStep`.
 */
export class NavigationManager {
  private readonly wizardSteps = [
    '1setupHousehold',
    '2detailsHousehold',
    '3incomeDetails',
    '4fixedExpenses'
  ];

  // Voeg deze IDs toe om ze "bekend" te maken bij de manager
  public readonly DASHBOARD = 'DASHBOARD';
  public readonly OPTIONS = 'OPTIONS';

  public getFirstScreenId(): string {
    return this.wizardSteps[0];
  }

  public getNextStep(currentStep: string): string | null {
    // Als we op het dashboard zijn, is er geen logische "volgende" 
    // behalve via expliciete knoppen (startWizard), dus return null is hier veilig.
    const currentIndex = this.wizardSteps.indexOf(currentStep);
    
    if (currentIndex === -1 || currentIndex === this.wizardSteps.length - 1) {
      return null; 
    }

    return this.wizardSteps[currentIndex + 1];
  }

  public getPreviousStep(currentStep: string): string | null {
    const currentIndex = this.wizardSteps.indexOf(currentStep);
    
    // Als we in de wizard zitten, gaan we terug in de lijst
    if (currentIndex > 0) {
      return this.wizardSteps[currentIndex - 1];
    }

    // Als we bij de eerste stap zijn, is "terug" het dashboard
    if (currentIndex === 0) {
      return this.DASHBOARD;
    }

    return null;
  }

  public isLastStep(currentStep: string): boolean {
    return currentStep === this.wizardSteps[this.wizardSteps.length - 1];
  }
}