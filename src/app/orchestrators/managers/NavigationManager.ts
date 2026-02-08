// src/app/orchestrators/managers/NavigationManager.ts

export class NavigationManager {
    // De exacte volgorde gebaseerd op je bestandssysteem
    private readonly wizardSteps = [
      '1setupHousehold',
      '2detailsHousehold',
      '3incomeDetails',
      '4fixedExpenses'
    ];
  
    public getNextStep(currentStep: string): string | null {
      const currentIndex = this.wizardSteps.indexOf(currentStep);
      
      // Als we niet in de lijst staan of bij de laatste stap zijn
      if (currentIndex === -1 || currentIndex === this.wizardSteps.length - 1) {
        return null; 
      }
  
      return this.wizardSteps[currentIndex + 1];
    }
  
    public getPreviousStep(currentStep: string): string | null {
      const currentIndex = this.wizardSteps.indexOf(currentStep);
      
      if (currentIndex <= 0) {
        return null;
      }
  
      return this.wizardSteps[currentIndex - 1];
    }
  
    public isLastStep(currentStep: string): boolean {
      return currentStep === this.wizardSteps[this.wizardSteps.length - 1];
    }
  }