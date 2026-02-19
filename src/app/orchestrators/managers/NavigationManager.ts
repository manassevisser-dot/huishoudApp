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