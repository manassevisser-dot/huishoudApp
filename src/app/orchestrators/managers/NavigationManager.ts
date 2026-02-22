// src/app/orchestrators/NavigationManager.ts
/**
 * @file_intent Beheert de volgorde en hierarchie van applicatieschermen en de lineaire intake-flow.
 * @repo_architecture Mobile Industry (MI) - Navigation Management Layer.
 * @term_definition wizardSteps = Geordende wizard-screen IDs, afgeleid uit ScreenRegistry.
 * @contract Fungeert als routehulp voor next/previous binnen de wizard.
 */
import { ScreenRegistry } from '@domain/registry/ScreenRegistry';

export class NavigationManager {
  private readonly wizardSteps: string[];

  public readonly DASHBOARD = 'DASHBOARD';
  public readonly OPTIONS = 'OPTIONS';

  constructor() {
    this.wizardSteps = this.resolveWizardStepsFromRegistry();
  }

  public getFirstScreenId(): string {
    return this.wizardSteps[0] ?? '';
  }

  public getNextStep(currentStep: string): string | null {
    const currentIndex = this.wizardSteps.indexOf(currentStep);

    if (currentIndex === -1 || currentIndex === this.wizardSteps.length - 1) {
      return null;
    }

    return this.wizardSteps[currentIndex + 1] ?? null;
  }

  public getPreviousStep(currentStep: string): string | null {
    const currentIndex = this.wizardSteps.indexOf(currentStep);

    if (currentIndex > 0) {
      return this.wizardSteps[currentIndex - 1] ?? null;
    }

    if (currentIndex === 0) {
      return this.DASHBOARD;
    }

    return null;
  }

  public isLastStep(currentStep: string): boolean {
    return currentStep === (this.wizardSteps[this.wizardSteps.length - 1] ?? '');
  }

  private resolveWizardStepsFromRegistry(): string[] {
    const wizardIds = ScreenRegistry
      .getAllKeys()
      .filter((screenId) => this.isWizardScreenId(screenId));

    const firstWizardId = wizardIds.find((screenId) => {
      const def = ScreenRegistry.getDefinition(screenId);
      if (def === null) {
        return false;
      }
      return def.previousScreenId === undefined || def.previousScreenId === '';
    });

    if (firstWizardId === undefined) {
      return [];
    }

    const ordered: string[] = [];
    const visited = new Set<string>();
    let currentId: string | undefined = firstWizardId;

    while (currentId !== undefined && !visited.has(currentId) && this.isWizardScreenId(currentId)) {
      ordered.push(currentId);
      visited.add(currentId);

      const currentDef = ScreenRegistry.getDefinition(currentId);
      const nextId = currentDef?.nextScreenId;
      if (nextId === undefined || nextId === '' || !this.isWizardScreenId(nextId)) {
        break;
      }

      currentId = nextId;
    }

    return ordered;
  }

  private isWizardScreenId(screenId: string): boolean {
    const definition = ScreenRegistry.getDefinition(screenId);
    return definition !== null && definition.type === 'WIZARD';
  }
}
